<template>
  <NButton color="#9b0000" class="shadow" :loading="running" @click="run">
    <template #icon>
      <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
      <NIcon v-html="SCOWLogo" />
    </template>
    登录SCOW™
  </NButton>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import SCOWLogo from '@/assets/scow.svg?raw'
import { useSimpleAsyncTask } from '@/utils/async'
import { mainApi } from '@/api'
import { useSCOW } from '@/utils/scow'

const { open } = useSCOW()

const { run, running } = useSimpleAsyncTask(async () => {
  const { _id, password } = await mainApi.team.getSCOWCredentials.$post
    .body({})
    .fetch()
  open(_id, password)
})
</script>
