<template>
  <div
    class="p-6 w-full hg-content-h-full flex items-center flex-wrap-reverse justify-center"
  >
    <img :src="url" class="w-64" />
    <article>
      <h1>没有找到您访问的页面</h1>
      <p>也许您能在另一个世界找到它。</p>
      <RouterLink v-slot="{ navigate }" to="/" custom>
        <NButton @click="navigate" type="primary"> 回到首页 </NButton>
      </RouterLink>
    </article>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'

const rand = (Math.floor(Math.random() * 13) + 1).toString().padStart(2, '0')
const url = `https://www.lovelive-anime.jp/nijigasaki/worldwide/img/tv/member/c${rand}.png?v2`
</script>
