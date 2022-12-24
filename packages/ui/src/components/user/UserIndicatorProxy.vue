<template>
  <UserIndicator v-if="loggedIn" />
  <UserLoginBtn v-else />
</template>

<script setup lang="ts">
import UserLoginBtn from '@/components/user/UserLoginBtn.vue'
import UserIndicator from '@/components/user/UserIndicator.vue'
import { loggedIn } from '@/api'
</script>
