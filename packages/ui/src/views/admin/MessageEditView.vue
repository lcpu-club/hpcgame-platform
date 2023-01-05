<template>
  <AbstractEditor
    :editor="MessageEditor"
    :load="load"
    :save="save"
    :remove="remove"
  />
</template>

<script setup lang="ts">
import { mainApi } from '@/api'
import AbstractEditor from '@/components/admin/AbstractEditor.vue'
import MessageEditor from '@/components/admin/MessageEditor.vue'
import type { IMessage } from '@hpcgame-platform/server/src/db'

const props = defineProps<{
  id: string
}>()

async function load() {
  return mainApi.message.admin.$get.query({ _id: props.id }).fetch()
}

async function save(data: unknown) {
  const { _id, ...$set } = data as IMessage
  await mainApi.message.admin.$put.body({ _id, $set }).fetch()
}

async function remove() {
  await mainApi.message.admin.$delete.query({ _id: props.id }).body({}).fetch()
  return '/admin/message'
}
</script>
