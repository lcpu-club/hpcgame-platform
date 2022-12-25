import { Reader, Writer } from 'nsqjs'
import {
  NSQ_NSQD_HOST,
  NSQ_LOOKUPD_ADDR,
  NSQ_NSQD_PORT
} from '../config/index.js'

export async function createWriter() {
  const writer = new Writer(NSQ_NSQD_HOST, NSQ_NSQD_PORT)
  writer.connect()
  await new Promise<void>((resolve) => {
    writer.on('ready', resolve)
  })
  return writer
}

export async function createReader(topic: string, channel: string) {
  const reader = new Reader(topic, channel, {
    lookupdHTTPAddresses: NSQ_LOOKUPD_ADDR
  })
  reader.connect()
  return reader
}
