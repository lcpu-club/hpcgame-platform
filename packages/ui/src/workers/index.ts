import { authToken } from '@/api'
import { getItem } from '@/utils/storage'
import MessageWorker from './message?sharedworker'

export function startMessageWorker() {
  try {
    const worker = new MessageWorker()
    worker.port.start()
    worker.port.postMessage({
      type: 'start',
      payload: {
        since: parseInt(getItem('messageTimestamp') ?? '0') || Date.now(),
        token: authToken.value
      }
    })
  } catch (err) {
    console.log(err)
  }
}
