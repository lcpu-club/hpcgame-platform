<template>
  <div class="p-6 w-full hg-content-h-full flex items-center justify-center">
    <div class="shadow max-w-128">
      <NCard title="IAAA登录" segmented>
        <NSpace align="center" v-if="isLoading">
          <NSpin />
          <div class="pl-4">正在处理登录请求，请稍候</div>
        </NSpace>
        <ErrorAlert v-else-if="error" :error="error" />
        <template #action>
          登录即视为您已同意
          <RouterLink to="/terms" class="text-blue-600">参赛须知</RouterLink>。
        </template>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard, NSpace, NSpin } from 'naive-ui'
import { useAsyncState } from '@vueuse/core'
import { mainApi, userInfo } from '@/api'
import ErrorAlert from '@/components/misc/ErrorAlert.vue'
import { HandlerFetchError } from 'typeful-fetch'
import { finalizeLogin } from '@/utils/sync'
import { nextTick } from 'vue'
import { RouterLink } from 'vue-router'

const { isLoading, error } = useAsyncState(async () => {
  const token = new URLSearchParams(window.location.search).get('token')
  if (!token) throw new Error('非法访问')
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
}, null)
</script>
