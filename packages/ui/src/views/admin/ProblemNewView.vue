<template>
  <AbstractEditor
    :editor="ProblemEditor"
    :load="load"
    :save="save"
    :editor-props="{ isNew: true }"
  />
</template>

<script setup lang="ts">
import { mainApi } from '@/api'
import AbstractEditor from '@/components/admin/AbstractEditor.vue'
import ProblemEditor from '@/components/admin/ProblemEditor.vue'
import { nanoid } from 'nanoid'
import { useRouter } from 'vue-router'
import type { IProblem } from '@hpcgame-platform/server/src/db'

const router = useRouter()

async function load(): Promise<IProblem> {
  return {
    _id: nanoid(),
    public: false,
    title: 'Title',
    content: 'Content',
    score: 100,
    maxSubmissionCount: 20,
    maxSubmissionSize: 10 * 1024 * 1024,
    runnerArgs: '',
    category: '其他',
    tags: ['简单题'],
    metadata: {}
  }
}

async function save(data: unknown) {
  const { _id, ...$set } = data as IProblem
  await mainApi.problem.admin.$put.body({ _id, $set }).fetch()
  router.push('/admin/problem/edit/' + _id)
}
</script>
