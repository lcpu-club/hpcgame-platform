<template>
  <div class="p-6 w-full hg-content-h-full flex items-center justify-center">
    <div class="shadow w-90">
      <NCard title="邮箱登录" segmented>
        <div class="grid grid-cols-[1fr,auto] gap-2 w-full">
          <NInput type="text" placeholder="邮箱" v-model:value="mail" />
          <NButton
            type="info"
            :disabled="!mail || !response || waiting"
            :loading="sendTask.isLoading.value"
            @click="sendTask.execute"
          >
            {{ waiting ? `${remaining}s` : '发送验证码' }}
          </NButton>
        </div>
        <center class="pt-4">
          <ReCaptcha @verify="onVerify" />
        </center>
        <template #footer v-if="showLogin">
          <div class="grid grid-cols-[1fr,auto] gap-2 w-full">
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
import { NCard, NButton, NInput, useNotification } from 'naive-ui'
import { nextTick, ref } from 'vue'
import { mainApi, userInfo } from '@/api'
import { useCountdown } from '@/utils/countdown'
import { getErrorMessage } from '@/utils/error'
import { finalizeLogin } from '@/utils/sync'

const mail = ref('')
const response = ref('')
const onVerify = (token: string) => {
  response.value = token
}

const code = ref('')
const { remaining, waiting, start } = useCountdown()
const notification = useNotification()
const showLogin = ref(false)

const sendTask = useAsyncState(
  async () => {
    try {
      await mainApi.auth['mail/send'].$post
        .body({
          mail: mail.value,
          response: response.value
        })
        .fetch()
      start(60)
      showLogin.value = true
      notification.success({
        title: '发送验证码成功',
        description: '验证码5分钟内有效，请检查您的收件箱',
        duration: 5000
      })
    } catch (err) {
      notification.error({
        title: '发送验证码失败',
        description: await getErrorMessage(err),
        duration: 5000
      })
    }
  },
  null,
  { immediate: false }
)

const loginTask = useAsyncState(
  async () => {
    try {
      const user = await mainApi.auth['mail/verify'].$post
        .body({
          mail: mail.value,
          code: code.value
        })
        .fetch()
      userInfo.value = user
      nextTick(() => {
        finalizeLogin()
      })
    } catch (err) {
      notification.error({
        title: '登陆失败',
        description: await getErrorMessage(err),
        duration: 5000
      })
    }
  },
  null,
  { immediate: false }
)
</script>
