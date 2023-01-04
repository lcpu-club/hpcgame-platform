<template>
  <NSpin :show="running">
    <slot />
  </NSpin>
</template>

<script setup lang="ts">
import { kTaskContext } from '@/utils/async'
import { getErrorMessage } from '@/utils/error'
import { NSpin, useNotification } from 'naive-ui'
import { provide, ref } from 'vue'

const running = ref(false)
const notification = useNotification()

provide(kTaskContext, {
  running,
  run: async (task) => {
    running.value = true
    try {
      const result = await task()
      notification.success({
        title: '操作成功',
        duration: 5000
      })
      running.value = false
      return [null, result]
    } catch (err) {
      notification.error({
        title: '操作失败',
        description: await getErrorMessage(err),
        duration: 5000
      })
      running.value = false
      return [err, null]
    }
  }
})
</script>
