import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/components/MainPage.vue'
import AuthPage from '@/components/AuthPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AuthPage,
    },

    {
      path: '/main',
      component: MainPage,
    },
  ],
})

export default router
