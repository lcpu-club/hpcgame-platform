import type { useLoadingBar, useNotification } from 'naive-ui'

declare global {
  interface Window {
    $loadingBar?: ReturnType<typeof useLoadingBar>
    $notification?: ReturnType<typeof useNotification>
  }
}
