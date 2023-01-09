import { hpcSyncChannel } from '@/utils/shared'
import type { MainDescriptor } from '@hpcgame-platform/server/src/services/main'
import { createClient } from 'typeful-fetch'

function log(msg: unknown) {
  hpcSyncChannel.postMessage({
    type: 'log',
    payload: msg
  })
}

function set(key: string, value: unknown) {
  hpcSyncChannel.postMessage({
    type: 'set',
    payload: { key, value }
  })
}

let timestamp = 0
let authToken = ''
const batchSize = 10
const mainApi = createClient<MainDescriptor>(
  import.meta.env.VITE_MAIN_API!,
  () => ({ headers: { 'auth-token': authToken } })
)

export async function pollForChange() {
  try {
    log(`Poll for change since ${timestamp}`)
    const data = await mainApi.message.poll.$get
      .query({ since: timestamp })
      .fetch()
    log(`${data.length} messages`)
    for (const message of data) {
      timestamp = Math.max(timestamp, message.createdAt + 1)
      log(`Update timestamp to ${timestamp}`)
      if (Notification.permission === 'granted') {
        new Notification(
          message.global ? 'HPCGame系统消息' : 'HPCGame用户消息',
          {
            body: message.title
          }
        )
      } else {
        hpcSyncChannel.postMessage({
          type: 'notify',
          payload: {
            type: 'info',
            title: '收到新消息',
            content: message.title,
            duration: 5000
          }
        })
      }
    }
    set('messageTimestamp', timestamp)
    return data.length === batchSize
  } catch (err) {
    log(`An error occurred: ${err}`)
    return false
  }
}

async function doSync() {
  while (await pollForChange()) {
    // do nothing
  }
  setTimeout(doSync, 10000)
}

// TypeScript do not support shared worker...
// @ts-ignore
onconnect = function (event) {
  const port = event.ports[0]

  port.onmessage = function (e: MessageEvent) {
    const { type, payload } = e.data
    switch (type) {
      case 'start':
        if (timestamp) {
          log('Message Worker Already Started...')
          return
        }
        timestamp = payload.since
        authToken = payload.token
        doSync()
        log('Message Worker Started...')
        return
    }
  }
}
