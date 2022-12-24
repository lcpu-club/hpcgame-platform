<template>
  <div class="p-16 pt-8 <lg:p-1 w-full flex justify-center items-start">
    <NLayout class="border">
      <NLayoutHeader bordered class="p-4">
        <div class="text-lg">欢迎您，{{ userInfo.name }}</div>
      </NLayoutHeader>
      <NLayout has-sider>
        <NLayoutSider bordered width="180">
          <NMenu :options="menuOptions" />
        </NLayoutSider>
        <NLayoutContent class="p-4">
          <RouterView v-slot="{ Component }">
            <Transition name="router" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </NLayoutContent>
      </NLayout>
    </NLayout>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { RouterLink } from 'vue-router'
import {
  NLayout,
  NLayoutHeader,
  NLayoutSider,
  NMenu,
  type MenuOption,
  NLayoutContent
} from 'naive-ui'
import { userInfo } from '@/api'

const menuOptions: MenuOption[] = [
  ['/user/', '基本信息'],
  ['/user/logout', '登出']
].map(([to, label]) => ({
  label: () => h(RouterLink, { to }, () => label),
  key: to
}))
</script>
