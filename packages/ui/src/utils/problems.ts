import { mainApi } from '@/api'
import { inject, type InjectionKey, type Ref } from 'vue'

export async function loadProblemsData() {
  const problems = await mainApi.problem.list.$get.fetch()
  const categories = [...new Set(problems.map((p) => p.category))]
    .sort()
    .map((key) => ({
      category: key,
      problems: problems
        .filter((p) => p.category === key)
        .sort((a, b) => a.title.localeCompare(b.title))
    }))
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

function interpolate(start: number, end: number, rate: number) {
  return Math.floor((end - start) * rate + start)
}

export function getColorByScore(score: number, maxScore: number) {
  score = score / maxScore
  // from hsl(6deg 63% 46%) to hsl(145deg 63% 42%)
  const h = interpolate(6, 145, score)
  const s = interpolate(63, 63, score)
  const l = interpolate(46, 42, score)
  return `hsl(${h}deg ${s}% ${l}%)`
}
