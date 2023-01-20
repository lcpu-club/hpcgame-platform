<template>
  <div class="grid grid-cols-[1fr,auto] gap-2">
    <NInput placeholder="Team Token" v-model:value="teamToken" />
    <NButton
      type="primary"
      :loading="joinTask.running.value"
      @click="joinTask.run"
    >
      加入团队
    </NButton>
  </div>
  <NDivider>OR</NDivider>
  <div class="grid grid-cols-[1fr,auto] gap-2">
    <div class="grid grid-cols-1 gap-2">
      <NInput placeholder="团队名称" v-model:value="name" />
      <NInput placeholder="团队Email" v-model:value="email" />
    </div>
    <div class="grid place-items-center">
      <NButton
        type="info"
        :loading="createTask.running.value"
        @click="createTask.run"
      >
        创建团队
      </NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mainApi, tryUpdateUser } from '@/api'
import { useSimpleAsyncTask } from '@/utils/async'
import { NButton, NDivider, NInput } from 'naive-ui'
import { ref } from 'vue'

const teamToken = ref('')
const joinTask = useSimpleAsyncTask(async () => {
  await mainApi.team.join.$post.body({ teamToken: teamToken.value }).fetch()
  await tryUpdateUser()
})

const name = ref('')
const email = ref('')
const createTask = useSimpleAsyncTask(async () => {
  await mainApi.team.create.$post
    .body({ name: name.value, email: email.value })
    .fetch()
  await tryUpdateUser()
})
</script>
