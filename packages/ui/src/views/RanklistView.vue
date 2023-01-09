<template>
  <div class="min-w-280">
    <AsyncState :loading="!state" :error="error">
      <div v-if="state.length === 0" class="p-6 w-full flex justify-center">
        <NAlert type="info" title="提示" class="flex-1 max-w-256">
          还没有排行榜信息，请稍候...
        </NAlert>
      </div>
      <div v-else class="p-6">
        <NCard title="排行榜" class="shadow" segmented>
          <template #header-extra>
            <NButton :loading="isLoading" @click="execute()" type="info">
              刷新
            </NButton>
          </template>
          <NTabs type="segment">
            <NTabPane
              v-for="ranklist of state"
              :key="ranklist._id"
              :name="ranklist.name"
              :tab="ranklist.name"
            >
              <RanklistDisplay v-if="!isLoading" :id="ranklist._id" />
            </NTabPane>
          </NTabs>
        </NCard>
      </div>
    </AsyncState>
  </div>
</template>

<script setup lang="ts">
import AsyncState from '@/components/misc/AsyncState.vue'
import { useAsyncState } from '@vueuse/core'
import { NAlert, NCard, NButton, NTabs, NTabPane } from 'naive-ui'
import { provide } from 'vue'
import { loadRanklistsData, kRanklistsData } from '@/utils/ranklist'
import RanklistDisplay from '@/components/ranklist/RanklistDisplay.vue'

const { state, isLoading, error, execute } = useAsyncState(
  async () => {
    const data = await loadRanklistsData()
    return data
  },
  null as never,
  { resetOnExecute: false }
)

provide(kRanklistsData, state)
</script>
