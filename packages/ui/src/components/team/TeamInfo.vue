<template>
  <AsyncState :loading="!state" :error="error">
    <NDivider class="!mt-0" title-placement="left">基本信息</NDivider>
    <div class="grid grid-cols-[auto,1fr] gap-2 items-center">
      <div>团队名称</div>
      <NInput v-model:value="state.name" :readonly="!isOwner" />
      <div>团队Email</div>
      <NInput v-model:value="state.email" :readonly="!isOwner" />
      <div>Team Token</div>
      <NInput v-model:value="state.teamToken" readonly />
    </div>
    <NDivider title-placement="left">成员信息</NDivider>
    <NTable>
      <thead>
        <tr>
          <th class="w-full">用户</th>
          <th v-if="isOwner">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="member of state.members" :key="member._id">
          <td>
            <NSpace align="center" :wrap="false" :wrap-item="false">
              <NAvatar
                size="small"
                :src="gravatar(member.email)"
                lazy
                :intersection-observer-options="imgOptions"
              />
              <div class="whitespace-nowrap">
                {{ member.name }}
              </div>
              <UserTags :tags="member.tags" />
            </NSpace>
          </td>
          <td v-if="isOwner">
            <NButton
              type="error"
              :disabled="member._id === userInfo._id"
              @click="kick(member._id)"
            >
              踢出队伍
            </NButton>
          </td>
        </tr>
      </tbody>
    </NTable>
    <NDivider title-placement="left">团队操作</NDivider>
    <NSpace>
      <template v-if="isOwner">
        <NButton
          type="error"
          :loading="deleteTask.running.value"
          @click="deleteTask.run"
        >
          解散团队
        </NButton>
        <NButton
          type="warning"
          :loading="resetTask.running.value"
          @click="resetTask.run"
        >
          重置Token
        </NButton>
        <NButton
          type="primary"
          :loading="updateTask.running.value"
          @click="updateTask.run"
        >
          更新信息
        </NButton>
      </template>
      <template v-else>
        <NButton
          type="error"
          :loading="leaveTask.running.value"
          @click="leaveTask.run"
        >
          退出团队
        </NButton>
      </template>
    </NSpace>
  </AsyncState>
</template>

<script setup lang="ts">
import AsyncState from '../misc/AsyncState.vue'
import { NInput, NDivider, NTable, NSpace, NAvatar, NButton } from 'naive-ui'
import { useAsyncState } from '@vueuse/core'
import { mainApi, tryUpdateUser, userInfo } from '@/api'
import { computed } from 'vue'
import { gravatar } from '@/utils/avatar'
import UserTags from '../user/UserTags.vue'
import { useSimpleAsyncTask, useTaskContext } from '@/utils/async'

const imgOptions = {
  root: document
}

const { state, error, execute } = useAsyncState(
  async () => {
    return mainApi.team.$get.fetch()
  },
  null as never,
  { resetOnExecute: false }
)
const isOwner = computed(() => state.value?.ownerId === userInfo.value?._id)

const leaveTask = useSimpleAsyncTask(
  async () => {
    await mainApi.team.leave.$post.body({}).fetch()
    await tryUpdateUser()
  },
  { notifyOnSuccess: true }
)

const deleteTask = useSimpleAsyncTask(
  async () => {
    await mainApi.team.$delete.body({}).fetch()
    await tryUpdateUser()
  },
  { notifyOnSuccess: true }
)

const resetTask = useSimpleAsyncTask(
  async () => {
    await mainApi.team.resetToken.$post.body({}).fetch()
    await execute()
  },
  { notifyOnSuccess: true }
)

const updateTask = useSimpleAsyncTask(
  async () => {
    await mainApi.team.$put
      .body({
        name: state.value.name,
        email: state.value.email
      })
      .fetch()
  },
  { notifyOnSuccess: true }
)

const task = useTaskContext()
function kick(userId: string) {
  return task.run(async () => {
    await mainApi.team.kick.$post.body({ userId }).fetch()
    await execute()
  })
}
</script>
