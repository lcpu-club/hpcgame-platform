<template>
  <div class="w-full grid grid-cols-1 gap-2">
    <NCard title="前端信息">
      <div class="grid grid-cols-[100px,auto] gap-2">
        <div>版本</div>
        <div>{{ version }}</div>
      </div>
    </NCard>
    <NCard title="实用工具">
      <div class="grid grid-cols-2 gap-2">
        <NDatePicker type="datetime" v-model:value="ts" />
        <NInputNumber v-model:value="ts" />
      </div>
    </NCard>
    <NCard title="OSS">
      <div class="grid grid-cols-1 gap-2">
        <NInput v-model:value="key" />
        <FileUploader :generator="generatorUpload" />
        <FileDownloader :generator="generatorDownload" open-in-new>
          下载<code>{{ key }}</code>
        </FileDownloader>
      </div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard, NDatePicker, NInput, NInputNumber } from 'naive-ui'
import { version } from '@/utils/meta'
import { ref } from 'vue'
import FileUploader from '@/components/misc/FileUploader.vue'
import { mainApi } from '@/api'
import FileDownloader from '@/components/misc/FileDownloader.vue'

const ts = ref(Date.now())
const key = ref('')

async function generatorUpload(file: File) {
  const { url } = await mainApi.admin.getUploadUrl.$post
    .body({
      ossKey: key.value,
      size: file.size
    })
    .fetch()
  return { url }
}

async function generatorDownload() {
  const { url } = await mainApi.admin.getDownloadUrl.$post
    .body({
      ossKey: key.value
    })
    .fetch()
  return url
}
</script>
