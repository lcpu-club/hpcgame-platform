<template>
  <div>
    <div class="flex justify-between pb-2">
      <div class="text-lg">排行榜管理</div>
      <NSpace>
        <RouterLink v-slot="{ navigate }" to="/admin/ranklist/new" custom>
          <NButton @click="navigate" type="primary">新建</NButton>
        </RouterLink>
        <NButton type="error" @click="run" :loading="running">
          重新计算排行榜
        </NButton>
      </NSpace>
    </div>
    <AsyncState :loading="isLoading" :error="error">
      <NDataTable :columns="columns" :data="state" />
    </AsyncState>
  </div>
</template>

<script setup lang="ts">
import { mainApi } from '@/api'
import { useSimpleAsyncTask } from '@/utils/async'
import { useAsyncState } from '@vueuse/core'
import { type DataTableColumns, NButton, NDataTable, NSpace } from 'naive-ui'
import { h } from 'vue'
import { RouterLink } from 'vue-router'

const columns: DataTableColumns = [
  {
    title: 'ID',
    key: '_id',
    render: (row) =>
      h(RouterLink, { to: `/admin/ranklist/edit/${row._id}` }, () =>
        h('code', row._id as string)
      )
  },
  { title: 'Name', key: 'name' },
  {
    title: 'Public',
    key: 'public',
    render: (row) => (row.public ? 'Public' : 'Private')
  }
]

const { state, isLoading, error } = useAsyncState(
  () => mainApi.ranklist.list.$get.fetch(),
  [],
  { immediate: true }
)

const { run, running } = useSimpleAsyncTask(
  async () => {
    await mainApi.ranklist.admin.rank.$post.body({}).fetch()
  },
  { notifyOnSuccess: true }
)
</script>
