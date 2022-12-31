<template>
  <NUpload :custom-request="customRequest" @before-upload="beforeUpload">
    <NUploadDragger>
      <div style="margin-bottom: 12px">
        <NIcon size="48" :depth="3">
          <component :is="renderMdiIcon(mdiUpload)" />
        </NIcon>
      </div>
      <NText style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </NText>
      <NP depth="3" style="margin: 8px 0 0 0">
        请上传以<code>tar</code>格式压缩的数据包
      </NP>
    </NUploadDragger>
  </NUpload>
</template>

<script setup lang="ts">
import { getErrorMessage } from '@/utils/error'
import { renderMdiIcon } from '@/utils/renderIcon'
import { mdiUpload } from '@mdi/js'
import {
  NIcon,
  NP,
  NText,
  NUpload,
  NUploadDragger,
  useNotification,
  type UploadCustomRequestOptions,
  type UploadFileInfo
} from 'naive-ui'

const props = defineProps<{
  validator?: (file: File) => Promise<string | void>
  generator: (file: File) => Promise<string>
}>()

const notification = useNotification()

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
      title: '上传失败',
      content: await getErrorMessage(err)
    })
    return false
  }
}

async function customRequest(options: UploadCustomRequestOptions) {
  try {
    const file = options.file.file
    if (!file) throw new Error('文件不存在')
    const uploadUrl = await props.generator(file)
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          options.onProgress({ percent })
        }
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            resolve()
          } else {
            console.log(xhr.responseXML)
            reject(new Error('文件上传失败'))
          }
        })
        xhr.addEventListener('error', () => reject(new Error('文件上传失败')))
        xhr.addEventListener('abort', () => reject(new Error('文件上传中断')))
      })
      xhr.open('PUT', uploadUrl)
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.send(file)
    })
    options.onFinish()
  } catch (err) {
    notification.error({
      title: '上传失败',
      content: await getErrorMessage(err)
    })
    options.onError()
  }
}
</script>
