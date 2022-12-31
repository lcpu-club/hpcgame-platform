<template>
  <div class="w-full grid grid-cols-1">
    <ModelTable :columns="columns" :count="count" :load="load" />
  </div>
</template>

<script setup lang="ts">
import { mainApi } from '@/api'
import type { DataTableColumns } from 'naive-ui'
import ModelTable from '@/components/admin/ModelTable.vue'
import { h } from 'vue'
import { RouterLink } from 'vue-router'

const columns: DataTableColumns = [
  {
    title: 'ID',
    key: '_id',
    render: (row) =>
      h(RouterLink, { to: `/admin/user/${row._id}` }, () =>
        h('code', row._id as string)
      )
  },
  { title: 'Name', key: 'name' }
]

async function load(page: number, perPage: number) {
  return mainApi.user['admin/search'].$post
    .body({
      page,
      perPage,
      filter: {}
    })
    .fetch()
}

async function count() {
  return mainApi.user['admin/count'].$post
    .body({
      filter: {}
    })
    .fetch()
}
</script>
