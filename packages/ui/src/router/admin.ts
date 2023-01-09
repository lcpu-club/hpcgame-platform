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
        path: 'user/edit/:id',
        component: () => import('@/views/admin/UserEditView.vue'),
        props: true
      },

      {
        path: 'problem',
        component: () => import('@/views/admin/ProblemView.vue')
      },
      {
        path: 'problem/new',
        component: () => import('@/views/admin/ProblemNewView.vue')
      },
      {
        path: 'problem/edit/:id',
        component: () => import('@/views/admin/ProblemEditView.vue'),
        props: true
      },

      {
        path: 'submission',
        component: () => import('@/views/admin/SubmissionView.vue')
      },
      {
        path: 'submission/edit/:id',
        component: () => import('@/views/admin/SubmissionEditView.vue'),
        props: true
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
      },
      {
        path: 'ranklist/new',
        component: () => import('@/views/admin/RanklistNewView.vue')
      },
      {
        path: 'ranklist/edit/:id',
        component: () => import('@/views/admin/RanklistEditView.vue'),
        props: true
      },

      {
        path: 'scow',
        component: () => import('@/views/admin/ScowView.vue')
      }
    ]
  }
]
