import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/utils/supabase'
import MainPage from '@/pages/MainPage.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import LoginPage from '@/pages/LoginPage.vue'
import SignupPage from '@/pages/SignupPage.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        { path: 'login', component: LoginPage },
        { path: 'signup', component: SignupPage },
      ],
    },

    {
      path: '/',
      component: MainPage,
      meta : { requiresAuth: true }
    },
  ],
})

router.beforeEach(async (to) => {
  const {
    data: { session }
  } = await supabase.auth.getSession()


  if(to.meta.requiresAuth && !session) { return '/auth/login' }

  if(!to.meta.requiresAuth && session) { return '/' }
})

export default router
