import { Submissions } from '../../db/submission.js'
import { Users } from '../../db/user.js'
import { logger } from '../../logger/index.js'
import {
  createReader,
  IJudgeStatusMsg,
  judgeStatusTopic
} from '../../mq/index.js'

const reader = await createReader(judgeStatusTopic, 'default')

reader.on('ready', () => logger.info('NSQ is ready'))
reader.on('error', (err) => logger.error(err))

reader.on('message', async (msg) => {
  msg.finish()
  const data = JSON.parse(msg.body.toString()) as IJudgeStatusMsg
  logger.info(data)
  try {
    const { value } = await Submissions.findOneAndUpdate(
      {
        _id: data.submission_id,
        updatedAt: { $lt: data.timestamp }
      },
      {
        $set: {
          status: data.done ? 'finished' : 'running',
          score: data.score,
          message: data.message,
          updatedAt: data.timestamp
        }
      },
      { projection: { userId: 1, problemId: 1 } }
    )
    if (value) {
      await Users.updateOne(
        {
          _id: value.userId,
          [`problemStatus.${value.problemId}.effectiveSubmissionId`]:
            data.submission_id
        },
        {
          $set: {
            [`problemStatus.${value.problemId}.score`]: data.score
          } as never
        }
      )
    }
  } catch (err) {
    logger.error(err)
  }
})
