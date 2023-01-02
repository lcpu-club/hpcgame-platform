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
          <NInput v-model:value="userId" placeholder="用户ID" />
          <NInput v-model:value="problemId" placeholder="题目ID" />
          <NButton
            :loading="loadTask.running.value"
            @click="loadTask.run"
            type="info"
          >
            以{{ problemId ? '评测机' : '用户' }}身份登录SCOW
          </NButton>
        </NSpace>
        <div>
          用户名：<code>{{ user }}</code>
          <br />
          密码：<code>{{ pass }}</code>
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
const problemId = ref('')
const user = ref('')
const pass = ref('')

const { open } = useSCOW()

const loadTask = useSimpleAsyncTask(
  async () => {
    const api = problemId.value
      ? mainApi.admin.getSCOWCredentialsForProblem.$post.body({
          _id: userId.value,
          problemId: problemId.value
        })
      : mainApi.admin.getSCOWCredentialsForUser.$post.body({
          _id: userId.value
        })
    const { _id, password } = await api.fetch()
    user.value = _id
    pass.value = password
    open(_id, password)
  },
  { notifyOnSuccess: true }
)
</script>
