<template>
  <VChart class="h-64" :option="option" autoresize />
</template>

<script setup lang="ts">
import type { IUser, IRanklistTopstar } from '@hpcgame-platform/server/src/db'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { computed } from 'vue'

const props = defineProps<{
  topstars: (IRanklistTopstar & { user: IUser })[]
  userMap: Record<string, IUser>
}>()

use([
  CanvasRenderer,
  LineChart,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const option = computed(() => {
  const now = Date.now()
  return {
    tooltip: {
      trigger: 'item',
      formatter: (data: any) => {
        const ts = new Date(data.value[0]).toLocaleString()
        const name = props.userMap[data.seriesName].name
        return `${name} ${data.value[1]} ${ts}`
      }
    },
    xAxis: {
      type: 'time'
    },
    yAxis: {
      type: 'value'
    },
    series: props.topstars.map((item) => {
      const finalScore = item.mutations[item.mutations.length - 1].score
      return {
        data: [
          ...item.mutations.map((mut) => [mut.timestamp, mut.score]),
          [now, finalScore]
        ],
        type: 'line',
        name: item.userId,
        endLabel: {
          show: true,
          formatter: () => {
            return item.user.name + ': ' + finalScore
          }
        }
      }
    }),
    legend: {
      data: props.topstars.map((item) => item.userId),
      formatter: (name: string) => props.userMap[name].name
    }
  }
})
</script>
