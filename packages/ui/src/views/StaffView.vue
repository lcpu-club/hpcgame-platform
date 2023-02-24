<template>
  <div class="p-6 w-full flex justify-center">
    <NCard title="工作人员名单" segmented class="max-w-256">
      <article v-html="html" class="markdown-body"></article>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import staff from '@/../docs/staff.md?raw'
import { NCard } from 'naive-ui'
import { render } from '@/utils/md'

const html = render(staff)
</script>
