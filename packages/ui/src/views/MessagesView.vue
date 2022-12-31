<template>
  <div class="p-6 w-full flex justify-center">
    <div class="w-full max-w-256 grid grid-cols-1 items-center">
      <NTabs type="segment">
        <NTabPane name="global" tab="系统通知">
          <GlobalMessages />
        </NTabPane>
        <NTabPane name="self" tab="个人通知">
          <SelfMessages />
        </NTabPane>
      </NTabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import GlobalMessages from '@/components/message/GlobalMessages.vue'
import SelfMessages from '@/components/message/SelfMessages.vue'
import { NTabs, NTabPane } from 'naive-ui'
</script>
