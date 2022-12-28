import { mainApi } from '@/api'
import { ref } from 'vue'

export interface IGameStage {
  name: string
  since: number
}

const defaultStage = { name: '未知', since: 0 }

export interface IGameSchedule {
  stages: IGameStage[]
}

const defaultSchedule: IGameSchedule = {
  stages: [defaultStage]
}

export async function loadSchedule() {
  try {
    const data = await mainApi.kv['load/:key'].$get
      .params({ key: 'schedule' })
      .fetch()
    return (data ?? defaultSchedule) as IGameSchedule
  } catch (err) {
    console.log(err)
    return defaultSchedule
  }
}

export const schedule = ref<IGameSchedule>(await loadSchedule())

export function getCurrentStage(schedule: IGameSchedule) {
  const now = Date.now()
  return schedule.stages.find((stage) => stage.since <= now) ?? defaultStage
}

export const currentStage = ref(getCurrentStage(schedule.value))

export function updateCurrentStage() {
  currentStage.value = getCurrentStage(schedule.value)
}

function updateTask() {
  updateCurrentStage()
  requestIdleCallback(updateTask, {
    timeout: 5000
  })
}

updateTask()
