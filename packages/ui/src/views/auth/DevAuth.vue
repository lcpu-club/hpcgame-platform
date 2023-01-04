<template>
  <div class="p-4 flex justify-center">
    <div class="grid grid-cols-1 gap-2">
      <input v-model="name" placeholder="name" class="border" />
      <input v-model="group" placeholder="group" class="border" />
      <button @click="login" class="border">Login</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mainApi, userInfo } from '@/api'
import { finalizeLogin } from '@/utils/sync'
import { nextTick, ref } from 'vue'

const name = ref('')
const group = ref<'admin'>('admin')

async function login() {
  const user = await mainApi.auth.dev.$get
    .query({ name: name.value, group: group.value })
    .fetch()
  userInfo.value = user
  nextTick(() => {
    finalizeLogin()
  })
}
</script>
