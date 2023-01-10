<template>
  <div class="min-w-280">
    <AsyncState :loading="!state" :error="error">
      <template #loading>
        <div class="p-6 w-full flex justify-center">
          <NSkeleton height="480px" class="max-w-256" />
        </div>
      </template>
      <div v-if="state.length === 0" class="p-6 w-full flex justify-center">
        <NAlert type="info" title="提示" class="flex-1 max-w-256">
          还没有排行榜信息，请稍候...
        </NAlert>
      </div>
      <div v-else class="p-6 flex justify-center">
        <NCard title="排行榜" class="shadow max-w-320" segmented>
          <template #header-extra>
            <NSpace>
              <NPopover trigger="hover">
                <template #trigger>
                  <NButton
                    circle
                    quaternary
                    type="info"
                    :render-icon="renderNIcon(mdiHelp)"
                  />
                </template>
                <span>排行榜为延时生成，稍安勿躁。</span>
              </NPopover>
              <NButton :loading="isLoading" @click="execute()" type="info">
                刷新
              </NButton></NSpace
            >
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
import {
  NAlert,
  NCard,
  NButton,
  NTabs,
  NTabPane,
  NPopover,
  NSpace,
  NSkeleton
} from 'naive-ui'
import { provide } from 'vue'
import { loadRanklistsData, kRanklistsData } from '@/utils/ranklist'
import RanklistDisplay from '@/components/ranklist/RanklistDisplay.vue'
import { renderNIcon } from '@/utils/renderIcon'
import { mdiHelp } from '@mdi/js'

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
