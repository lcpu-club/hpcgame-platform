<template>
  <div class="p-6 w-full flex justify-center">
    <article v-html="html" class="markdown-body max-w-256"></article>
  </div>
</template>

<script setup lang="ts">
import home from '@/../docs/home.md?raw'
import { render } from '@/utils/md'

const html = render(home)
</script>
