<template>
  <NLoadingBarProvider>
    <NConfigProvider :locale="zhCN" :date-locale="dateZhCN">
      <NNotificationProvider placement="bottom-right">
        <NDialogProvider>
          <NLoadingBarProvider>
            <DefaultLayout />
          </NLoadingBarProvider>
        </NDialogProvider>
      </NNotificationProvider>
    </NConfigProvider>
  </NLoadingBarProvider>
</template>

<script setup lang="ts">
import {
  NNotificationProvider,
  NDialogProvider,
  NConfigProvider,
  NLoadingBarProvider,
  zhCN,
  dateZhCN
} from 'naive-ui'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>
