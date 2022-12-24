<template>
  <NSpace>
    <RouterLink v-slot="{ navigate }" to="/login" custom>
      <NButton
        @click="navigate"
        type="primary"
        :render-icon="renderNIcon(mdiLogin)"
      >
        参赛
      </NButton>
    </RouterLink>
  </NSpace>
</template>

<script setup lang="ts">
import { renderNIcon } from '@/utils/renderIcon'
import { mdiLogin } from '@mdi/js'
import { NButton, NSpace } from 'naive-ui'
</script>
