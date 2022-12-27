<template>
  <div>
    <div class="flex justify-between pb-2">
      <div class="text-lg">配置键值对</div>
      <div>
        <RouterLink v-slot="{ navigate }" to="/admin/sys/new" custom>
          <NButton @click="navigate" type="primary">新建</NButton>
        </RouterLink>
      </div>
    </div>
    <AsyncState :loading="isLoading" :error="error">
      <NDataTable :columns="columns" :data="state" />
    </AsyncState>
  </div>
</template>

<script setup lang="ts">
import { mainApi } from '@/api'
import AsyncState from '@/components/misc/AsyncState.vue'
import { useAsyncState } from '@vueuse/core'
import { NButton, NDataTable, type DataTableColumns } from 'naive-ui'
import { h } from 'vue'
import { RouterLink } from 'vue-router'

const columns: DataTableColumns<{ _id: string }> = [
  { title: '键值', key: '_id' },
  {
    title: '操作',
    key: 'action',
    render: (row) =>
      h(
        RouterLink,
        { to: `/admin/sys/edit/${row._id}`, custom: true },
        {
          default: ({ navigate }: { navigate: () => void }) =>
            h(NButton, { onClick: navigate }, { default: () => '编辑' })
        }
      )
  }
]

const { state, isLoading, error } = useAsyncState(
  () => mainApi.kv.list.$get.fetch(),
  [],
  { immediate: true }
)
</script>
