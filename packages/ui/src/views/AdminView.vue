<template>
  <div
    class="p-16 pt-8 <lg:p-1 w-full flex justify-center items-start min-w-256"
  >
    <NLayout class="border">
      <NLayoutHeader bordered class="p-4">
        <div class="text-lg">HPC Game 管理后台</div>
      </NLayoutHeader>
      <NLayout has-sider>
        <NLayoutSider bordered width="180">
          <NMenu :options="menuOptions" />
        </NLayoutSider>
        <NLayoutContent class="p-4">
          <TaskContext>
            <RouterView v-slot="{ Component }">
              <Transition name="router" mode="out-in">
                <component :is="Component" />
              </Transition>
            </RouterView>
          </TaskContext>
        </NLayoutContent>
      </NLayout>
    </NLayout>
  </div>
</template>

<script setup lang="ts">
import { h, computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  NLayout,
  NLayoutHeader,
  NLayoutSider,
  NMenu,
  type MenuOption,
  NLayoutContent
} from 'naive-ui'
import TaskContext from '@/components/misc/TaskContext.vue'
import { userInfo } from '@/api'

const menuOptions = computed<MenuOption[]>(() =>
  (
    [
      ['/admin/', '概览'],
      ['/admin/sys', '动态配置'],
      ['/admin/user', '用户管理'],
      ['/admin/problem', '题面管理', true],
      ['/admin/submission', '提交管理', true],
      ['/admin/message', '通知管理'],
      ['/admin/ranklist', '排行榜管理'],
      ['/admin/scow', 'SCOW集成']
    ] as const
  ).map(([to, label, staffAccess]) => ({
    label: () => h(RouterLink, { to }, () => label),
    key: to,
    show: staffAccess || userInfo.value.group === 'admin'
  }))
)
</script>
