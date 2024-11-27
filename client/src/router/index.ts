import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RegisterView from '../views/RegisterView.vue';
import { isAuthenticated } from '@/services/authService';
import GameView from '@/views/GameView.vue';
import PlayHumanView from '@/views/PlayHumanView.vue';
import PlayAiView from '@/views/PlayAiView.vue';
import TournamentView from '@/views/TournamentView.vue';
import PasswordRecoveryView from '@/views/PasswordRecoveryView.vue'
import PasswordResetView from '@/views/PasswordResetView.vue'
import LeaderboardView from '@/views/LeaderboardView.vue';

const routes = [
	{
		path: '/',
		name: 'home',
		meta: { requiresAuth: true },
		component: HomeView,
	},
	{
		path: '/game',
		name: 'game',
		meta: { requiresAuth: true },
		component: GameView,
	},
	{
		path: '/register',
		name: 'register',
		component: RegisterView,
	},
	{
		path: '/forgot-password',
		name: 'forgot-password',
		component: PasswordRecoveryView,
	},
	{
		path: '/reset-password',
		name: 'reset-password',
		component: PasswordResetView,
	},
	{
		meta: { requiresAuth: true },
		path: '/human',
		name: 'human',
		component: PlayHumanView,
	},
	{
		meta: { requiresAuth: true },
		path: '/ai',
		name: 'ai',
		component: PlayAiView,
	},
	{
		meta: { requiresAuth: true },
		path: '/tournament',
		name: 'tournament',
		component: TournamentView,
	},
	{
		path: '/leaderboard',
		name: 'leaderboard',
		component: LeaderboardView,
	}
];

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
