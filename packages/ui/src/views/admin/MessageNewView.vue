<template>
  <AbstractEditor
    :editor="MessageEditor"
    :load="load"
    :save="save"
    :editor-props="{ isNew: true }"
  />
</template>

<script setup lang="ts">
import { mainApi } from '@/api'
import AbstractEditor from '@/components/admin/AbstractEditor.vue'
import MessageEditor from '@/components/admin/MessageEditor.vue'
import { nanoid } from 'nanoid'
import { useRouter } from 'vue-router'
import type { IMessage } from '@hpcgame-platform/server/src/db'

const router = useRouter()

async function load() {
  return {
    _id: nanoid(),
    global: true,
    group: '',
    userId: '',
    title: 'Title',
    content: 'Content',
    metadata: {},
    createdAt: Date.now()
  }
}

async function save(data: unknown) {
  const { _id, ...$set } = data as IMessage
  await mainApi.message.admin.$put.body({ _id, $set }).fetch()
  router.push('/admin/message/edit/' + _id)
}
</script>
