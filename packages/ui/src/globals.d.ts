import type { useLoadingBar } from 'naive-ui'

declare global {
  interface Window {
    $nprogress?: ReturnType<typeof useLoadingBar>
  }
}
