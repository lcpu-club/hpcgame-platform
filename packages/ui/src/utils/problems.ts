import { mainApi, userInfo } from '@/api'
import { computed, inject, type InjectionKey, type Ref } from 'vue'

export async function loadProblemsData() {
  const problems = await mainApi.problem.list.$get.fetch()
  const categories = [...new Set(problems.map((p) => p.category))].map(
    (key) => ({
      category: key,
      problems: problems.filter((p) => p.category === key).sort()
    })
  )
  return { problems, categories }
}

export const kProblemsData: InjectionKey<
  Ref<Awaited<ReturnType<typeof loadProblemsData>>>
> = Symbol()

export function useProblemsData() {
  const problemsData = inject(kProblemsData)
  if (!problemsData) throw new Error('No problems data')
  return problemsData
}

export function getProblemStatus(id: string) {
  return userInfo.value.problemStatus[id]
}

export function getProblemStatusRef(id: string) {
  return computed(() => getProblemStatus(id))
}

export function getColorByScore(score: number) {
  const r = Math.floor((100 - score) * 2.55)
  const g = Math.floor(score * 2.55)
  return `rgb(${r}, ${g}, 0)`
}

export function getProblemColor(id: string) {
  const status = getProblemStatus(id)
  if (!status) return 'gray'
  return getColorByScore(status.score)
}
