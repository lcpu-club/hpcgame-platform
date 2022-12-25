<template>
  <NCard segmented>
    <AsyncState :loading="isLoading" :error="error">
      <h1 class="text-lg pb-2">公开信息</h1>
      <div class="grid grid-cols-[100px,auto] items-center gap-2">
        <div>用户ID</div>
        <NInput readonly v-model:value="state._id" />
        <div>用户名</div>
        <NInput v-model:value="state.name" />
        <div>邮箱</div>
        <NInput v-model:value="state.email" />
        <div>用户组</div>
        <div>
          <UserGroup :group="state.group" />
        </div>
      </div>
      <pre>{{ state }}</pre>
    </AsyncState>
    <template #action>
      <NSpace>
        <NButton type="primary" @click="save">保存</NButton>
        <NButton type="error" @click="reset">取消</NButton>
      </NSpace>
    </template>
  </NCard>
</template>

<script setup lang="ts">
import { mainApi, userInfo } from '@/api'
import { useTaskContext } from '@/utils/async'
import { useAsyncState } from '@vueuse/core'
import { NButton, NCard, NInput, NSpace } from 'naive-ui'
import AsyncState from '../misc/AsyncState.vue'
import UserGroup from './UserGroup.vue'

const props = defineProps<{
  userId: string
}>()

const task = useTaskContext()

const { state, isLoading, error, execute } = useAsyncState(
  () => mainApi.user.$get.query({ userId: props.userId }).fetch(),
  null as never,
  { immediate: true, shallow: false }
)

function save() {
  task.run(async () => {
    const { name, email, gender } = state.value
    return mainApi.user.$patch
      .query({ userId: props.userId })
      .body({ name, email, gender })
      .fetch()
      .then(() => {
        if (props.userId === userInfo.value._id) {
          userInfo.value = { ...userInfo.value, name, email, gender }
        }
      })
  })
}

function reset() {
  execute()
}
</script>
