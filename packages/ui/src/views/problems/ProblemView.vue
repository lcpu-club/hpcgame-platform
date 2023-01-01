<template>
  <div v-if="problem" class="flex-1 grid grid-col-1 gap-2">
    <NCard :title="problem.title" segmented>
      <AsyncState :loading="isLoading" :error="error">
        <article class="markdown-body" v-html="state"></article>
      </AsyncState>
      <template #footer>
        <NSpace>
          <NTag>分类：{{ problem.category }}</NTag>
          <NTag>提交次数限制：{{ problem.maxSubmissionCount }}</NTag>
          <NTag>
            提交大小限制：{{ prettyPrintBytes(problem.maxSubmissionSize) }}
          </NTag>
          <NTag v-for="tag in problem.tags" :key="tag">{{ tag }}</NTag>
        </NSpace>
      </template>
      <template #action>
        <ProblemSubmit
          :problem-id="problem._id"
          :max-size="problem.maxSubmissionSize"
          :max-count="problem.maxSubmissionCount"
        />
      </template>
    </NCard>
    <NCard title="提交记录" segmented content-style="padding: 0;">
      <SubmissionList :problem-id="problem._id" />
    </NCard>
  </div>
  <NotFoundView v-else />
</template>

<script setup lang="ts">
import { useProblemsData } from '@/utils/problems'
import { NCard, NSpace, NTag } from 'naive-ui'
import { computed } from 'vue'
import NotFoundView from '@/views/NotFoundView.vue'
import AsyncState from '@/components/misc/AsyncState.vue'
import { mainApi } from '@/api'
import { useAsyncState } from '@vueuse/core'
import { render } from '@/utils/md'
import { prettyPrintBytes } from '@/utils/format'
import ProblemSubmit from '@/components/problem/ProblemSubmit.vue'
import SubmissionList from '@/components/submission/SubmissionList.vue'

const props = defineProps<{
  id: string
}>()

const problemsData = useProblemsData()
const problem = computed(() =>
  problemsData.value.problems.find((p) => p._id === props.id)
)

const { state, isLoading, error } = useAsyncState(async () => {
  const { result } = await mainApi.problem.render.$get
    .query({ _id: props.id })
    .fetch()
  return render(result)
}, '')
</script>
