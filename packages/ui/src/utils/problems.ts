import { mainApi } from '@/api'
import { inject, type InjectionKey, type Ref } from 'vue'

export async function loadProblemsData() {
  const problems = await mainApi.problem.list.$get.fetch()
  const categories = [...new Set(problems.map((p) => p.category))].map(
    (key) => ({
      category: key,
      problems: problems.filter((p) => p.category === key)
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
