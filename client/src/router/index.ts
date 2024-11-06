import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import { isAuthenticated } from '@/services/auth'
import PlayHumanView from '@/views/PlayHumanView.vue'
import GameView from '@/views/GameView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: { requiresAuth: true },
    component: HomeView
  },
  {

    path: '/game',
    name: 'game',
    meta: { requiresAuth: true },
    component: GameView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    meta: { requiresAuth: true },
    path: '/human',
    name: 'human',
    component: PlayHumanView
  }
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (!isAuthenticated()) {
			next({ name: 'register' });
		} else {
			next();
		}
	} else {
		next();
	}
});

export default router;
