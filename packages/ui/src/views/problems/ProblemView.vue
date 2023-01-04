<template>
  <div v-if="problem" class="flex-1 grid grid-col-1 gap-2">
    <NCard :title="problem.title" segmented>
      <AsyncState :loading="isLoading" :error="error">
        <article class="markdown-body" v-html="state"></article>
        <template v-if="attachments.length">
          <NDivider />
          <h3>附件</h3>
          <div
            class="grid grid-cols-[auto,1fr] gap-2 auto-rows-fr place-items-center justify-items-start"
          >
            <template v-for="attachment in attachments" :key="attachment.key">
              <div>{{ attachment.label }}</div>
              <FileDownloader
                :generator="getGeneratorFor(attachment.key)"
                :filename="attachment.key"
                :btn-props="{ type: 'info', ghost: true }"
              >
                下载<code>{{ attachment.key }}</code>
              </FileDownloader>
            </template>
          </div>
        </template>
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
          :allowed-extensions="allowedExtensions"
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
import { NCard, NSpace, NTag, NDivider } from 'naive-ui'
import { computed } from 'vue'
import NotFoundView from '@/views/NotFoundView.vue'
import AsyncState from '@/components/misc/AsyncState.vue'
import { mainApi } from '@/api'
import { useAsyncState } from '@vueuse/core'
import { render } from '@/utils/md'
import { prettyPrintBytes } from '@/utils/format'
import ProblemSubmit from '@/components/problem/ProblemSubmit.vue'
import SubmissionList from '@/components/submission/SubmissionList.vue'
import { s3url } from '@/utils/misc'
import FileDownloader from '@/components/misc/FileDownloader.vue'

const props = defineProps<{
  id: string
}>()

const problemsData = useProblemsData()
const problem = computed(() =>
  problemsData.value.problems.find((p) => p._id === props.id)
)
const allowedExtensions = computed(
  () => (problem.value?.metadata.allowedExtensions as string[]) ?? ['tar']
)
interface IAttachment {
  label: string
  key: string
}
const attachments = computed(
  () => (problem.value?.metadata.attachments ?? []) as IAttachment[]
)

const { state, isLoading, error } = useAsyncState(async () => {
  const { result } = await mainApi.problem.render.$get
    .query({ _id: props.id })
    .fetch()
  return render(result)
}, '')

function getGeneratorFor(key: string) {
  return async () => {
    const { url } = await mainApi.problem.getDownloadUrl.$post
      .body({
        _id: props.id,
        key
      })
      .fetch()
    return s3url(url)
  }
}
</script>
