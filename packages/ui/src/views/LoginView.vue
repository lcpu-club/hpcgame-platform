<template>
  <div class="p-6 w-full hg-content-h-full flex items-center justify-center">
    <div class="shadow max-w-128">
      <NCard title="欢迎参加HPC Game" segmented>
        <NAlert title="注意事项" type="info">
          比赛面向全国高校同学，请使用<code>edu.cn</code>域名邮箱或经协作单位报名登记的邮箱登陆。<br />
          请注意，每位选手只允许使用一个账号参赛。<br />
          北京大学选手不使用IAAA登陆视作放弃校内奖项参评资格。
        </NAlert>
        <template #footer>
          <div class="flex flex-col items-center">
            <RouterLink v-slot="{ navigate }" to="/login/iaaa" custom>
              <NButton @click="navigate" color="#bd0603">
                <template #icon>
                  <img src="https://iaaa.pku.edu.cn/favicon.ico" />
                </template>
                校内选手
              </NButton>
            </RouterLink>
            <div class="self-stretch flex flex-row items-center py-2">
              <div class="flex-1">
                <hr />
              </div>
              <div class="px-8">OR</div>
              <div class="flex-1">
                <hr />
              </div>
            </div>
            <RouterLink v-slot="{ navigate }" to="/login/mail" custom>
              <NButton
                @click="navigate"
                type="info"
                :render-icon="renderNIcon(mdiEmail)"
              >
                校外选手
              </NButton>
            </RouterLink>
          </div>
        </template>
        <template #action>
          登录即视为您已同意
          <RouterLink to="/terms" class="text-blue-600">参赛须知</RouterLink>。
        </template>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { renderNIcon } from '@/utils/renderIcon'
import { mdiEmail } from '@mdi/js'
import { NCard, NAlert, NButton } from 'naive-ui'
</script>
