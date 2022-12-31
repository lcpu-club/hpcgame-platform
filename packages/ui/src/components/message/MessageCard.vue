<template>
  <NCard :title="props.message.title" segmented>
    <article class="markdown-body" v-html="html"></article>
    <template #action>
      <NSpace>
        <NTag type="info">
          {{ new Date(props.message.createdAt).toLocaleString() }}
        </NTag>
        <NTag type="error" v-if="props.message.group"> 发送给我的用户组 </NTag>
        <NTag type="error" v-if="props.message.userId"> 发送给我 </NTag>
      </NSpace></template
    >
  </NCard>
</template>

<script setup lang="ts">
import { render } from '@/utils/md'
import type { IMessage } from '@hpcgame-platform/server/src/db'
import { NCard, NSpace, NTag } from 'naive-ui'
import { computed } from 'vue'

const props = defineProps<{
  message: IMessage
}>()

const html = computed(() => render(props.message.content))
</script>
