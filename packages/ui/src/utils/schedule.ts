import { mainApi } from '@/api'
import { ref } from 'vue'
import type {
  kGameSchedule,
  InferSysType
} from '@hpcgame-platform/server/src/db/syskv'

export type IGameSchedule = InferSysType<typeof kGameSchedule>

const defaultSchedule: IGameSchedule = {
  start: 0,
  end: 0
}

export async function loadSchedule() {
  try {
    const data = await mainApi.kv['load/:key'].$get
      .params({ key: 'game_schedule' })
      .fetch()
    return (data ?? defaultSchedule) as IGameSchedule
  } catch (err) {
    console.log(err)
    return defaultSchedule
  }
}

export const schedule = ref<IGameSchedule>(await loadSchedule())

// export function updateCurrentStage() {
//   currentStage.value = getCurrentStage(schedule.value)
// }

// function updateTask() {
//   updateCurrentStage()
//   requestIdleCallback(updateTask, {
//     timeout: 5000
//   })
// }

// updateTask()
