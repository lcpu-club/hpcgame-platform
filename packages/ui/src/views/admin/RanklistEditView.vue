<template>
  <AbstractEditor
    :editor="RanklistEditor"
    :load="load"
    :save="save"
    :remove="remove"
  />
</template>

<script setup lang="ts">
import { mainApi } from '@/api'
import AbstractEditor from '@/components/admin/AbstractEditor.vue'
import RanklistEditor from '@/components/admin/RanklistEditor.vue'
import type { IRanklist } from '@hpcgame-platform/server/src/db'

const props = defineProps<{
  id: string
}>()

async function load() {
  return mainApi.ranklist.admin.$get.query({ _id: props.id }).fetch()
}

async function save(data: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, players, topstars, updatedAt, ...$set } = data as IRanklist
  await mainApi.ranklist.admin.$put.body({ _id, $set }).fetch()
}

async function remove() {
  await mainApi.ranklist.admin.$delete.query({ _id: props.id }).body({}).fetch()
  return '/admin/ranklist'
}
</script>
