<template>
  <NTooltip
    v-for="problem of props.problems"
    :key="problem._id"
    trigger="hover"
  >
    <template #trigger>
      <NIcon size="18" :color="color(props.scores[problem._id], problem.score)">
        <component :is="renderMdiIcon(mdiCircle)" />
      </NIcon>
    </template>
    {{ problem.title }}
    <code>{{ props.scores[problem._id] ?? '未提交' }}</code>
    /
    <code>{{ problem.score }}</code>
  </NTooltip>
</template>

<script setup lang="ts">
import type { IProblem } from '@hpcgame-platform/server/src/db'
import { NTooltip, NIcon } from 'naive-ui'
import { renderMdiIcon } from '@/utils/renderIcon'
import { mdiCircle } from '@mdi/js'
import { getColorByScore } from '@/utils/problems'

const props = defineProps<{
  scores: Record<string, number>
  problems: IProblem[]
}>()

function color(score: number | undefined, maxScore: number) {
  if (typeof score !== 'number') return '#7f8c8d'
  return getColorByScore(score, maxScore)
}
</script>
