<template>
  <div class="w-full grid grid-cols-1 gap-2">
    <NCard title="比赛日程">
      <AsyncState :loading="!state" :error="error">
        <div
          class="grid grid-cols-[100px,auto] gap-2 justify-items-center place-items-center"
        >
          <div>比赛开始</div>
          <div class="text-4xl">
            {{ new Date(state.start).toLocaleString() }}
          </div>
          <div>比赛结束</div>
          <div class="text-4xl">
            {{ new Date(state.end).toLocaleString() }}
          </div>
        </div>
      </AsyncState>
    </NCard>
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
        <NInput v-model:value="bucket" placeholder="桶" />
        <NInput v-model:value="key" placeholder="键值" />
        <FileUploader :generator="generatorUpload">
          请保证上传的文件满足平台OSS文件规范，否则将可能导致无法预计的后果！
        </FileUploader>
        <FileDownloader :generator="generatorDownload" open-in-new>
          下载<code>{{ key }}</code>
        </FileDownloader>
      </div>
    </NCard>
    <NCard title="杂项">
      <NButton
        type="error"
        :loading="syncTask.running.value"
        @click="syncTask.run"
      >
        同步用户标签
      </NButton>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard, NDatePicker, NInput, NInputNumber, NButton } from 'naive-ui'
import { version } from '@/utils/meta'
import { ref } from 'vue'
import FileUploader from '@/components/misc/FileUploader.vue'
import { mainApi } from '@/api'
import FileDownloader from '@/components/misc/FileDownloader.vue'
import { s3url } from '@/utils/misc'
import { useSimpleAsyncTask } from '@/utils/async'
import { useAsyncState } from '@vueuse/core'
import AsyncState from '@/components/misc/AsyncState.vue'

const ts = ref(Date.now())
const bucket = ref('')
const key = ref('')

async function generatorUpload(file: File) {
  const { url } = await mainApi.admin.getUploadUrl.$post
    .body({
      bucket: bucket.value,
      ossKey: key.value,
      size: file.size
    })
    .fetch()
  return { url: s3url(url) }
}

async function generatorDownload() {
  const { url } = await mainApi.admin.getDownloadUrl.$post
    .body({
      bucket: bucket.value,
      ossKey: key.value
    })
    .fetch()
  return s3url(url)
}

const syncTask = useSimpleAsyncTask(
  async () => {
    await mainApi.admin.syncUserTags.$post.body({}).fetch()
  },
  { notifyOnSuccess: true }
)

const { state, error } = useAsyncState(async () => {
  const data = await mainApi.kv['load/:key'].$get
    .params({ key: 'game_schedule' })
    .fetch()
  return data as any
}, null as never)
</script>
