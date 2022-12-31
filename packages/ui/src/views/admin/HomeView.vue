<template>
  <div class="w-full grid grid-cols-1 gap-2">
    <NCard title="前端信息">
      <div class="grid grid-cols-[100px,auto] gap-2">
        <div>版本</div>
        <div>{{ version }}</div>
      </div>
    </NCard>
    <NCard title="实用工具">
      <div class="grid grid-cols-2 gap-2">
        <NDatePicker type="datetime" v-model:value="ts" />
        <NInputNumber v-model:value="ts" />
      </div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard, NDatePicker, NInputNumber } from 'naive-ui'
import { version } from '@/utils/meta'
import { ref } from 'vue'

const ts = ref(Date.now())
</script>
