<template>
  <div>
    <div class="flex justify-between pb-2">
      <div class="text-lg">用户管理</div>
    </div>
    <div class="w-full grid grid-cols-1">
      <ModelTable :columns="columns" :count="count" :load="load" />
    </div>
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
      h(RouterLink, { to: `/admin/user/edit/${row._id}` }, () =>
        h('code', row._id as string)
      )
  },
  { title: 'Name', key: 'name' },
  { title: 'Group', key: 'group' }
]

async function load(
  page: number,
  perPage: number,
  filter: unknown,
  sort: unknown
) {
  return mainApi.user.admin.search.$post
    .body({
      page,
      perPage,
      filter,
      sort
    })
    .fetch()
}

async function count(filter: unknown) {
  return mainApi.user.admin.count.$post
    .body({
      filter
    })
    .fetch()
}
</script>
