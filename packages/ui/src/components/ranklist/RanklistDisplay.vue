<template>
  <AsyncState :loading="!state" :error="error">
    {{ state }}
    <NTable striped>
      <thead>
        <tr>
          <th>用户</th>
          <th>得分</th>
          <th>详细信息</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player of state.players" :key="player.userId">
          <td>{{ player.user.name }}</td>
          <td>{{ player.score }}</td>
          <td>{{ player.scores }}</td>
        </tr>
      </tbody>
    </NTable>
  </AsyncState>
</template>

<script setup lang="ts">
import { mainApi } from '@/api'
import { useAsyncState } from '@vueuse/core'
import { NTable } from 'naive-ui'
import AsyncState from '../misc/AsyncState.vue'

const props = defineProps<{
  id: string
}>()

const { state, error } = useAsyncState(async () => {
  const { players, topstars, users } = await mainApi.ranklist.$get
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
    userMap
  }
}, null as never)
</script>
