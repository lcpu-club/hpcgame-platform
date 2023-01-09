import { nanoid } from 'nanoid'
import { Messages } from '../../db/message.js'
import { Submissions } from '../../db/submission.js'
import { Users } from '../../db/user.js'
import { logger } from '../../logger/index.js'
import {
  consume,
  IJudgeStatusMsg,
  IRankRequestMsg,
  judgeStatusTopic,
  rankRequestTopic
} from '../../mq/index.js'
import { publishAsync } from '../../mq/writer.js'

consume<IJudgeStatusMsg>(judgeStatusTopic, 'default', async (data) => {
  logger.info(data)
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
    { projection: { userId: 1, problemId: 1, status: 1 } }
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
    if (value.status !== 'finished') {
      if (data.done) {
        await Messages.insertOne({
          _id: nanoid(),
          global: false,
          group: '',
          userId: value.userId,
          title: '评测完成',
          content: `您的提交\`${value._id}\`已经完成评测，得分为\`${data.score}\`。`,
          metadata: {
            submissionId: value._id,
            problemId: value.problemId
          },
          createdAt: Date.now()
        })
        await publishAsync<IRankRequestMsg>(rankRequestTopic, {
          effectiveSubmissionId: value._id,
          effectiveUserId: value.userId
        })
      } else if (value.status === 'pending') {
        await Messages.insertOne({
          _id: nanoid(),
          global: false,
          group: '',
          userId: value.userId,
          title: '评测开始',
          content: `您的提交\`${value._id}\`已经开始评测，请耐心等候。`,
          metadata: {
            submissionId: value._id,
            problemId: value.problemId
          },
          createdAt: Date.now()
        })
      }
    }
  }
})
