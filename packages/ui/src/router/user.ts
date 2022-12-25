import type { RouteRecordRaw } from 'vue-router'

export const userRoutes: RouteRecordRaw[] = [
  {
    path: '/user',
    component: () => import('@/views/UserView.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/user/ProfileView.vue')
      },
      {
        path: 'logout',
        component: () => import('@/views/user/LogoutView.vue')
      }
    ]
  }
]
