<template>
  <NLayoutFooter
    bordered
    position="absolute"
    class="px-4 h-8 flex items-center"
  >
    <div>HPCGame UI</div>
    <div class="flex-1"></div>
    <RouterLink to="/about" class="pr-2 text-blue-500">
      <code>#{{ hash }}</code>
    </RouterLink>
    <a
      class="flex items-center"
      href="https://github.com/lcpu-club/hpcgame-platform/"
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
import { hash } from '@/utils/meta'
</script>
