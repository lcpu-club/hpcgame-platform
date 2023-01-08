<template>
  <NCard title="评测日志" segmented>
    <AsyncState :loading="isLoading" :error="error">
      <NTabs type="segment" animated>
        <NTabPane v-if="state.json" name="parsed" tab="可视化">
          <ResultCase :json="state.json" />
        </NTabPane>
        <NTabPane name="raw" tab="原始内容">
          <div class="grid">
            <NScrollbar x-scrollable>
              <article class="markdown-body" v-html="state.html"></article>
            </NScrollbar>
          </div>
        </NTabPane>
      </NTabs>
    </AsyncState>
    <template #action v-if="state">
      <NSpace>
        <NButton
          type="info"
          @click="execute()"
          :render-icon="renderNIcon(mdiRefresh)"
        >
          刷新
        </NButton>
        <FileDownloader
          :generator="async () => state.objectURL"
          :btn-props="{ type: 'warning' }"
          :filename="`${props.id}.result.json`"
          :render-icon="renderNIcon(mdiCodeJson)"
        >
          下载日志
        </FileDownloader>
      </NSpace>
    </template>
  </NCard>
</template>

<script setup lang="ts">
import { mainApi } from '@/api'
import { s3url } from '@/utils/misc'
import { useAsyncState } from '@vueuse/core'
import { NCard, NButton, NSpace, NTabs, NTabPane, NScrollbar } from 'naive-ui'
import AsyncState from '@/components/misc/AsyncState.vue'
import { renderNIcon } from '@/utils/renderIcon'
import { mdiRefresh, mdiCodeJson } from '@mdi/js'
import FileDownloader from '@/components/misc/FileDownloader.vue'
import { render } from '@/utils/md'
import { computed } from 'vue'
import { useProblemsData } from '@/utils/problems'
import ResultCase from '@/components/submission/ResultCase.vue'

const props = defineProps<{
  id: string
  problemId: string
}>()

const problemsData = useProblemsData()
const problem = computed(() =>
  problemsData.value.problems.find((p) => p._id === props.problemId)
)

function safeParse(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

const { state, isLoading, error, execute } = useAsyncState(async () => {
  const { url } = await mainApi.submission.getDownloadUrl.$post
    .body({ _id: props.id, key: 'result.json' })
    .fetch()
  const resp = await fetch(s3url(url))
  const blob = await resp.blob()
  const objectURL = URL.createObjectURL(blob)
  const text = await blob.text()
  const json = safeParse(text)
  const html = render(
    '```json\n' + (json ? JSON.stringify(json, null, '  ') : text) + '\n```\n'
  )
  const type = json?.score === problem.value?.score ? 'success' : 'warning'
  if (json && typeof json === 'object') {
    json['max-score'] ??= problem.value?.score
  }
  return {
    objectURL,
    text,
    json,
    html,
    type
  }
}, null as never)
</script>
