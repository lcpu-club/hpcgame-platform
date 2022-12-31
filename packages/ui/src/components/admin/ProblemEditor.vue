<template>
  <div
    class="grid grid-cols-[100px,auto] gap-2 auto-rows-auto justify-items-start items-center"
  >
    <div>ID</div>
    <NInput :readonly="!props.isNew" v-model:value="model._id" />
    <div>标题</div>
    <NInput v-model:value="model.title" />
    <div>内容</div>
    <NInput type="textarea" v-model:value="model.content" />
    <div>分数</div>
    <NInputNumber v-model:value="model.score" />
    <div>最多提交次数</div>
    <NInputNumber v-model:value="model.submissionLimit" />
    <div>分类</div>
    <NInput v-model:value="model.category" />
    <div>标签</div>
    <NSelect v-model:value="model.tags" multiple tag filterable />
    <div>元数据</div>
    <JSONEditor v-model="model.metadata" />
  </div>
</template>

<script setup lang="ts">
import { NInput, NInputNumber, NSelect } from 'naive-ui'
import { ref } from 'vue'
import JSONEditor from '../misc/JSONEditor.vue'
import type { IProblem } from '@hpcgame-platform/server/src/db'

const props = defineProps<{
  isNew?: boolean
  model: IProblem
}>()

const model = ref(props.model)
</script>
