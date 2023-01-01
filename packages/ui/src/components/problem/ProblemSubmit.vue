<template>
  <FileUploader
    :validator="validator"
    :generator="generator"
    @uploaded="onUploaded"
  />
  <NButton
    :loading="running"
    :disabled="!submissionId"
    type="info"
    size="large"
    @click="run"
    class="mt-2 w-full"
  >
    提交
  </NButton>
</template>

<script setup lang="ts">
import { mainApi } from '@/api'
import FileUploader from '@/components/misc/FileUploader.vue'
import { useSimpleAsyncTask } from '@/utils/async'
import { s3url } from '@/utils/misc'
import { NButton } from 'naive-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  problemId: string
  maxSize: number
}>()

const submissionId = ref('')

async function validator(file: File) {
  const isTar = file.name.endsWith('.tar') && file.type === 'application/x-tar'
  if (!isTar) return '格式错误'
  if (file.size > props.maxSize) return '文件过大'
  return
}

async function generator(file: File) {
  const submission = mainApi.submission
  const { _id } = await submission.$post
    .body({
      problemId: props.problemId
    })
    .fetch()
  const { url } = await submission.getUploadUrl.$post
    .body({
      _id,
      size: file.size
    })
    .fetch()
  return { url: s3url(url), metadata: { _id } }
}

function onUploaded(file: File, metadata: unknown) {
  submissionId.value = (metadata as { _id: string })._id
}

const router = useRouter()

const { run, running } = useSimpleAsyncTask(async () => {
  await mainApi.submission.submit.$post
    .body({ _id: submissionId.value })
    .fetch()
  router.push(`/submissions/${submissionId.value}`)
})
</script>
