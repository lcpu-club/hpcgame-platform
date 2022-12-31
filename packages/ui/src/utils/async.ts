import { useNotification } from 'naive-ui'
import { inject, ref, type InjectionKey, type Ref } from 'vue'
import { getErrorMessage } from './error'

export const kTaskContext: InjectionKey<{
  running: Ref<boolean>
  run: <T>(task: () => Promise<T>) => Promise<[null, T] | [unknown, null]>
}> = Symbol()

export function useTaskContext() {
  const injected = inject(kTaskContext)
  if (!injected) throw new Error('Must be used within <TaskContext>')
  return injected
}

export function useSimpleAsyncTask(task: () => Promise<unknown>) {
  const notification = useNotification()
  const running = ref(false)
  const run = async () => {
    try {
      running.value = true
      await task()
    } catch (err) {
      notification.error({
        title: '操作失败',
        description: await getErrorMessage(err),
        duration: 5000
      })
    } finally {
      running.value = false
    }
  }
  return { running, run }
}
