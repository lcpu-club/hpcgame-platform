import { mainApi } from '@/api'
import { type InjectionKey, type Ref, inject } from 'vue'

export async function loadRanklistsData() {
  return mainApi.ranklist.list.$get.fetch()
}

export const kRanklistsData: InjectionKey<
  Ref<Awaited<ReturnType<typeof loadRanklistsData>>>
> = Symbol()

export function useRanklistsData() {
  const ranklistsData = inject(kRanklistsData)
  if (!ranklistsData) throw new Error('No ranklists data')
  return ranklistsData
}
