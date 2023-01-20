import type { RouteRecordRaw } from 'vue-router'

export const teamRoutes: RouteRecordRaw[] = [
  {
    path: '/team',
    component: () => import('@/views/TeamView.vue'),
    children: []
  }
]
