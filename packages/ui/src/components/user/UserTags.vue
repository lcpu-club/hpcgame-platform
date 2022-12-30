<template>
  <div v-if="props.tags.length">
    <NTag v-for="tag in tags" :key="tag">{{ trans[tag] ?? tag }}</NTag>
  </div>
  <div v-else-if="showEmpty">无标签</div>
</template>

<script setup lang="ts">
import { NTag } from 'naive-ui'

const props = defineProps<{
  tags: string[]
  showEmpty?: boolean
}>()

const trans: Record<string, string> = {
  newcomer: '新生'
}
</script>
