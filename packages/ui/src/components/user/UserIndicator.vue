<template>
  <NSpace>
    <RouterLink v-slot="{ navigate }" to="/user" custom>
      <NButton @click="navigate" type="info" ghost>
        <template #icon>
          <img :src="gravatar(userInfo.email)" />
        </template>
        {{ userInfo.name }}
      </NButton>
    </RouterLink>
  </NSpace>
</template>

<script setup lang="ts">
import { gravatar } from '@/utils/avatar'
import { NButton, NSpace } from 'naive-ui'
import { userInfo } from '@/api'
</script>
