<template>
  <AbstractEditor
    :editor="SubmissionEditor"
    :load="load"
    :save="save"
    :remove="remove"
  />
</template>

<script setup lang="ts">
import { mainApi } from '@/api'
import AbstractEditor from '@/components/admin/AbstractEditor.vue'
import SubmissionEditor from '@/components/admin/SubmissionEditor.vue'
import type { ISubmission } from '@hpcgame-platform/server/src/db'

const props = defineProps<{
  id: string
}>()

async function load() {
  return mainApi.submission.admin.$get.query({ _id: props.id }).fetch()
}

async function save(data: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, teamId, problemId, ...$set } = data as ISubmission
  await mainApi.submission.admin.$put.body({ _id, $set }).fetch()
}

async function remove() {
  await mainApi.submission.admin.$delete
    .query({ _id: props.id })
    .body({})
    .fetch()
  return '/admin/submission'
}
</script>
