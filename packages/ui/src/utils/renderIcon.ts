import { NIcon } from 'naive-ui'
import { h } from 'vue'
import MdiIcon from '@/components/misc/MdiIcon.vue'

export function renderMdiIcon(path: string) {
  return () => h(MdiIcon, { path })
}

export function renderNIcon(path: string) {
  return () =>
    h(NIcon, null, {
      default: renderMdiIcon(path)
    })
}
