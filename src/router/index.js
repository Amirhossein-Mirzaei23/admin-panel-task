import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import LoginPage from '@/views/LoginPage.vue';
import AddRole from '@/views/AddRole.vue';
import NotFound from '@/views/NotFound.vue';

const routes = [
  { path: '/login', component: LoginPage },
  { path: '/addNewRole', component: AddRole, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth) {
    if (!authStore.token) {
      //  is not authenticated and trying to access a protected route
      next('/login');
    } else {
      //  is authenticated and can access protected routes
      next();
    }
  } else if (to.path === '/login' && authStore.token) {
    //  is authenticated and trying to access the login page
    next('/addNewRole');
    
  } else if (to.path === '/') {
    // is authenticated and trying to access the login page
    next('/login');
   } else {
    //  is either not authenticated and trying to access a public route or is authenticated and accessing a public route
    next();
  }
});

export default router;
