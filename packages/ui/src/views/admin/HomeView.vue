<template>
  <div class="w-full grid grid-cols-1">
    <NCard title="前端信息">
      <div class="grid grid-cols-[100px,auto] gap-2">
        <div>版本</div>
        <div>{{ version }}</div>
      </div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard } from 'naive-ui'
import { version } from '@/utils/meta'
</script>
