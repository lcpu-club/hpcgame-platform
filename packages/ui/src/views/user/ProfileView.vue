<template>
  <div class="w-full grid grid-cols-1">
    <TaskContext>
      <UserEdit :userId="userInfo._id" />
    </TaskContext>
  </div>
</template>

<script setup lang="ts">
import { userInfo } from '@/api'
import TaskContext from '@/components/misc/TaskContext.vue'
import UserEdit from '@/components/user/UserEdit.vue'
</script>
