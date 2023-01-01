<template>
  <NCard class="shadow">
    <article v-html="html" class="markdown-body"></article>
  </NCard>
</template>

<script setup lang="ts">
import md from '@/../docs/problems.md?raw'
import { render } from '@/utils/md'
import { NCard } from 'naive-ui'

const html = render(md)
</script>
