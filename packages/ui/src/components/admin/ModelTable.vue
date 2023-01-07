<template>
  <div class="w-full grid grid-cols-1 gap-2">
    <div class="grid grid-cols-[1fr,1fr,auto] gap-2 place-items-stretch">
      <div class="flex flex-col items-center">
        Filter
        <JSONEditor v-model="filter" />
      </div>
      <div class="flex flex-col items-center">
        Sort
        <JSONEditor v-model="sort" />
      </div>
      <div class="flex flex-col items-stretch justify-center">
        <NButton type="primary" @click="task.run(init)">Apply</NButton>
        <code>Σ={{ paginationReactive.itemCount }}</code>
      </div>
    </div>
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
import { NButton, NDataTable, type DataTableColumns } from 'naive-ui'
import JSONEditor from '@/components/misc/JSONEditor.vue'

const props = defineProps<{
  columns: DataTableColumns
  count: (filter: Record<string, unknown>) => Promise<number>
  load: (
    page: number,
    perPage: number,
    filter: Record<string, unknown>,
    sort: unknown
  ) => Promise<Record<string, any>[]>
}>()

const filter = ref<Record<string, unknown>>({})
const sort = ref<Record<string, unknown>>({})
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
    task.run(load)
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
    task.run(load)
  }
})

async function load() {
  data.value = await props.load(
    paginationReactive.page,
    paginationReactive.pageSize,
    filter.value,
    sort.value
  )
}

async function init() {
  paginationReactive.page = 1
  paginationReactive.itemCount = await props.count(filter.value)
  await load()
}
task.run(init)
</script>
