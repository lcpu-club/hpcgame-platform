<template>
  <div
    class="grid grid-cols-[100px,auto] gap-2 auto-rows-auto justify-items-start items-center"
  >
    <div>ID</div>
    <NInput :readonly="!props.isNew" v-model:value="model._id" />
    <div>名称</div>
    <NInput v-model:value="model.name" />
    <div>公开</div>
    <NSwitch v-model:value="model.public" />
    <div>选项</div>
    <JSONEditor v-model="model.options" />
    <div>选手信息</div>
    <JSONEditor readonly v-model="model.players" />
    <div>榜首信息</div>
    <JSONEditor readonly v-model="model.topstars" />
    <div>更新时间</div>
    <NDatePicker readonly type="datetime" v-model:value="model.updatedAt" />
  </div>
</template>

<script setup lang="ts">
import { NSwitch, NInput, NDatePicker } from 'naive-ui'
import { ref } from 'vue'
import JSONEditor from '../misc/JSONEditor.vue'
import type { IRanklist } from '@hpcgame-platform/server/src/db'

const props = defineProps<{
  isNew?: boolean
  model: IRanklist
}>()

const model = ref(props.model)
</script>
