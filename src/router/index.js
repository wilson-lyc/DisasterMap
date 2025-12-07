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
      name: 'panel_a',
      component: () => import('@/page/Panel_A.vue')
    },
    {
      path: '/panel_b',
      name: 'panel_b',
      component: () => import('@/page/Panel_B.vue')
    },
    {
      path: '/panel_c',
      name: 'panel_c',
      component: () => import('@/page/Panel_C.vue')
    },
    {
      path: '/panel_d',
      name: 'panel_d',
      component: () => import('@/page/Panel_D.vue')
    },
    {
      path: '/panel_e',
      name: 'panel_e',
      component: () => import('@/page/Panel_E.vue')
    },
    {
      path: '/panel_f',
      name: 'panel_f',
      component: () => import('@/page/Panel_F.vue')
    },
    {
      path: '/panel_g',
      name: 'panel_g',
      component: () => import('@/page/Panel_G.vue')
    },
    {
      path: '/verify',
      name: 'verify',
      component: () => import('@/page/Verify.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/panel_a'
    },
  ],
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('verify_token')
  if (!token && to.path !== '/verify') {
    next({
      path: '/verify',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
