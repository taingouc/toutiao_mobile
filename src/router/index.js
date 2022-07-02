import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // name: 'layout',此父路由有默认子路由，name没有意义
    component: () => import('@/views/layout'),
    children: [
      { path: '/', redirect: '/home' }, // 访问根路径/时，重定向到子路由/home
      { path: '/home', name: 'home', component: () => import('@/views/home') },
      { path: '/qa', name: 'qa', component: () => import('@/views/qa') },
      { path: '/video', name: 'video', component: () => import('@/views/video') },
      { path: '/my', name: 'my', component: () => import('@/views/my') }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  }
]

const router = new VueRouter({
  routes
})

export default router
