<template>
  <NTag :color="colors[props.group] ?? {}">{{
    names[props.group] ?? '未知'
  }}</NTag>
</template>

<script setup lang="ts">
import { NTag } from 'naive-ui'

const props = defineProps<{
  group: string
}>()

const names: Record<string, string> = {
  banned: '身怀绝技',
  pku: '北大选手',
  social: '校外选手',
  staff: '工作人员',
  admin: '管理员'
}

type Color = {
  color?: string
  textColor?: string
  borderColor?: string
}

const colors: Record<string, Color> = {
  banned: { color: '#f5222d', textColor: '#fff' },
  pku: { color: '#1890ff', textColor: '#fff' },
  social: { color: '#faad14', textColor: '#fff' },
  staff: { color: '#52c41a', textColor: '#fff' },
  admin: { color: '#722ed1', textColor: '#fff' }
}
</script>
