import { useLocalStorage } from '@vueuse/core'

export interface IPermissions {
  notifications: boolean
  [key: string]: boolean
}

const permissions = useLocalStorage<IPermissions>(
  'permissions',
  { notifications: false },
  { deep: true }
)

export function requestPermissions() {
  Notification.requestPermission(function (permission) {
    if (permission === 'granted') {
      if (!permissions.value.notifications) {
        permissions.value.notifications = true
        window.$notification?.success({
          title: '成功授予通知权限',
          content: '将通过系统通知推送平台消息'
        })
        new Notification('通知权限已授予', {
          body: '将通过系统通知推送平台消息'
        })
      }
    }
  })
  return Object.keys(permissions.value).every((key) => permissions.value[key])
}
