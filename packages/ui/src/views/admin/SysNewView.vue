<template>
  <AbstractEditor
    :editor="SysEditor"
    :load="load"
    :save="save"
    :editor-props="{ isNew: true }"
  />
</template>

<script setup lang="ts">
import { mainApi } from '@/api'
import AbstractEditor from '@/components/admin/AbstractEditor.vue'
import SysEditor from '@/components/admin/SysEditor.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

async function load() {
  return {
    _id: 'new-id',
    value: {}
  }
}

async function save(data: unknown) {
  const { _id, value } = data as { _id: string; value: unknown }
  await mainApi.kv.$put.body({ _id, value }).fetch()
  router.push('/admin/sys/edit/' + _id)
}
</script>
