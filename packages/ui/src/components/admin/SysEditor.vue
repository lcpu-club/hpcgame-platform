<template>
  <div class="grid grid-cols-[100px, auto]">
    <div>键值</div>
    <NInput :readonly="!props.isNew" v-model:value="model._id" />
    <div>内容</div>
    <JSONEditor v-model="model.value" />
  </div>
</template>

<script setup lang="ts">
import { NInput } from 'naive-ui'
import { ref } from 'vue'
import JSONEditor from '../misc/JSONEditor.vue'

const props = defineProps<{
  isNew?: boolean
  model: {
    _id: string
    value: unknown
  }
}>()

const model = ref(props.model)
</script>
