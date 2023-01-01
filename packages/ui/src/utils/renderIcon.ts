import { NIcon, type IconProps } from 'naive-ui'
import { h } from 'vue'
import MdiIcon from '@/components/misc/MdiIcon.vue'

export function renderMdiIcon(path: string) {
  return () => h(MdiIcon, { path })
}

export function renderNIcon(path: string, props: IconProps | null = null) {
  return () =>
    h(NIcon, props, {
      default: renderMdiIcon(path)
    })
}
