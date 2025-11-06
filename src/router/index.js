import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/panel_a'
    },
    {
      path: '/panel_a',
      name: 'Dynamic',
      component: () => import('@/page/dynamic.vue')
    },
    {
      path: '/panel_b',
      name: 'Map',
      component: () => import('@/page/static_old.vue')
    },
    // {
    //   path: '/panel_a_new',
    //   name: 'DynamicNew',
    //   component: () => import('@/page/dynamic_new.vue')
    // }
  ],
})

export default router
