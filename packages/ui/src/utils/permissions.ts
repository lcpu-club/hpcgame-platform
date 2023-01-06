export function requestPermissions() {
  if (Notification.permission === 'default') {
    window.$dialog?.info({
      title: '授予通知权限',
      content: '请授予网站通知权限以便接收平台消息',
      positiveText: '好',
      onPositiveClick: () => {
        Notification.requestPermission((permission) => {
          if (permission === 'granted') {
            window.$notification?.success({
              title: '成功授予通知权限',
              content: '将通过系统通知推送平台消息'
            })
            new Notification('通知权限已授予', {
              body: '将通过系统通知推送平台消息'
            })
          } else {
            window.$notification?.warning({
              title: '未授予通知权限',
              content: '将通过站内通知推送平台消息'
            })
          }
        })
      }
    })
  }
}
