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
        path: 'sys',
        component: () => import('@/views/admin/SysView.vue')
      },
      {
        path: 'sys/new',
        component: () => import('@/views/admin/SysNewView.vue')
      },
      {
        path: 'sys/edit/:id',
        component: () => import('@/views/admin/SysEditView.vue'),
        props: true
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
        path: 'message/new',
        component: () => import('@/views/admin/MessageNewView.vue')
      },
      {
        path: 'message/edit/:id',
        component: () => import('@/views/admin/MessageEditView.vue'),
        props: true
      },

      {
        path: 'ranklist',
        component: () => import('@/views/admin/RanklistView.vue')
      }
    ]
  }
]
