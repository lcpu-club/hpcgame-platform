import type { RouteRecordRaw } from 'vue-router'

export const loginRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/login/iaaa',
    component: () => import('@/views/auth/IaaaAuth.vue')
  },
  {
    path: '/auth/iaaa',
    component: () => import('@/views/auth/IaaaCallback.vue')
  },
  {
    path: '/login/mail',
    component: () => import('@/views/auth/MailAuth.vue')
  }
]

if (import.meta.env.VITE_DEV_MODE) {
  loginRoutes.push({
    path: '/login/dev',
    component: () => import('@/views/auth/DevAuth.vue')
  })
}
