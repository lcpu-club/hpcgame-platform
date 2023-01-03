<template>
  <div class="mb-2" :class="{ ['hpc-exceeded']: limitExceeded }">
    上传次数限制：{{ status?.submissionCount ?? 0 }}次/{{ props.maxCount }}次
  </div>
  <FileUploader
    v-if="!limitExceeded"
    :validator="validator"
    :generator="generator"
    @uploaded="onUploaded"
  >
    允许的格式：<code>{{ props.allowedExtensions.join(',') }}</code>
  </FileUploader>
  <NButton
    :loading="running"
    :disabled="!submissionId || limitExceeded"
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getProblemStatusRef } from '@/utils/problems'

const props = defineProps<{
  problemId: string
  maxSize: number
  maxCount: number
  allowedExtensions: string[]
}>()

const submissionId = ref('')
const status = getProblemStatusRef(props.problemId)
const limitExceeded = computed(
  () => status.value && status.value.submissionCount >= props.maxCount
)

async function validator(file: File) {
  if (!props.allowedExtensions.some((ext) => file.name.endsWith(ext)))
    return '不支持的文件格式'
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
      size: file.size,
      ext: file.name.split('.').pop() ?? ''
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

<style scoped>
.hpc-exceeded {
  color: #f56c6c;
}
</style>
