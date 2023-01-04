import { authToken } from '@/api'
import MessageWorker from './message?sharedworker'

export function startMessageWorker() {
  const worker = new MessageWorker()
  worker.port.start()
  worker.port.postMessage({
    type: 'start',
    payload: {
      since:
        parseInt(localStorage.getItem('messageTimestamp') ?? '0') || Date.now(),
      token: authToken.value
    }
  })
}
