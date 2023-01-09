import { logger } from '../../logger/index.js'
import {
  consume,
  IJudgeRequestMsg,
  IJudgeStatusMsg,
  judgeRequestTopic,
  judgeStatusTopic
} from '../../mq/index.js'
import { publishAsync } from '../../mq/writer.js'

consume<IJudgeRequestMsg>(judgeRequestTopic, 'default', async (data) => {
  console.log(data)
  await publishAsync<IJudgeStatusMsg>(judgeStatusTopic, {
    submission_id: data.submission_id,
    done: false,
    score: 0,
    message: 'Running',
    timestamp: Date.now() * 1000,
    success: true,
    error: ''
  })
  console.log('Running...')
  setTimeout(() => {
    publishAsync<IJudgeStatusMsg>(judgeStatusTopic, {
      submission_id: data.submission_id,
      done: true,
      score: 100,
      message: 'Accepted',
      timestamp: Date.now() * 1000,
      success: true,
      error: ''
    })
    console.log('Accepted!')
  }, 2000)
})
