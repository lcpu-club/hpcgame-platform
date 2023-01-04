import { hpcSyncChannel } from './shared'

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
      localStorage.setItem(payload.key, payload.value)
      return
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
