<template>
  <NCard class="shadow" title="题目列表" segmented content-style="padding: 0;">
    <NMenu :options="menuOptions" :root-indent="16" :indent="0" />
  </NCard>
</template>

<script setup lang="ts">
// import { userInfo } from '@/api'
import { computed, h } from 'vue'
import { useProblemsData } from '@/utils/problems'
import { NCard, NMenu, type MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'

const problemsData = useProblemsData()
const menuOptions = computed<MenuOption[]>(() =>
  problemsData.value.categories.map((item) => ({
    label: item.category,
    key: item.category,
    children: item.problems.map((problem) => ({
      label: () =>
        h(RouterLink, { to: `/problems/${problem._id}` }, () => problem.title),
      key: problem._id
    }))
  }))
)
</script>
