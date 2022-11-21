import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

const Home = () => import('../views/Home.vue');
const About = () => import('../views/AboutView.vue');
const Manage = () => import('../views/Manage.vue');
const Song = () => import('../views/SongDetails.vue');

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },

  {
    path: '/song/:id',
    name: 'song',
    component: Song,
  },

  {
    path: '/about',
    name: 'about',
    component: About,
  },

  {
    path: '/manage-music',
    // alias:'/manage',
    name: 'manage',
    component: Manage,
    meta: { protected: true },
  },

  {
    path: '/manage',
    redirect: { name: 'manage' },
  },

  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});

router.beforeEach((to, _from, next) => {
  const isRouteProtected = to.matched.some(({ meta }) => meta.protected);

  if (!isRouteProtected) {
    next();
    return;
  }

  //* if protected route
  const { isLoggedIn } = store.state.auth;

  if (isLoggedIn) next();
  else next({ name: 'home' });
});

export default router;
