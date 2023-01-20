<template>
  <div class="p-6 w-full hg-content-h-full flex items-center justify-center">
    <div class="shadow max-w-128">
      <NCard title="IAAA登录" segmented>
        <div>正在解析IAAA响应，请稍候……</div>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  const token = new URLSearchParams(window.location.search).get('token')
  token && localStorage.setItem('iaaaToken', token)
  window.location.href = localStorage.getItem('iaaaRedirect') || '/'
})
</script>
