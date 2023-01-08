<template>
  <div class="flex-1 flex justify-center items-start">
    <NCard
      title="提交详情"
      segmented
      content-style="padding: 0;"
      class="w-96 shadow mx-2"
    >
      <AsyncState :loading="!state" :error="error">
        <NTable striped :bordered="false">
          <tbody>
            <tr>
              <td>ID</td>
              <td>
                <code>{{ state._id }}</code>
              </td>
            </tr>
            <tr>
              <td>题目ID</td>
              <td>
                <RouterLink :to="`/problems/${state.problemId}`">
                  <code>{{ state.problemId }}</code>
                </RouterLink>
              </td>
            </tr>
            <tr>
              <td>状态</td>
              <td>
                <code>{{ state.status }}</code>
              </td>
            </tr>
            <tr>
              <td>得分</td>
              <td>
                <code>{{ state.score }}</code>
              </td>
            </tr>
            <tr>
              <td>评测消息</td>
              <td>
                <code v-if="state.message">{{ state.message }}</code>
                <span v-else class="text-gray-400">还没有消息……</span>
              </td>
            </tr>
          </tbody>
        </NTable>
      </AsyncState>
      <template #action v-if="state">
        <NSpace align="center">
          <NButton
            v-if="state.status === 'created'"
            type="warning"
            @click="run"
            :loading="running"
            :render-icon="renderNIcon(mdiPlay)"
          >
            提交
          </NButton>
          <NButton
            type="info"
            @click="execute()"
            :loading="isLoading"
            :render-icon="renderNIcon(mdiRefresh)"
            :disabled="shouldRefresh && auto"
          >
            刷新
          </NButton>
          <FileDownloader
            :generator="generator"
            :btn-props="{ type: 'primary' }"
            :filename="filename"
            :render-icon="renderNIcon(mdiFolderZip)"
          >
            下载提交文件
          </FileDownloader>
          <div v-if="shouldRefresh" class="grid grid-cols-1">
            <NSwitch v-model:value="auto" size="small" />
            <NText>自动刷新</NText>
          </div>
        </NSpace>
      </template>
    </NCard>
    <ResultView
      v-if="state?.status === 'finished'"
      class="flex-1 shadow mx-2"
      :id="props.id"
      :problem-id="state.problemId"
    />
  </div>
</template>

<script setup lang="ts">
import { NCard, NTable, NButton, NSpace, NSwitch, NText } from 'naive-ui'
import AsyncState from '@/components/misc/AsyncState.vue'
import { useAsyncState } from '@vueuse/core'
import { mainApi } from '@/api'
import FileDownloader from '@/components/misc/FileDownloader.vue'
import { s3url } from '@/utils/misc'
import { computed, onBeforeUnmount, ref } from 'vue'
import { renderNIcon } from '@/utils/renderIcon'
import { mdiRefresh, mdiFolderZip, mdiPlay } from '@mdi/js'
import ResultView from '@/components/submission/ResultView.vue'
import { useSimpleAsyncTask } from '@/utils/async'

const props = defineProps<{
  id: string
}>()

const { state, isLoading, error, execute } = useAsyncState(
  async () => {
    const data = await mainApi.submission.$get.query({ _id: props.id }).fetch()
    return data
  },
  null as never,
  { resetOnExecute: false }
)

const ext = computed(() => state.value?.metadata?.ext ?? 'unknown')
const filename = computed(
  () => `submission-${props.id}${ext.value ? '.' + ext.value : ''}`
)

async function generator() {
  const { url } = await mainApi.submission.getDownloadUrl.$post
    .body({ _id: props.id, key: 'data' })
    .fetch()
  return s3url(url)
}

const { run, running } = useSimpleAsyncTask(
  async () => {
    await mainApi.submission.submit.$post.body({ _id: state.value._id }).fetch()
    execute()
  },
  { notifyOnSuccess: true }
)

const auto = ref(true)
const shouldRefresh = computed(() =>
  ['pending', 'running'].includes(state.value?.status)
)

const intervalId = setInterval(() => {
  if (auto.value && !isLoading.value && shouldRefresh.value) {
    execute()
  }
}, 5000)
onBeforeUnmount(() => clearInterval(intervalId))
</script>
