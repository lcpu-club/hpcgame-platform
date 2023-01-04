<template>
  <div>
    <NButton type="error" @click="logout"> 确认登出 </NButton>
  </div>
</template>
<script setup lang="ts">
import { userInfo } from '@/api'
import { finalizeLogout } from '@/utils/sync'
import { NButton } from 'naive-ui'
import { nextTick } from 'vue'

function logout() {
  userInfo.value.authToken = ''
  nextTick(() => {
    finalizeLogout()
  })
}
</script>
