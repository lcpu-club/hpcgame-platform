<template>
  <NLayout position="absolute">
    <AppHeader />
    <AppBody />
    <AppFooter />
  </NLayout>
</template>

<script setup lang="ts">
import { NLayout, useDialog, useLoadingBar, useNotification } from 'naive-ui'
import AppHeader from '@/components/app/AppHeader.vue'
import AppBody from '@/components/app/AppBody.vue'
import AppFooter from '@/components/app/AppFooter.vue'
import { requestPermissions } from '@/utils/permissions'

const loadingBar = useLoadingBar()
window.$loadingBar = loadingBar

const notification = useNotification()
window.$notification = notification

const dialog = useDialog()
window.$dialog = dialog

requestPermissions()
</script>
