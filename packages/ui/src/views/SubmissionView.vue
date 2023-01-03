<template>
  <div class="p-6 w-full flex justify-center">
    <NCard title="提交详情" segmented content-style="padding: 0;">
      <AsyncState :loading="isLoading" :error="error">
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
          </tbody>
        </NTable>
      </AsyncState>
      <template #action v-if="state">
        <FileDownloader
          :generator="generator"
          :file="filename"
          :btn-props="{ type: 'primary' }"
          :filename="filename"
        >
          下载提交数据
        </FileDownloader>
      </template>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard, NTable } from 'naive-ui'
import AsyncState from '@/components/misc/AsyncState.vue'
import { useAsyncState } from '@vueuse/core'
import { mainApi } from '@/api'
import FileDownloader from '@/components/misc/FileDownloader.vue'
import { s3url } from '@/utils/misc'
import { computed } from 'vue'

const props = defineProps<{
  id: string
}>()

const { state, isLoading, error } = useAsyncState(async () => {
  return mainApi.submission.$get.query({ _id: props.id }).fetch()
}, null as never)

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
</script>
