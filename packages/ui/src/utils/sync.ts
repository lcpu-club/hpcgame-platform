import { hash } from './meta'
import { hpcSyncChannel } from './shared'
import { setItem } from './storage'

hpcSyncChannel.addEventListener('message', (ev) => {
  const { type, payload } = ev.data
  switch (type) {
    case 'login':
      return location.reload()
    case 'logout':
      return location.reload()
    case 'notify':
      return window.$notification?.create(payload)
    case 'log':
      return console.log(payload)
    case 'set':
      setItem(payload.key, payload.value)
      return
    case 'sync':
      if (payload !== hash) {
        location.reload()
      }
  }
})

export function finalizeLogout() {
  hpcSyncChannel.postMessage({ type: 'logout' })
  location.reload()
}

export function finalizeLogin() {
  hpcSyncChannel.postMessage({ type: 'login' })
  location.reload()
}

export function syncVersion() {
  hpcSyncChannel.postMessage({ type: 'sync', payload: hash })
}
