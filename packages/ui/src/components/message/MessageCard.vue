<template>
  <NCard :title="props.message.title" segmented>
    <article class="markdown-body" v-html="html"></article>
    <template #footer>
      <NSpace>
        <RouterLink
          v-if="submission"
          v-slot="{ navigate }"
          :to="submission"
          custom
        >
          <NButton ghost @click="navigate" type="primary">转到提交</NButton>
        </RouterLink>
        <RouterLink v-if="problem" v-slot="{ navigate }" :to="problem" custom>
          <NButton ghost @click="navigate" type="primary">转到题目</NButton>
        </RouterLink>
      </NSpace>
    </template>
    <template #action>
      <NSpace>
        <NTag type="info">
          {{ new Date(props.message.createdAt).toLocaleString() }}
        </NTag>
        <NTag type="error" v-if="props.message.group">发送给我的用户组</NTag>
        <NTag type="error" v-if="props.message.userId">发送给我</NTag>
      </NSpace></template
    >
  </NCard>
</template>

<script setup lang="ts">
import { render } from '@/utils/md'
import type { IMessage } from '@hpcgame-platform/server/src/db'
import { NCard, NSpace, NTag, NButton } from 'naive-ui'
import { computed } from 'vue'

const props = defineProps<{
  message: IMessage
}>()

const html = computed(() => render(props.message.content))
const submission = computed(() => {
  const metadata = props.message.metadata
  if (metadata.submissionId && metadata.submissionId) {
    return `/problems/${metadata.problemId}/submissions/${metadata.submissionId}`
  }
  return false
})
const problem = computed(() => {
  const metadata = props.message.metadata
  if (metadata.submissionId) {
    return `/problems/${metadata.problemId}`
  }
  return false
})
</script>
