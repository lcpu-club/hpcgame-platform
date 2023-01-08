<template>
  <div class="grid grid-cols-1 gap-2">
    <ConnectScow />
    <NCard
      class="shadow"
      title="题目列表"
      segmented
      content-style="padding: 0;"
    >
      <template #header-extra>
        <NButton type="info" @click="emit('refresh')">
          <!--  -->
          刷新题目
        </NButton>
      </template>
      <NMenu :options="menuOptions" :root-indent="16" :indent="0" />
    </NCard>
  </div>
</template>

<script setup lang="ts">
// import { userInfo } from '@/api'
import { computed, h } from 'vue'
import { useProblemsData, getProblemColor } from '@/utils/problems'
import { NButton, NCard, NMenu, type MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { renderNIcon } from '@/utils/renderIcon'
import { mdiCircle } from '@mdi/js'
import ConnectScow from '@/components/scow/ConnectScow.vue'

const emit = defineEmits<{
  (ev: 'refresh'): void
}>()

const problemsData = useProblemsData()
const menuOptions = computed<MenuOption[]>(() =>
  problemsData.value.categories.map((item) => ({
    label: item.category,
    key: item.category,
    children: item.problems.map((problem) => ({
      label: () =>
        h(RouterLink, { to: `/problems/${problem._id}` }, () => problem.title),
      key: problem._id,
      icon: renderNIcon(mdiCircle, {
        color: getProblemColor(problem._id, problem.score)
      })
    }))
  }))
)
</script>
