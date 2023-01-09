<template>
  <AbstractEditor
    :editor="RanklistEditor"
    :load="load"
    :save="save"
    :editor-props="{ isNew: true }"
  />
</template>

<script setup lang="ts">
import { mainApi } from '@/api'
import AbstractEditor from '@/components/admin/AbstractEditor.vue'
import RanklistEditor from '@/components/admin/RanklistEditor.vue'
import { nanoid } from 'nanoid'
import { useRouter } from 'vue-router'
import type { IRanklist } from '@hpcgame-platform/server/src/db'

const router = useRouter()

async function load(): Promise<IRanklist> {
  return {
    _id: nanoid(),
    public: false,
    name: 'name',
    options: {
      filter: {
        group: 'admin'
      },
      playerCount: 100,
      topstarCount: 10
    },
    players: [],
    topstars: [],
    updatedAt: 0
  }
}

async function save(data: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { players, topstars, updatedAt, ...init } = data as IRanklist
  await mainApi.ranklist.admin.$post.body(init).fetch()
  router.push('/admin/ranklist/edit/' + init._id)
}
</script>
