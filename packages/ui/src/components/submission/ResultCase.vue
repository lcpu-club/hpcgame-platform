<template>
  <NStatistic label="得分">
    <NText :type="scoreType">
      {{ props.json.score }}
    </NText>
    <template v-if="showMaxScore" #suffix>
      / {{ props.json['max-score'] }}
    </template>
  </NStatistic>
  <NStatistic label="反馈消息">
    <NP>
      <NText strong>
        <code>{{ props.json.message }}</code>
      </NText>
    </NP>
  </NStatistic>
  <NStatistic label="详细消息">
    <NP>
      <NText>
        <code>{{ props.json['detailed-message'] }}</code>
      </NText>
    </NP>
  </NStatistic>
  <template v-if="props.json.subtasks">
    <NDivider>测试点信息</NDivider>
    <NCollapse accordion>
      <NCollapseItem
        v-for="(task, i) of props.json.subtasks"
        :key="i"
        :title="`Subtask #${i}`"
      >
        <ResultCase :json="task" />
        <template #header-extra>
          <ScoreSpan :json="task" />
        </template>
      </NCollapseItem>
    </NCollapse>
  </template>
</template>

<script setup lang="ts">
import {
  NStatistic,
  NText,
  NP,
  NCollapse,
  NCollapseItem,
  NDivider
} from 'naive-ui'
import { computed } from 'vue'
import ScoreSpan from '@/components/submission/ScoreSpan.vue'

const props = defineProps<{
  json: any
}>()

const showMaxScore = computed(() => 'max-score' in props.json)
const scoreType = computed(() =>
  showMaxScore.value
    ? props.json.score === props.json['max-score']
      ? 'success'
      : 'warning'
    : undefined
)
</script>
