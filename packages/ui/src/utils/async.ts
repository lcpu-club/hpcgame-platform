import { inject, type InjectionKey, type Ref } from 'vue'

export const kTaskContext: InjectionKey<{
  running: Ref<boolean>
  run: <T>(task: () => Promise<T>) => Promise<[null, T] | [unknown, null]>
}> = Symbol()

export function useTaskContext() {
  const injected = inject(kTaskContext)
  if (!injected) throw new Error('Must be used within <TaskContext>')
  return injected
}
