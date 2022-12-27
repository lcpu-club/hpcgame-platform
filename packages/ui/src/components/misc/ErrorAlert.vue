<template>
  <NAlert type="error">{{ msg }}</NAlert>
</template>

<script setup lang="ts">
import { NAlert } from 'naive-ui'
import { computed } from 'vue'

const props = defineProps<{
  error: unknown
}>()

const msg = computed(() => {
  if (props.error instanceof Error) {
    return props.error.message
  }
  return '' + props.error
})
</script>
