<template>
  <div class="p-6 w-full hg-content-h-full flex items-center justify-center">
    <div class="shadow max-w-128">
      <NCard title="邮箱登录" segmented>
        <div class="grid grid-cols-[1fr,auto] gap-2">
          <NInput type="text" placeholder="邮箱" v-model:value="mail" />
          <NButton
            type="info"
            :disabled="!mail || !response"
            :loading="sendTask.isLoading.value"
            @click="sendTask.execute"
          >
            发送验证码
          </NButton>
        </div>
        <div class="pt-4">
          <ReCaptcha @verify="onVerify" />
        </div>
        <template #footer>
          <div class="grid grid-cols-[1fr,auto] gap-2">
            <NInput type="text" placeholder="验证码" v-model:value="code" />
            <NButton
              type="primary"
              @click="loginTask.execute"
              :loading="loginTask.isLoading.value"
            >
              登录
            </NButton>
          </div>
        </template>
        <template #action>
          登录即视为您已同意
          <RouterLink to="/terms" class="text-blue-600">参赛须知</RouterLink>。
        </template>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import ReCaptcha from '@/components/misc/ReCaptcha.vue'
import { useAsyncState } from '@vueuse/core'
import { NCard, NButton, NInput } from 'naive-ui'
import { ref } from 'vue'
import { mainApi, userInfo } from '@/api'
import { useRouter } from 'vue-router'

const mail = ref('')
const response = ref('')
const onVerify = (token: string) => {
  response.value = token
}

const code = ref('')

const sendTask = useAsyncState(async () => {
  await mainApi.auth['mail/send'].$post
    .body({
      mail: mail.value,
      response: response.value
    })
    .fetch()
}, null)

const router = useRouter()

const loginTask = useAsyncState(async () => {
  const user = await mainApi.auth['mail/verify'].$post
    .body({
      mail: mail.value,
      code: code.value
    })
    .fetch()
  userInfo.value = user
  router.replace('/')
}, null)
</script>
