import type { RouteRecordRaw } from 'vue-router'

export const problemsRoutes: RouteRecordRaw[] = [
  {
    path: '/problems',
    component: () => import('@/views/ProblemsView.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/problems/HomeView.vue')
      },
      {
        path: ':id',
        component: () => import('@/views/problems/ProblemView.vue'),
        props: ({ params: { id } }) => ({ id, key: id })
      },
      {
        path: ':problemId/submissions/:id',
        component: () => import('@/views/problems/SubmissionView.vue'),
        props: ({ params: { id, problemId } }) => ({ id, problemId, key: id })
      }
    ]
  }
]
