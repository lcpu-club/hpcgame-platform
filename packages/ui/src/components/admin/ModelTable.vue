<template>
  <div class="w-full grid grid-cols-1">
    <NDataTable
      :columns="props.columns"
      :data="data"
      remote
      :pagination="paginationReactive"
    />
  </div>
</template>

<script setup lang="ts">
import { useTaskContext } from '@/utils/async'
import { ref, reactive } from 'vue'
import { NDataTable, type DataTableColumns } from 'naive-ui'

const props = defineProps<{
  columns: DataTableColumns
  count: () => Promise<number>
  load: (page: number, perPage: number) => Promise<Record<string, any>[]>
}>()

const task = useTaskContext()
const data = ref<Record<string, any>[]>([])
const paginationReactive = reactive({
  page: 1,
  pageSize: 50,
  showSizePicker: true,
  itemCount: 0,
  pageSizes: [50],
  onChange: (page: number) => {
    paginationReactive.page = page
    load()
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
    load()
  }
})

async function load() {
  data.value = await props.load(
    paginationReactive.page,
    paginationReactive.pageSize
  )
}

async function init() {
  paginationReactive.page = 1
  paginationReactive.itemCount = await props.count()
  await load()
}
task.run(init)
</script>
