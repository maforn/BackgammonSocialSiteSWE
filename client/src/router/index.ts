import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GameView from '../views/GameView.vue'
import RegisterView from '../views/RegisterView.vue'
import { isAuthenticated } from '@/services/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: { requiresAuth: true },
    component: HomeView
  },
  {
    meta: { requiresAuth: true },
    path: '/game',
    name: 'game',
    component: GameView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      next({ name: 'register' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
