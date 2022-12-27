import { isAdmin, loggedIn, userInfo } from '@/api'
import { createRouter, createWebHistory } from 'vue-router'
import { adminRoutes } from './admin'
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
      path: '/problems',
      component: () => import('@/views/ProblemsView.vue')
    },
    {
      path: '/ranklist',
      component: () => import('@/views/RanklistView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/login/dev',
      component: () => import('@/views/auth/DevAuth.vue'),
      beforeEnter(to, from, enter) {
        if (import.meta.env.VITE_DEV_MODE) {
          enter()
        } else {
          enter('/')
        }
      }
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
    },
    {
      path: '/messages',
      component: () => import('@/views/MessagesView.vue')
    },
    {
      path: '/terms',
      component: () => import('@/views/TermsView.vue')
    },
    ...userRoutes,
    ...adminRoutes
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/login')) {
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

export default router
