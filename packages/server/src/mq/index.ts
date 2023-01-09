import { Message, Reader, Writer } from 'nsqjs'
import {
  NSQ_NSQD_HOST,
  NSQ_LOOKUPD_ADDR,
  NSQ_NSQD_PORT
} from '../config/index.js'
import { logger } from '../logger/index.js'

export async function createWriter() {
  const writer = new Writer(NSQ_NSQD_HOST, NSQ_NSQD_PORT)
  writer.connect()
  await new Promise<void>((resolve) => {
    writer.on('ready', resolve)
  })
  return writer
}

export function consume<T>(
  topic: string,
  channel: string,
  handler: (data: T, message: Message) => unknown,
  options?: { manual?: boolean }
) {
  const reader = new Reader(topic, channel, {
    lookupdHTTPAddresses: NSQ_LOOKUPD_ADDR
  })
  reader.connect()
  reader.on('ready', () =>
    logger.info(`NSQ Reader ${topic}:${channel} is ready`)
  )
  reader.on('error', (err) =>
    logger.error(err, `NSQ Reader ${topic}:${channel} Internal Error`)
  )
  reader.on('message', async (msg) => {
    try {
      options?.manual || msg.touch()
      await Promise.resolve(handler(msg.json(), msg))
      options?.manual || msg.finish()
    } catch (err) {
      logger.error(err, `NSQ Reader ${topic}:${channel} Handler Error`)
      options?.manual || msg.requeue()
    }
  })
  return reader
}

export const judgeRequestTopic = 'runner.judge.request'
export interface IJudgeRequestMsg {
  runner_args: string
  runner_user: string
  runner_pass: string
  problem_id: string
  submission_id: string
  user_id: string
  user_group: string
}

export const judgeStatusTopic = 'runner.judge.status'
export interface IJudgeStatusMsg {
  submission_id: string
  done: boolean
  success: boolean
  error: string
  score: number
  message: string
  timestamp: number
}

export const rankRequestTopic = 'ranker.request'
export interface IRankRequestMsg {
  effectiveSubmissionId?: string
  effectiveUserId?: string
}
