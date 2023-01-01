import { logger } from '../../logger/index.js'
import {
  createReader,
  IJudgeRequestMsg,
  IJudgeStatusMsg,
  judgeRequestTopic,
  judgeStatusTopic
} from '../../mq/index.js'
import { publishAsync } from '../../mq/writer.js'

const reader = await createReader(judgeRequestTopic, 'default')

reader.on('ready', () => logger.info('NSQ is ready'))
reader.on('error', (err) => logger.error(err))

reader.on('message', async (msg) => {
  msg.finish()
  const data = JSON.parse(msg.body.toString()) as IJudgeRequestMsg
  console.log(data)
  await publishAsync(judgeStatusTopic, {
    submission_id: data.submission_id,
    done: false,
    score: 0,
    message: 'Running',
    timestamp: Date.now()
  } as IJudgeStatusMsg)
  console.log('Running...')
  setTimeout(() => {
    publishAsync(judgeStatusTopic, {
      submission_id: data.submission_id,
      done: true,
      score: 100,
      message: 'Accepted',
      timestamp: Date.now()
    } as IJudgeStatusMsg)
    console.log('Accepted!')
  }, 2000)
})
