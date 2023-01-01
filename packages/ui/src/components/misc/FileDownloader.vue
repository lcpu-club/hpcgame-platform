<template>
  <NButton v-bind="props.btnProps" @click="run" :loading="running">
    <slot />
  </NButton>
</template>

<script setup lang="ts">
import { useSimpleAsyncTask } from '@/utils/async'
import { NButton, type ButtonProps } from 'naive-ui'

const props = defineProps<{
  btnProps?: ButtonProps
  generator: () => Promise<string>
  filename?: string
  openInNew?: boolean
}>()

const { run, running } = useSimpleAsyncTask(async () => {
  const url = await props.generator()
  if (props.openInNew) {
    window.open(url)
    return
  }
  const link = document.createElement('a')
  link.href = url
  link.download = props.filename ?? ''
  link.click()
})
</script>
