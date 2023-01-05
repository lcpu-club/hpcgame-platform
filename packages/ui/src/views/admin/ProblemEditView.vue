<template>
  <AbstractEditor
    :editor="ProblemEditor"
    :load="load"
    :save="save"
    :remove="remove"
  />
</template>

<script setup lang="ts">
import { mainApi } from '@/api'
import AbstractEditor from '@/components/admin/AbstractEditor.vue'
import ProblemEditor from '@/components/admin/ProblemEditor.vue'
import type { IProblem } from '@hpcgame-platform/server/src/db'

const props = defineProps<{
  id: string
}>()

async function load() {
  return mainApi.problem.admin.$get.query({ _id: props.id }).fetch()
}

async function save(data: unknown) {
  const { _id, ...$set } = data as IProblem
  await mainApi.problem.admin.$put.body({ _id, $set }).fetch()
}

async function remove() {
  await mainApi.problem.admin.$delete.query({ _id: props.id }).body({}).fetch()
  return '/admin/problem'
}
</script>
