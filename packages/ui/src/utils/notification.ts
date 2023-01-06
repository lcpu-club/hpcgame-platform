import { startMessageWorker } from '@/workers'
import { requestPermissions } from '@/utils/permissions'

function isSupportedEnvironment() {
  // Safari Mobile
  if (!('Notification' in window)) {
    return false
  }
  // Chrome Mobile
  // @ts-ignore
  if (navigator.userAgentData?.mobile) {
    return false
  }
  // Must support SharedWorker
  if (!('SharedWorker' in window)) {
    return false
  }
  return true
}

export function enableNotification() {
  if (!isSupportedEnvironment()) {
    window.$notification?.warning({
      title: '不支持推送通知',
      content: '建议使用桌面浏览器以获得更好的体验'
    })
    return
  }
  requestPermissions()
  startMessageWorker()
}
