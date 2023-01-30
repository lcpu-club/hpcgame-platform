<template>
  <div class="grid grid-cols-1 gap-2">
    <ConnectCluster />
    <ConnectScow />
    <NCard
      class="shadow"
      title="题目列表"
      segmented
      content-style="padding: 0;"
    >
      <template #header-extra>
        <NButton type="info" @click="emit('refresh')" :loading="props.loading">
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
import { useProblemsData } from '@/utils/problems'
import { NButton, NCard, NMenu, type MenuOption, NP, NText } from 'naive-ui'
import { RouterLink } from 'vue-router'
import ConnectScow from '@/components/scow/ConnectScow.vue'
import ConnectCluster from '@/components/problem/ConnectCluster.vue'

const props = defineProps<{ loading: boolean }>()

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
        h(RouterLink, { to: `/problems/${problem._id}` }, () =>
          h(NP, { class: ['flex', 'justify-between', 'items-center'] }, () => [
            h(NText, { strong: true }, () => problem.title),
            h(
              NText,
              { depth: 3, class: ['text-xs'] },
              () => `${problem.score}pts`
            )
          ])
        ),
      key: problem._id
    }))
  }))
)
</script>
