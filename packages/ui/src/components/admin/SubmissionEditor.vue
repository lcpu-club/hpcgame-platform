<template>
  <div
    class="grid grid-cols-[100px,auto] gap-2 auto-rows-auto justify-items-start items-center"
  >
    <div>ID</div>
    <NInput readonly v-model:value="model._id" />
    <div>用户ID</div>
    <NInput readonly v-model:value="model.userId" />
    <div>题目ID</div>
    <NInput readonly v-model:value="model.problemId" />
    <div>分数</div>
    <NInputNumber v-model:value="model.score" />
    <div>状态</div>
    <NInput v-model:value="model.status" />
    <div>消息</div>
    <NInput v-model:value="model.message" />
    <div>创建时间</div>
    <NDatePicker readonly type="datetime" v-model:value="model.createdAt" />
    <div>更新时间</div>
    <NInputNumber readonly v-model:value="model.updatedAt" />
  </div>
</template>

<script setup lang="ts">
import { NDatePicker, NInput, NInputNumber } from 'naive-ui'
import { ref } from 'vue'
import type { ISubmission } from '@hpcgame-platform/server/src/db'

const props = defineProps<{
  isNew?: boolean
  model: ISubmission
}>()

const model = ref(props.model)
</script>
