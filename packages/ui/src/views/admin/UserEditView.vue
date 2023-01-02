<template>
  <AbstractEditor :editor="UserEditor" :load="load" :save="save" />
</template>

<script setup lang="ts">
import { mainApi } from '@/api'
import AbstractEditor from '@/components/admin/AbstractEditor.vue'
import UserEditor from '@/components/admin/UserEditor.vue'
import type { IUser } from '@hpcgame-platform/server/src/db'

const props = defineProps<{
  id: string
}>()

async function load() {
  return mainApi.user.admin.$get.query({ _id: props.id }).fetch()
}

async function save(data: unknown) {
  const { _id, ...$set } = data as IUser
  await mainApi.user.admin.$put.body({ _id, $set }).fetch()
}
</script>
