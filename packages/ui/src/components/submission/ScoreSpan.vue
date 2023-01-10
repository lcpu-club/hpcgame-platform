<template>
  <div>
    <NText :type="scoreType">
      {{ props.json.score }}
    </NText>
    <NText v-if="showMaxScore"> / {{ props.json['max-score'] }} </NText>
  </div>
</template>

<script setup lang="ts">
import { NText } from 'naive-ui'
import { computed } from 'vue'

const props = defineProps<{
  json: any
}>()

const showMaxScore = computed(() => 'max-score' in props.json)
const scoreType = computed(() =>
  showMaxScore.value
    ? props.json.score === props.json['max-score']
      ? 'success'
      : props.json.score === 0
      ? 'error'
      : 'warning'
    : undefined
)
</script>
