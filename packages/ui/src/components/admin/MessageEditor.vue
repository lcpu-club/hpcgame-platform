<template>
  <div
    class="grid grid-cols-[100px,auto] gap-2 auto-rows-auto justify-items-start items-center"
  >
    <div>ID</div>
    <NInput :readonly="!props.isNew" v-model:value="model._id" />
    <div>全局消息</div>
    <NSwitch v-model:value="model.global" />
    <div>用户组</div>
    <NInput v-model:value="model.group" />
    <div>用户ID</div>
    <NInput v-model:value="model.userId" />
    <div>团队ID</div>
    <NInput v-model:value="model.teamId" />
    <div>标题</div>
    <NInput v-model:value="model.title" />
    <div>内容</div>
    <NInput type="textarea" v-model:value="model.content" />
    <div>创建时间</div>
    <NDatePicker type="datetime" v-model:value="model.createdAt" />
    <div>元数据</div>
    <JSONEditor v-model="model.metadata" />
  </div>
</template>

<script setup lang="ts">
import { NDatePicker, NInput, NSwitch } from 'naive-ui'
import { ref } from 'vue'
import JSONEditor from '../misc/JSONEditor.vue'
import type { IMessage } from '@hpcgame-platform/server/src/db'

const props = defineProps<{
  isNew?: boolean
  model: IMessage
}>()

const model = ref(props.model)
</script>
