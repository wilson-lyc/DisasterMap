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
      name: 'Static',
      component: () => import('@/page/static_cluster.vue')
    },
    // {
    //   path: '/panel_b_cluster',
    //   name: 'StaticNew',
    //   component: () => import('@/page/static_only_cluster.vue')
    // },
    // {
    //   path: '/panel_b_new',
    //   name: 'StaticNew',
    //   component: () => import('@/page/static_cluster.vue')
    // },
    {
      path: '/:pathMatch(.*)*',
      redirect:'/panel_a'
    }
  ],
})

export default router
