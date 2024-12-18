import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import UserView from '@/views/UserView.vue';
import ClimbersView from '@/views/ClimbersView.vue';
import RankingView from '@/views/RankingView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/user',
      name: 'user',
      component: UserView,
      meta: { requiresAuth: true },
    },
    {
      path: '/climbers',
      name: 'climbers',
      component: ClimbersView,
      meta: { requiresAuth: true },
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: RankingView,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
