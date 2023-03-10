import type { MainDescriptor } from '@hpcgame-platform/server/src/services/main'
import type { IUser } from '@hpcgame-platform/server/src/db'
import { createClient, HandlerFetchError } from 'typeful-fetch'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'
import { finalizeLogout } from '@/utils/sync'
import { PREFIX } from '@/utils/storage'

export const userInfo = useLocalStorage<IUser>(
  PREFIX + 'user-info',
  {} as unknown as IUser,
  { deep: true }
)
export const authToken = computed(() => userInfo.value.authToken ?? '')
export const loggedIn = computed(() => !!authToken.value)
export const showAdmin = computed(
  () => loggedIn.value && ['admin', 'staff'].includes(userInfo.value.group)
)

export const mainApi = createClient<MainDescriptor>(
  import.meta.env.VITE_MAIN_API!,
  () => ({
    headers: {
      'auth-token': authToken.value
    }
  })
)

export function tryUpdateUser() {
  mainApi.user.$get
    .query({ userId: userInfo.value._id })
    .fetch()
    .then((user) => {
      if (user) {
        userInfo.value = user
      } else {
        userInfo.value.authToken = ''
      }
    })
    .catch((err) => {
      if (err instanceof HandlerFetchError) {
        if (err.response.status === 403) {
          userInfo.value.authToken = ''
          finalizeLogout()
        }
      }
    })
}

if (loggedIn.value) {
  tryUpdateUser()
}
