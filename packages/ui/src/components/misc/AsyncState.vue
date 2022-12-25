<template>
  <slot name="loading" v-if="props.loading">
    <NSkeleton text :repeat="5" />
  </slot>
  <slot name="error" v-else-if="props.error">
    <NAlert type="error" title="错误">
      {{ error }}
    </NAlert>
  </slot>
  <slot v-else></slot>
</template>

<script setup lang="ts">
import { NAlert, NSkeleton } from 'naive-ui'

const props = defineProps<{
  loading: boolean
  error: unknown
}>()
</script>
