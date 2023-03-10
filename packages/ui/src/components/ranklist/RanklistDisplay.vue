<template>
  <AsyncState :loading="!state" :error="error">
    <template v-if="state.players.length">
      <RanklistTopstars :topstars="state.topstars" :user-map="state.userMap" />
      <NTable striped>
        <thead>
          <tr>
            <th>位次</th>
            <th>用户</th>
            <th>得分</th>
            <th class="w-full !text-center">详细信息</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, i) of state.players" :key="player.userId">
            <td class="whitespace-nowrap">{{ i + 1 }}</td>
            <td>
              <NSpace align="center" :wrap="false" :wrap-item="false">
                <NAvatar
                  size="small"
                  :src="gravatar(player.user.email)"
                  lazy
                  :intersection-observer-options="imgOptions"
                />
                <div class="whitespace-nowrap">
                  {{ player.user.name }}
                </div>
                <UserTags :tags="player.user.tags" />
              </NSpace>
            </td>
            <td class="whitespace-nowrap">{{ player.score }}</td>
            <td>
              <div class="flex items-center justify-center">
                <RanklistScores
                  :scores="player.scores"
                  :problems="state.problems"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </NTable>
      <div class="pt-4">
        生成时间：{{
          self?.updatedAt
            ? new Date(self?.updatedAt).toLocaleString()
            : '等待初始化'
        }}
      </div>
    </template>
    <template v-else>
      <NAlert type="info">还没有人提交，请稍候……</NAlert>
    </template>
  </AsyncState>
</template>

<script setup lang="ts">
import { mainApi } from '@/api'
import { useAsyncState } from '@vueuse/core'
import { NTable, NAvatar, NSpace, NAlert } from 'naive-ui'
import AsyncState from '../misc/AsyncState.vue'
import { gravatar } from '@/utils/avatar'
import UserTags from '../user/UserTags.vue'
import RanklistScores from './RanklistScores.vue'
import RanklistTopstars from './RanklistTopstars.vue'
import { useRanklistsData } from '@/utils/ranklist'
import { computed } from 'vue'
import type { IProblem } from '@hpcgame-platform/server/src/db'

const props = defineProps<{
  id: string
}>()

const ranklist = useRanklistsData()
const self = computed(() => ranklist.value.find((r) => r._id === props.id))
const imgOptions = {
  root: document
}

const { state, error } = useAsyncState(async () => {
  const { players, topstars, users, problems } = await mainApi.ranklist.$get
    .query({ _id: props.id })
    .fetch()
  const userMap = Object.fromEntries(users.map((user: any) => [user._id, user]))
  return {
    players: players.map((player: any) => ({
      ...player,
      user: userMap[player.userId]
    })),
    topstars: topstars.map((topstar: any) => ({
      ...topstar,
      user: userMap[topstar.userId]
    })),
    users,
    userMap,
    problems: (problems as IProblem[]).sort((a, b) => {
      if (a.category === b.category) {
        return a.title.localeCompare(b.title)
      }
      return a.category.localeCompare(b.category)
    })
  }
}, null as never)
</script>
