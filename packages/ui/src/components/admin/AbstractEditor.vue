<template>
  <NCard :title="props.title ?? '编辑'">
    <AsyncState :loading="isLoading" :error="error">
      <component :is="props.editor" v-bind="props.editorProps" :model="state" />
    </AsyncState>
    <template #action>
      <NSpace>
        <NButton @click="doSave" type="primary">保存</NButton>
        <NButton @click="doReset" type="warning">取消</NButton>
        <NButton @click="doRemove" type="error" v-if="props.remove">
          删除
        </NButton>
      </NSpace>
    </template>
  </NCard>
</template>

<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import AsyncState from '../misc/AsyncState.vue'
import { useTaskContext } from '@/utils/async'
import { NButton, NCard, NSpace } from 'naive-ui'
import { useRouter } from 'vue-router'

const props = defineProps<{
  load: () => Promise<unknown>
  save: (data: unknown) => Promise<unknown>
  remove?: () => Promise<string>
  editor: unknown
  editorProps?: unknown
  title?: string
}>()

const { state, isLoading, error, execute } = useAsyncState(props.load, null, {
  immediate: true
})

const router = useRouter()

const task = useTaskContext()

function doSave() {
  task.run(() => props.save(state.value))
}

function doReset() {
  execute()
}

async function doRemove() {
  const [, result] = await task.run(async () => props.remove?.())
  if (result) router.replace(result)
}
</script>
