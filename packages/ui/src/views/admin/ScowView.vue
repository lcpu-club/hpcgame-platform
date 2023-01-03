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
        <NSpace>
          <NInput v-model:value="accountName" placeholder="账户名" />
          <NSwitch v-model:value="block" />
        </NSpace>
        <NSpace>
          <NButton
            :loading="blockTask.running.value"
            @click="blockTask.run"
            type="primary"
            :disabled="!accountName"
          >
            {{ block ? '封锁' : '解封' }}账户{{ accountName }}
          </NButton>
          <NButton
            :loading="syncTask.running.value"
            @click="syncTask.run"
            type="warning"
          >
            同步账户封锁状态
          </NButton>
        </NSpace>
        <div>
          <pre v-text="syncLog"></pre>
        </div>
      </NSpace>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { useSimpleAsyncTask } from '@/utils/async'
import { NButton, NCard, NInput, NSpace, NSwitch } from 'naive-ui'
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

const accountName = ref('')
const block = ref(false)
const syncLog = ref('')

const syncTask = useSimpleAsyncTask(
  async () => {
    const { log } = await mainApi.admin.syncAccountStatusWithSlurm.$post
      .body({})
      .fetch()
    syncLog.value = log
  },
  { notifyOnSuccess: true }
)

const blockTask = useSimpleAsyncTask(
  async () => {
    const { log } = await mainApi.admin.scowSetAccountBlock.$post
      .body({
        accountName: accountName.value,
        block: block.value
      })
      .fetch()
    syncLog.value = log
  },
  { notifyOnSuccess: true }
)
</script>
