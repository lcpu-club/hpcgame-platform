<template>
  <div class="p-6 w-full flex justify-center">
    <NCard title="最终排名" segmented class="max-w-256">
      <article v-html="html" class="markdown-body"></article>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import ranking from '@/../docs/ranking.md?raw'
import { NCard } from 'naive-ui'
import { render } from '@/utils/md'

const html = render(ranking)
</script>
