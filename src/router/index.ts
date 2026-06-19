import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/pages/MainPage.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import LoginPage from '@/pages/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AuthLayout,
      children: [
        {path: '', redirect: '/login'},
        {path: 'login', component: LoginPage}
      ]
    },

    {
      path: '/main',
      component: MainPage,
    },
  ],
})

export default router
