<template>
  <NLayoutContent
    has-sider
    position="absolute"
    class="!top-16 !bottom-8"
    content-style="height: 100%"
  >
    <NLayout :native-scrollbar="false" :scrollbar-props="{ xScrollable: true }">
      <RouterView v-slot="{ Component }">
        <Transition name="router" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </NLayout>
  </NLayoutContent>
</template>

<script setup lang="ts">
import { NLayout, NLayoutContent } from 'naive-ui'
</script>

<style>
.router-enter-active,
.router-leave-active {
  transition: opacity 0.1s ease;
}

.router-enter-from,
.router-leave-to {
  opacity: 0;
}
</style>
