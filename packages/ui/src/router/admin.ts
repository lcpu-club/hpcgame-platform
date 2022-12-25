import type { RouteRecordRaw } from 'vue-router'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/views/AdminView.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/admin/HomeView.vue')
      },
      {
        path: 'user',
        component: () => import('@/views/admin/UserView.vue')
      },
      {
        path: 'problem',
        component: () => import('@/views/admin/ProblemView.vue')
      },
      {
        path: 'submission',
        component: () => import('@/views/admin/SubmissionView.vue')
      },
      {
        path: 'message',
        component: () => import('@/views/admin/MessageView.vue')
      },
      {
        path: 'ranklist',
        component: () => import('@/views/admin/RanklistView.vue')
      }
    ]
  }
]
