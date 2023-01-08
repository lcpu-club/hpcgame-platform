<template>
  <div class="min-w-280">
    <AsyncState :loading="!state" :error="error">
      <div
        v-if="state.problems.length === 0"
        class="p-6 w-full flex justify-center"
      >
        <NAlert type="info" title="提示" class="flex-1 max-w-256">
          还没有题目放出，请稍候...
        </NAlert>
      </div>
      <div
        v-else
        class="p-6 pt-0 w-full grid grid-cols-[auto,1fr] gap-2 place-items-start justify-items-stretch"
      >
        <div class="pt-6 sticky top-0 flex">
          <ProblemList
            class="min-w-64"
            :loading="isLoading"
            @refresh="execute()"
          />
        </div>
        <div class="pt-6 flex">
          <RouterView v-slot="{ Component }">
            <Transition name="router" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </div>
      </div>
      <template #loading>
        <div class="p-6 w-full grid grid-cols-[auto,1fr] gap-2">
          <NSkeleton height="320px" class="min-w-64" />
          <NSkeleton height="320px" />
        </div>
      </template>
    </AsyncState>
  </div>
</template>

<script setup lang="ts">
import AsyncState from '@/components/misc/AsyncState.vue'
import ProblemList from '@/components/problem/ProblemList.vue'
import { useAsyncState } from '@vueuse/core'
import { NAlert, NSkeleton } from 'naive-ui'
import { provide } from 'vue'
import { loadProblemsData, kProblemsData } from '@/utils/problems'
import { tryUpdateUser } from '@/api'

const { state, isLoading, error, execute } = useAsyncState(
  async () => {
    const data = await loadProblemsData()
    state && tryUpdateUser()
    return data
  },
  null as never,
  { resetOnExecute: false }
)

provide(kProblemsData, state)
</script>
