<template>
  <div
    class="grid grid-cols-1 justify-items-stretch self-stretch justify-self-stretch place-self-stretch"
  >
    <NUpload
      ref="upload"
      :custom-request="customRequest"
      @before-upload="beforeUpload"
      @change="handleChange"
      :default-upload="false"
      :max="1"
      list-type="image"
      :render-icon="renderIcon"
      :show-remove-button="false"
    >
      <NUploadDragger>
        <div style="margin-bottom: 12px">
          <NIcon size="48" :depth="3">
            <component :is="renderMdiIcon(mdiUpload)" />
          </NIcon>
        </div>
        <NText style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </NText>
        <NP depth="3" style="margin: 8px 0 0 0">
          <slot />
        </NP>
      </NUploadDragger>
    </NUpload>
    <NButton
      type="primary"
      size="large"
      @click="upload?.submit()"
      :disabled="!files"
    >
      上传数据
    </NButton>
  </div>
</template>

<script setup lang="ts">
import { getErrorMessage } from '@/utils/error'
import { renderMdiIcon } from '@/utils/renderIcon'
import { mdiUpload } from '@mdi/js'
import {
  NButton,
  NIcon,
  NP,
  NText,
  NUpload,
  NUploadDragger,
  useNotification,
  type UploadCustomRequestOptions,
  type UploadFileInfo,
  type UploadInst,
  type UploadSettledFileInfo
} from 'naive-ui'
import { ref } from 'vue'
import { renderNIcon } from '@/utils/renderIcon'
import { mdiCheck, mdiFolderZip } from '@mdi/js'

const props = defineProps<{
  validator?: (file: File) => Promise<string | void>
  generator: (file: File) => Promise<{ url: string; metadata?: unknown }>
}>()

const notification = useNotification()

const upload = ref<UploadInst | null>(null)
const files = ref(0)

const emits = defineEmits<{
  (ev: 'uploaded', file: File, metadata?: unknown): void
}>()

const renderIcon = (info: UploadSettledFileInfo) => {
  return renderNIcon(info.status === 'finished' ? mdiCheck : mdiFolderZip)()
}

function handleChange(data: { fileList: UploadFileInfo[] }) {
  files.value = data.fileList.length
}

async function beforeUpload(data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) {
  try {
    const file = data.file.file

    if (!file) throw new Error('文件不存在')
    const errorMsg = await props.validator?.(file)
    if (errorMsg) throw new Error(errorMsg)
    return true
  } catch (err) {
    notification.error({
      title: '检查失败',
      content: await getErrorMessage(err),
      duration: 5000
    })
    return false
  }
}

async function customRequest(options: UploadCustomRequestOptions) {
  try {
    const file = options.file.file
    if (!file) throw new Error('文件不存在')
    const { url, metadata } = await props.generator(file)
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          options.onProgress({ percent })
        }
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            emits('uploaded', file, metadata)
            resolve()
          } else {
            reject(new Error('文件上传失败'))
          }
        })
        xhr.addEventListener('error', () => reject(new Error('文件上传失败')))
        xhr.addEventListener('abort', () => reject(new Error('文件上传中断')))
      })
      xhr.open('PUT', url)
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.send(file)
    })
    options.onFinish()
  } catch (err) {
    notification.error({
      title: '上传失败',
      content: await getErrorMessage(err),
      duration: 5000
    })
    options.onError()
  }
}
</script>
