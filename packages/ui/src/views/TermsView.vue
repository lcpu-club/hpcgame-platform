<template>
  <div class="p-6 w-full flex justify-center">
    <NCard title="参赛须知" segmented class="max-w-256">
      <article v-html="html" class="markdown-body"></article>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import term from '@/../docs/term.md?raw'
import { render } from '@/utils/md'
import { NCard } from 'naive-ui'

const html = render(term)
</script>
