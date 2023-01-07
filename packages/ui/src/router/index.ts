import { isAdmin, loggedIn, userInfo } from '@/api'
import { createRouter, createWebHistory } from 'vue-router'
import { adminRoutes } from './admin'
import { loginRoutes } from './login'
import { problemsRoutes } from './problems'
import { userRoutes } from './user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/about',
      component: () => import('@/views/AboutView.vue')
    },
    {
      path: '/ranklist',
      component: () => import('@/views/RanklistView.vue')
    },
    {
      path: '/messages',
      component: () => import('@/views/MessagesView.vue')
    },
    {
      path: '/terms',
      component: () => import('@/views/TermsView.vue')
    },
    ...loginRoutes,
    ...userRoutes,
    ...adminRoutes,
    ...problemsRoutes,
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  window.$loadingBar?.start()
  if (to.path.startsWith('/login') || to.path.startsWith('/auth')) {
    return loggedIn.value ? next('/') : next()
  }
  if (to.path.startsWith('/problems') || to.path.startsWith('/user')) {
    return loggedIn.value ? next() : next('/login')
  }
  if (to.path.startsWith('/admin')) {
    return isAdmin.value ? next() : next('/')
  }
  return next()
})

router.afterEach(() => {
  window.$loadingBar?.finish()
})

export default router
