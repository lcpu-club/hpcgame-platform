<template>
  <div class="p-6 w-full hg-content-h-full flex items-center justify-center">
    <div class="shadow max-w-128">
      <NCard title="IAAA登录" segmented>
        <NSpace align="center" v-if="isLoading">
          <NSpin />
          <div class="pl-4" v-if="iaaaToken">正在处理登录请求，请稍候</div>
          <div class="pl-4" v-else>正在重定向到北京大学统一身份认证服务</div>
        </NSpace>
        <ErrorAlert v-else-if="error" :error="error" />
        <form
          action="https://iaaa.pku.edu.cn/iaaa/oauth.jsp"
          method="post"
          style="display: none"
          ref="form"
        >
          <input type="hidden" name="appID" :value="appId" />
          <input type="hidden" name="appName" :value="appName" />
          <input type="hidden" name="redirectUrl" :value="redirectUrl" />
        </form>
        <template #action>
          登录即视为您已同意
          <RouterLink to="/terms" class="text-blue-600">参赛须知</RouterLink>。
        </template>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeMount } from 'vue'
import { NCard, NSpace, NSpin } from 'naive-ui'
import { useAsyncState } from '@vueuse/core'
import { mainApi, userInfo } from '@/api'
import ErrorAlert from '@/components/misc/ErrorAlert.vue'
import { HandlerFetchError } from 'typeful-fetch'
import { finalizeLogin } from '@/utils/sync'
import { RouterLink } from 'vue-router'
const form = ref<HTMLFormElement>(null as never)

const appId = import.meta.env.VITE_IAAA_ID
const appName = import.meta.env.VITE_IAAA_NAME
const redirectUrl = import.meta.env.VITE_IAAA_REDIRECT_URL
const iaaaToken = ref('')

const { isLoading, error, execute } = useAsyncState(
  async () => {
    const token = iaaaToken.value
    try {
      const user = await mainApi.auth.iaaa.$post.body({ token }).fetch()
      userInfo.value = user
      nextTick(() => {
        finalizeLogin()
      })
    } catch (err) {
      if (err instanceof HandlerFetchError) {
        const { message } = await err.response.json()
        throw new Error(message)
      }
    }
  },
  null,
  { immediate: false }
)

onBeforeMount(() => {
  const token = localStorage.getItem('iaaaToken')
  if (token) {
    iaaaToken.value = token
    localStorage.removeItem('iaaaToken')
  }
})

onMounted(() => {
  if (iaaaToken.value) {
    execute()
  } else {
    localStorage.setItem('iaaaRedirect', location.href)
    form.value.submit()
  }
})
</script>
