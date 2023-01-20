import { nanoid } from 'nanoid/async'
import { Messages } from '../../db/message.js'
import { Submissions } from '../../db/submission.js'
import { Teams } from '../../db/team.js'
import { logger } from '../../logger/index.js'
import { consume, IJudgeStatusMsg, judgeStatusTopic } from '../../mq/index.js'

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
    if (data.done) {
      await Teams.updateOne(
        {
          _id: value.teamId,
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
    if (value.status !== 'finished') {
      if (data.done) {
        await Messages.insertOne({
          _id: await nanoid(),
          global: false,
          group: '',
          userId: '',
          teamId: value.teamId,
          title: '评测完成',
          content: `您的提交\`${value._id}\`已经完成评测，得分为\`${data.score}\`。`,
          metadata: {
            submissionId: value._id,
            problemId: value.problemId
          },
          createdAt: Date.now()
        })
      } else if (value.status === 'pending') {
        await Messages.insertOne({
          _id: await nanoid(),
          global: false,
          group: '',
          userId: '',
          teamId: value.teamId,
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
