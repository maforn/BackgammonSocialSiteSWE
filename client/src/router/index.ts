import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GameView from '../views/GameView.vue'
import RegisterView from '../views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {

      path: '/game',
      name: 'game',
      component: GameView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    }
  ],
})

export default router
