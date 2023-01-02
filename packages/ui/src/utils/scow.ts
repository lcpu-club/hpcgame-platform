import { useNotification } from 'naive-ui'

export function useSCOW() {
  const notification = useNotification()

  async function open(username: string, password: string) {
    const win = window.open('https://hpcgame.pku.edu.cn/demo/scow/')
    if (!win) {
      notification.error({
        title: '无法打开SCOW',
        content: '请允许网页打开新窗口'
      })
      return
    }
    for (let i = 0; i < 20; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      try {
        if (new URL(win.location.href).pathname.endsWith('auth/public/auth')) {
          const usernameInput = win.document.querySelector<HTMLInputElement>(
            'input[name="username"]'
          )
          usernameInput && (usernameInput.value = username)
          const passwordInput = win.document.querySelector<HTMLInputElement>(
            'input[name="password"]'
          )
          passwordInput && (passwordInput.value = password)
          const submitButton = win.document.querySelector<HTMLButtonElement>(
            'button[type="submit"]'
          )
          submitButton && submitButton.click()
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
  return { open }
}
