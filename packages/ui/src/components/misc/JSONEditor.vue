<!-- 
  This component is used to edit JSON data. 
  Please notice that for performance reasons, the content of the editor
  will not change when the modelValue changes. If parent component updates
  its state, it's also responsible for re-render this component.
 -->

<template>
  <NAlert v-if="error" type="error" title="错误">
    {{ error }}
  </NAlert>
  <NInput
    type="textarea"
    :value="json"
    @update:value="onUpdate"
    class="font-mono"
  />
</template>

<script setup lang="ts">
import { NAlert, NInput } from 'naive-ui'
import { ref } from 'vue'

const props = defineProps<{
  modelValue: unknown
}>()

const emits = defineEmits(['update:modelValue'])

const json = ref(JSON.stringify(props.modelValue, null, 2))
const error = ref('')

function onUpdate(value: string) {
  try {
    json.value = value
    const parsed = JSON.parse(value)
    emits('update:modelValue', parsed)
    error.value = ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : '' + e
  }
}

function sync() {
  json.value = JSON.stringify(props.modelValue, null, 2)
}

defineExpose({ sync })
</script>
