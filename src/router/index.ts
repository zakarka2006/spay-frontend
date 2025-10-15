import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import BillingView from "@/views/BillingView.vue";

const LoginView = () => import('../views/LoginView.vue');
const RegisterView = () => import('../views/RegisterView.vue');
const AppView = () => import('../views/AppView.vue');
const HomeView = () => import('../views/HomeView.vue');
const SettingsView = () => import('../views/SettingsView.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: RegisterView, meta: { guestOnly: true } },
    {
      path: '/',
      name: 'app',
      component: AppView,
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'home', component: HomeView },
        { path: 'billing', name: 'billing', component: BillingView },
        { path: 'settings', name: 'settings', component: SettingsView },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});

async function guard(to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) {
  const { isAuthenticated, ensureAuthChecked } = useAuth();
  await ensureAuthChecked();

  const authed = isAuthenticated.value;
  const wantsGuest = !!to.meta?.guestOnly;
  const wantsAuth = !!to.meta?.requiresAuth;

  if (!authed && wantsAuth) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }
  if (authed && wantsGuest) {
    return next({ name: 'app' });
  }
  return next();
}

router.beforeEach(guard);

export default router;
