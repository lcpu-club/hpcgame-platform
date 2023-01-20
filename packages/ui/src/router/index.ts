import { showAdmin, loggedIn } from '@/api'
import { createRouter, createWebHistory } from 'vue-router'
import { adminRoutes } from './admin'
import { loginRoutes } from './login'
import { problemsRoutes } from './problems'
import { teamRoutes } from './team'
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
      path: '/messages',
      component: () => import('@/views/MessagesView.vue')
    },
    {
      path: '/terms',
      component: () => import('@/views/TermsView.vue')
    },
    ...loginRoutes,
    ...userRoutes,
    ...teamRoutes,
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
  const pfx = (s: string) => to.path.startsWith(s)
  if (pfx('/login')) {
    return loggedIn.value ? next('/') : next()
  }
  if (pfx('/problems') || pfx('/user') || pfx('/team')) {
    return loggedIn.value ? next() : next('/login')
  }
  if (pfx('/admin')) {
    return showAdmin.value ? next() : next('/')
  }
  return next()
})

router.afterEach(() => {
  window.$loadingBar?.finish()
})

export default router
