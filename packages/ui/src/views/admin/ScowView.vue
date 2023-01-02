<template>
  <div class="w-full grid grid-cols-1 gap-2">
    <NCard title="SCOW集成">
      <NSpace vertical>
        <NSpace>
          <NButton
            :loading="initTask.running.value"
            @click="initTask.run"
            type="error"
          >
            初始化SCOW
          </NButton>
        </NSpace>
        <NSpace>
          <NInput v-model:value="userId" />
          <NButton
            :loading="loadTask.running.value"
            @click="loadTask.run"
            type="info"
          >
            以该用户身份登录SCOW
          </NButton>
        </NSpace>
        <div>
          用户名：<code>{{ userId }}</code>
          <br />
          密码：<code>{{ password }}</code>
        </div>
      </NSpace>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { useSimpleAsyncTask } from '@/utils/async'
import { NButton, NCard, NInput, NSpace } from 'naive-ui'
import { mainApi, userInfo } from '@/api'
import { ref } from 'vue'
import { useSCOW } from '@/utils/scow'

const initTask = useSimpleAsyncTask(
  async () => {
    await mainApi.admin.initSCOW.$post.body({}).fetch()
  },
  { notifyOnSuccess: true }
)

const userId = ref(userInfo.value._id)
const password = ref('')

const { open } = useSCOW()

const loadTask = useSimpleAsyncTask(
  async () => {
    const { pass } = await mainApi.admin.getSCOWCredentialsFor.$post
      .body({
        _id: userId.value
      })
      .fetch()
    password.value = pass
    open(userId.value, pass)
  },
  { notifyOnSuccess: true }
)
</script>
