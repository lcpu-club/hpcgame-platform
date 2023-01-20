<template>
  <div class="p-16 pt-8 <lg:p-1 w-full flex justify-center items-start">
    <NCard title="团队管理" class="max-w-256">
      <TaskContext>
        <TeamInfo v-if="userInfo.teamId" />
        <TeamJoin v-else />
      </TaskContext>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard } from 'naive-ui'
import { userInfo } from '@/api'
import TeamJoin from '@/components/team/TeamJoin.vue'
import TeamInfo from '@/components/team/TeamInfo.vue'
import TaskContext from '@/components/misc/TaskContext.vue'
</script>
