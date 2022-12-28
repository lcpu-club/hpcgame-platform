<template>
  <div class="p-6 w-full">
    <div class="w-full flex flex-col items-center">
      <div>
        <img src="@/assets/hpcgame_logo.svg" class="h-32 w-auto" />
      </div>
      <div class="font-bold text-5xl border-b">HPCGame Platform</div>
      <div
        class="grid grid-cols-[1fr,1fr] auto-cols-fr gap-2 pt-8 justify-items-start"
      >
        <div>Commit Hash</div>
        <a
          class="text-blue-500"
          :href="`https://github.com/lcpu-club/hpcgame-platform/commit/${hash}`"
          target="_blank"
        >
          <code>{{ hash }}</code>
        </a>
        <div>UI Version</div>
        <div>{{ version }}</div>
        <div>Build Time</div>
        <div>{{ buildTime }}</div>
      </div>
      <div class="pt-8">
        <pre v-text="licence"></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { hash, version, buildTime } from '@/utils/meta'
import licence from '@/../../../LICENCE?raw'
</script>
