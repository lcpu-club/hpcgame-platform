<template>
  <AsyncState :loading="isLoading" :error="error">
    <div class="grid grid-cols-1 gap-2">
      <template v-if="finished && !state.length">
        <NAlert type="info">暂无个人通知</NAlert>
      </template>
      <MessageCard
        v-else
        v-for="message in state"
        :key="message._id"
        :message="message"
        class="shadow"
      />
      <div class="flex justify-center">
        <NButton
          v-if="!finished"
          :loading="running"
          @click="run"
          type="primary"
        >
          加载更多
        </NButton>
      </div>
    </div>
  </AsyncState>
</template>

<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import AsyncState from '../misc/AsyncState.vue'
import { mainApi } from '@/api'
import MessageCard from './MessageCard.vue'
import { ref } from 'vue'
import { useSimpleAsyncTask } from '@/utils/async'
import { NButton, NAlert } from 'naive-ui'

const current = ref(1)
const finished = ref(false)

const { state, isLoading, error } = useAsyncState(async () => {
  const data = await mainApi.message.self.$get
    .query({
      page: current.value,
      perPage: 10
    })
    .fetch()
  finished.value = data.length < 10
  return data
}, [])

const { running, run } = useSimpleAsyncTask(async () => {
  const data = await mainApi.message.self.$get
    .query({
      page: ++current.value,
      perPage: 10
    })
    .fetch()
  if (data.length) {
    state.value.push(...data)
  }
  finished.value = data.length < 10
})
</script>
