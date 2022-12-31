<template>
  <AbstractEditor
    :editor="SysEditor"
    :load="load"
    :save="save"
    :remove="remove"
  />
</template>

<script setup lang="ts">
import { mainApi } from '@/api'
import AbstractEditor from '@/components/admin/AbstractEditor.vue'
import SysEditor from '@/components/admin/SysEditor.vue'

const props = defineProps<{
  id: string
}>()

async function load() {
  const value = await mainApi.kv['load/:key'].$get
    .params({ key: props.id })
    .fetch()
  return { _id: props.id, value }
}

async function save(data: unknown) {
  const { _id, value } = data as { _id: string; value: unknown }
  await mainApi.kv.admin.$put.body({ _id, value }).fetch()
}

async function remove() {
  await mainApi.kv.admin.$delete.body({ _id: props.id }).fetch()
  return '/admin/sys'
}
</script>
