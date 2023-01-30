<template>
  <NButton color="#3498db" class="shadow" :loading="running" @click="run">
    <template #icon>
      <component :is="renderNIcon(mdiConsole)" />
    </template>
    登录计算集群
  </NButton>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { useSimpleAsyncTask } from '@/utils/async'
import { mainApi } from '@/api'
import { renderNIcon } from '@/utils/renderIcon'
import { mdiConsole } from '@mdi/js'

const redirect = import.meta.env.VITE_CLUSTER_REDIRECT

const { run, running } = useSimpleAsyncTask(async () => {
  const { tokenName, tokenSecret } =
    await mainApi.user.getClusterCredentials.$post.body({}).fetch()
  location.href = `${redirect}?tokenName=${tokenName}&tokenSecret=${tokenSecret}`
})
</script>
