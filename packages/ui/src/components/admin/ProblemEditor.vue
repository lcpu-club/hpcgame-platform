<template>
  <div
    class="grid grid-cols-[100px,auto] gap-2 auto-rows-auto justify-items-start items-center"
  >
    <div>ID</div>
    <NInput :readonly="!props.isNew" v-model:value="model._id" />
    <div>标题</div>
    <NInput v-model:value="model.title" />
    <div>内容</div>
    <NInput type="textarea" v-model:value="model.content" />
    <div>分数</div>
    <NInputNumber v-model:value="model.score" />
    <div>最多提交次数</div>
    <NInputNumber v-model:value="model.maxSubmissionCount" />
    <div>最大提交大小</div>
    <NInputNumber v-model:value="model.maxSubmissionSize" />
    <div>评测参数</div>
    <NInput v-model:value="model.runnerArgs" />
    <div>分类</div>
    <NInput v-model:value="model.category" />
    <div>标签</div>
    <NSelect v-model:value="model.tags" multiple tag filterable />
    <div>元数据</div>
    <JSONEditor v-model="model.metadata" />
    <template v-if="!props.isNew">
      <div>下载评测数据</div>
      <FileDownloader
        :generator="downloadGenerator"
        :btn-props="{ type: 'primary' }"
      >
        下载数据
      </FileDownloader>
      <div>更新评测数据</div>
      <FileUploader :validator="validator" :generator="generator">
        请上传以<code>tar</code>格式压缩的数据包
      </FileUploader>
    </template>
  </div>
</template>

<script setup lang="ts">
import { NInput, NInputNumber, NSelect } from 'naive-ui'
import { ref } from 'vue'
import JSONEditor from '../misc/JSONEditor.vue'
import type { IProblem } from '@hpcgame-platform/server/src/db'
import FileUploader from '../misc/FileUploader.vue'
import { mainApi } from '@/api'
import FileDownloader from '../misc/FileDownloader.vue'
import { s3url } from '@/utils/misc'

const props = defineProps<{
  isNew?: boolean
  model: IProblem
}>()

const model = ref(props.model)

async function validator(file: File) {
  if (file.name.endsWith('.tar') && file.type === 'application/x-tar') return
  return '格式错误'
}

const bucket = import.meta.env.VITE_BUCKET_PROBLEM

async function generator(file: File) {
  const { url } = await mainApi.admin.getUploadUrl.$post
    .body({
      bucket,
      ossKey: `problem/${props.model._id}/data.tar`,
      size: file.size
    })
    .fetch()
  return { url: s3url(url) }
}

async function downloadGenerator() {
  const { url } = await mainApi.admin.getDownloadUrl.$post
    .body({
      bucket,
      ossKey: `problem/${props.model._id}/data.tar`
    })
    .fetch()
  return s3url(url)
}
</script>
