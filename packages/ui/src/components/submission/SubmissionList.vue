<template>
  <AsyncState :loading="isLoading" :error="error">
    <NDataTable
      :columns="columns"
      :data="state"
      :pagination="false"
      :bordered="false"
    />
  </AsyncState>
</template>

<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { mainApi } from '@/api'
import AsyncState from '@/components/misc/AsyncState.vue'
import { NDataTable, type DataTableColumns } from 'naive-ui'
import type { ISubmission } from '@hpcgame-platform/server/src/db'
import { h } from 'vue'
import { RouterLink } from 'vue-router'
import { getProblemStatusRef } from '@/utils/problems'

const props = defineProps<{
  problemId: string
}>()

const status = getProblemStatusRef(props.problemId)

const columns: DataTableColumns<ISubmission> = [
  {
    title: 'ID',
    key: '_id',
    render: (row) =>
      h(RouterLink, { to: `/submissions/${row._id}` }, () =>
        h(
          'code',
          {
            style: {
              color:
                status.value.effectiveSubmissionId === row._id ? 'blue' : ''
            }
          },
          row._id
        )
      )
  },
  { title: '状态', key: 'status', render: (row) => h('code', {}, row.status) },
  { title: '得分', key: 'score' },
  {
    title: '提交时间',
    key: 'createdAt',
    render: (row) => new Date(row.createdAt).toLocaleString()
  }
]

const { state, isLoading, error } = useAsyncState(async () => {
  return mainApi.submission.list.$get
    .query({
      problemId: props.problemId
    })
    .fetch()
}, [])
</script>
