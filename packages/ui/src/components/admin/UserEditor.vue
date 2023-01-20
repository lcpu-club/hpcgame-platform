<template>
  <div
    class="grid grid-cols-[100px,auto] gap-2 auto-rows-auto justify-items-start items-center"
  >
    <div>ID</div>
    <NInput :readonly="!props.isNew" v-model:value="model._id" />
    <div>用户名</div>
    <NInput v-model:value="model.name" />
    <div>用户组</div>
    <NInput v-model:value="model.group" />
    <div>用户标签</div>
    <NSelect v-model:value="model.tags" multiple tag filterable />
    <div>邮箱</div>
    <NInput v-model:value="model.email" />
    <div>登录Token</div>
    <NInput readonly v-model:value="model.authToken" />
    <div>IAAA ID</div>
    <NInput readonly v-model:value="model.iaaaId" />
    <div>登录邮箱</div>
    <NInput readonly v-model:value="model.authEmail" />
    <div>元数据</div>
    <JSONEditor readonly v-model="model.metadata" />
  </div>
</template>

<script setup lang="ts">
import { NSelect, NInput } from 'naive-ui'
import { ref } from 'vue'
import JSONEditor from '../misc/JSONEditor.vue'
import type { IUser } from '@hpcgame-platform/server/src/db'

const props = defineProps<{
  isNew?: boolean
  model: IUser
}>()

const model = ref(props.model)
</script>
