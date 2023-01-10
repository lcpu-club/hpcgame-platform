<template>
  <div class="grid grid-rows-1 grid-flow-col auto-cols-fr">
    <NStatistic label="得分">
      <NText :type="scoreType" strong>
        {{ props.json.score }}
      </NText>
      <template v-if="showMaxScore" #suffix>
        / {{ props.json['max-score'] }}
      </template>
    </NStatistic>
    <NStatistic v-if="props.json.time" label="运行用时">
      <code>{{ props.json.time }}</code>
      <template #suffix>ms</template>
    </NStatistic>
    <NStatistic v-if="props.json.memory" label="运行内存">
      <code>{{ props.json.memory }}</code>
      <template #suffix>KB</template>
    </NStatistic>
  </div>
  <NStatistic label="反馈消息">
    <NP>
      <NText strong>
        <code>{{ props.json.message }}</code>
      </NText>
    </NP>
  </NStatistic>
  <NStatistic label="详细消息">
    <NP>
      <div class="grid">
        <NScrollbar x-scrollable class="max-h-64">
          <pre
            class="whitespace-pre"
            v-text="props.json['detailed-message']?.trim()"
          ></pre>
        </NScrollbar>
      </div>
    </NP>
  </NStatistic>
  <NStatistic v-for="key of additionalKeys" :key="key" :label="key">
    <NP>
      <div class="grid">
        <NScrollbar x-scrollable class="max-h-64">
          <pre class="whitespace-pre" v-text="pretty(props.json[key])"></pre>
        </NScrollbar>
      </div>
    </NP>
  </NStatistic>
  <template v-if="props.json.subtasks && props.json.subtasks.length">
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
  NDivider,
  NScrollbar
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
      : props.json.score === 0
      ? 'error'
      : 'warning'
    : undefined
)
const knownKeys = [
  'score',
  'max-score',
  'time',
  'memory',
  'message',
  'detailed-message',
  'subtasks',
  'done'
]
const additionalKeys = computed(() => {
  if (props.json && typeof props.json === 'object') {
    const keys = Object.keys(props.json)
    return keys
      .filter((key) => !knownKeys.includes(key))
      .filter((key) => !key.startsWith('verbose'))
  }
  return []
})

function pretty(object: unknown) {
  if (typeof object === 'object') return JSON.stringify(object, null, 2)
  return '' + object
}
</script>
