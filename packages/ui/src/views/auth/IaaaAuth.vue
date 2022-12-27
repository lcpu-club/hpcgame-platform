<template>
  <div class="flex items-center justify-center p-4">
    <div>正在重定向到北京大学统一身份认证服务</div>
    <form
      action="https://iaaa.pku.edu.cn/iaaa/oauth.jsp"
      method="post"
      style="display: none"
      ref="form"
    >
      <input type="hidden" name="appID" :value="appId" />
      <input type="hidden" name="appName" :value="appName" />
      <input type="hidden" name="redirectUrl" :value="redirectUrl" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const form = ref<HTMLFormElement>(null as never)

const appId = import.meta.env.VITE_IAAA_ID
const appName = import.meta.env.VITE_IAAA_NAME
const redirectUrl = import.meta.env.VITE_IAAA_REDIRECT_URL

onMounted(() => {
  form.value.submit()
})
</script>
