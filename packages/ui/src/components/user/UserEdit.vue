<template>
  <NCard segmented>
    <AsyncState :loading="isLoading" :error="error">
      <h1 class="text-lg pb-2">公开信息</h1>
      <div
        class="grid grid-cols-[100px,1fr] auto-rows-fr items-center gap-2 pb-2"
      >
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
        <div>用户标签</div>
        <UserTags :tags="state.tags" show-empty />
      </div>
      <hr class="pb-2" />
      <h1 class="text-lg pb-2">个人信息</h1>
      <div class="grid grid-cols-[100px,1fr] items-center gap-2 pb-2">
        <div>真实姓名</div>
        <NInput :readonly="isPKU" v-model:value="state.metadata.realname" />
        <div>QQ</div>
        <NInput v-model:value="state.metadata.qq" />
        <div>学校或组织名称</div>
        <NInput :readonly="isPKU" v-model:value="state.metadata.organization" />
      </div>
      <hr class="pb-2" />
      <h1 class="text-lg pb-2">登录信息</h1>
      <div class="grid grid-cols-[100px,1fr] items-center gap-2 pb-2">
        <div>IAAA账号</div>
        <NInput readonly :value="state.iaaaId ?? '未绑定'" />
        <div>登录邮箱</div>
        <NInput readonly :value="state.authEmail ?? '未绑定'" />
      </div>
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
import { computed } from 'vue'
import AsyncState from '../misc/AsyncState.vue'
import UserGroup from './UserGroup.vue'
import UserTags from './UserTags.vue'

const task = useTaskContext()

const isPKU = computed(() => userInfo.value.group === 'pku')

const { state, isLoading, error, execute } = useAsyncState(
  () => mainApi.user.$get.fetch(),
  null as never,
  { immediate: true, shallow: false }
)

function save() {
  task.run(async () => {
    const { name, email, metadata } = state.value
    return mainApi.user.$patch
      .body({ name, email, metadata })
      .fetch()
      .then(() => {
        userInfo.value = { ...userInfo.value, name, email, metadata }
      })
  })
}

function reset() {
  execute()
}
</script>
