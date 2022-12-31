<template>
  <AsyncState :loading="isLoading" :error="error">
    <div class="grid grid-cols-1 gap-2">
      <template v-if="!state.length">
        <NAlert type="info">暂无系统通知</NAlert>
      </template>
      <MessageCard
        v-else
        v-for="message in state"
        :key="message._id"
        :message="message"
        class="shadow"
      />
    </div>
  </AsyncState>
</template>

<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import AsyncState from '../misc/AsyncState.vue'
import { mainApi } from '@/api'
import MessageCard from './MessageCard.vue'

const { state, isLoading, error } = useAsyncState(async () => {
  return mainApi.message.global.$get.fetch()
}, [])
</script>
