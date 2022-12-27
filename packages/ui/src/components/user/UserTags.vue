<template>
  <div v-if="props.tags.length">
    <NTag v-for="tag in tags" :key="tag">{{ tag }}</NTag>
  </div>
  <div v-else-if="showEmpty">无标签</div>
</template>

<script setup lang="ts">
import { NTag } from 'naive-ui'

const props = defineProps<{
  tags: string[]
  showEmpty?: boolean
}>()
</script>
