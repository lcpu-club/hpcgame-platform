<template>
  <NLayout position="absolute">
    <AppHeader />
    <AppBody />
    <AppFooter />
  </NLayout>
</template>

<script setup lang="ts">
import { NLayout, useLoadingBar, useNotification } from 'naive-ui'
import AppHeader from '@/components/app/AppHeader.vue'
import AppBody from '@/components/app/AppBody.vue'
import AppFooter from '@/components/app/AppFooter.vue'
import { requestPermissions } from '@/utils/permissions'

const loadingBar = useLoadingBar()
window.$loadingBar = loadingBar

const notification = useNotification()
window.$notification = notification
if (!requestPermissions()) {
  notification.warning({
    title: '未给予权限',
    content: '请允许通知权限以便接收通知',
    duration: 15000
  })
}
</script>
