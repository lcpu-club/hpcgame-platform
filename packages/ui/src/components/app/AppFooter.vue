<template>
  <NLayoutFooter
    bordered
    position="absolute"
    class="px-4 h-8 flex items-center justify-between"
  >
    <div>HPCGame UI</div>
    <a
      class="flex items-center"
      href="https://github.com/lcpu-club/ucenter"
      target="_blank"
    >
      <NIcon size="24">
        <MdiIcon :path="mdiGithub" />
      </NIcon>
    </a>
  </NLayoutFooter>
</template>

<script setup lang="ts">
import { NLayoutFooter, NIcon } from 'naive-ui'
import MdiIcon from '@/components/misc/MdiIcon.vue'
import { mdiGithub } from '@mdi/js'
</script>
