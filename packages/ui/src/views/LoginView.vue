<template>
  <div class="p-6 w-full hg-content-h-full flex items-center justify-center">
    <div class="shadow max-w-128">
      <NCard title="欢迎参加HPC Game" segmented>
        <NAlert title="注意事项" type="info">
          <ul>
            <li>对于校内选手：请使用IAAA统一登录。</li>
            <li>对于校外选手：请使用邮件验证码登录。</li>
          </ul>
          我们允许校外选手登录并一同参与比赛。<br />
          校外选手将不参与评奖，但可以正常查看题目并提交答案。将按与校内选手相同的标准计分，显示在总排行榜上。<br />
          请注意，一个自然人只允许使用一个账号参加比赛。<br />
          校内选手使用IAAA以外的登录方式视为放弃评奖资格。
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
