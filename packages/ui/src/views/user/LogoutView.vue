<template>
  <div>
    <NButton type="error" @click="logout"> 确认登出 </NButton>
  </div>
</template>
<script setup lang="ts">
import { userInfo } from '@/api'
import { doSync } from '@/utils/sync'
import { NButton } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  userInfo.value.authToken = ''
  router.replace('/')
  doSync('logout')
}
</script>
