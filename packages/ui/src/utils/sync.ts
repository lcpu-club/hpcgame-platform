import router from '@/router'

export const channel = new BroadcastChannel('hpc-sync')
channel.addEventListener('message', (ev) => {
  const { type } = ev.data
  switch (type) {
    case 'logout':
      return router.replace('/')
  }
})

export function doSync(type: 'logout') {
  channel.postMessage({ type })
}
