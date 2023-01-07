<template>
  <div
    class="grid grid-cols-[100px,auto] gap-2 auto-rows-auto justify-items-start items-center"
  >
    <div>ID</div>
    <NInput readonly v-model:value="model._id" />
    <div>用户ID</div>
    <NInput readonly v-model:value="model.userId" />
    <div>题目ID</div>
    <NInput readonly v-model:value="model.problemId" />
    <div>分数</div>
    <NInputNumber v-model:value="model.score" />
    <div>状态</div>
    <NInput v-model:value="model.status" />
    <div>消息</div>
    <NInput v-model:value="model.message" />
    <div>创建时间</div>
    <NDatePicker readonly type="datetime" v-model:value="model.createdAt" />
    <div>更新时间</div>
    <NInputNumber readonly v-model:value="model.updatedAt" />
    <div>元数据</div>
    <JSONEditor readonly v-model="model.metadata" />
    <div>重测</div>
    <NButton v-if="!isNew" @click="run" :loading="running" type="error">
      重新评测
    </NButton>
    <div>下载提交数据</div>
    <NSpace>
      <FileDownloader
        :generator="downloadGenerator('data')"
        :btn-props="{ type: 'primary' }"
        :filename="filename"
      >
        下载数据
      </FileDownloader>
      <FileDownloader
        :generator="downloadGenerator('result.json')"
        :btn-props="{ type: 'info' }"
        filename="result.json"
      >
        下载评测信息
      </FileDownloader>
    </NSpace>
  </div>
</template>

<script setup lang="ts">
import { NButton, NDatePicker, NInput, NInputNumber, NSpace } from 'naive-ui'
import { computed, ref } from 'vue'
import type { ISubmission } from '@hpcgame-platform/server/src/db'
import { useSimpleAsyncTask } from '@/utils/async'
import { mainApi } from '@/api'
import FileDownloader from '@/components/misc/FileDownloader.vue'
import JSONEditor from '@/components/misc/JSONEditor.vue'
import { s3url } from '@/utils/misc'

const props = defineProps<{
  isNew?: boolean
  model: ISubmission
}>()

const model = ref(props.model)

const ext = computed(() => model.value?.metadata?.ext ?? 'unknown')
const filename = computed(
  () => `submission-${model.value._id}${ext.value ? '.' + ext.value : ''}`
)

const { run, running } = useSimpleAsyncTask(async () => {
  await mainApi.submission.admin.resubmit.$post
    .body({ _id: model.value._id })
    .fetch()
})

function downloadGenerator(key: string) {
  return async () => {
    const { url } = await mainApi.admin.getDownloadUrl.$post
      .body({
        bucket: import.meta.env.VITE_BUCKET_SUBMISSION,
        ossKey: `${props.model._id}/${key}`
      })
      .fetch()
    return s3url(url)
  }
}
</script>
