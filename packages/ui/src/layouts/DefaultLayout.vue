<template>
  <NLayout position="absolute">
    <AppHeader />
    <AppBody />
    <AppFooter />
  </NLayout>
</template>

<script setup lang="ts">
import { NLayout, useLoadingBar } from 'naive-ui'
import AppHeader from '@/components/app/AppHeader.vue'
import AppBody from '@/components/app/AppBody.vue'
import AppFooter from '@/components/app/AppFooter.vue'

const loadingBar = useLoadingBar()
window.$nprogress = loadingBar
</script>
