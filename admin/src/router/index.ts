import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layout/index.vue')

const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Layout,
    meta: { title: '控制台', requiresAuth: true },
    children: [
      {
        path: '',
        name: 'DashboardIndex',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '控制台', requiresAuth: true }
      }
    ]
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Layout,
    meta: { title: '管理员管理', requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AdminIndex',
        component: () => import('@/views/admin/index.vue'),
        meta: { title: '管理员列表', requiresAuth: true }
      }
    ]
  },
  {
    path: '/client',
    name: 'Client',
    component: Layout,
    meta: { title: '客户管理', requiresAuth: true },
    children: [
      {
        path: '',
        name: 'ClientIndex',
        component: () => import('@/views/client/index.vue'),
        meta: { title: '客户列表', requiresAuth: true }
      }
    ]
  },
  {
    path: '/product',
    name: 'Product',
    component: Layout,
    meta: { title: '产品管理', requiresAuth: true },
    children: [
      {
        path: '',
        name: 'ProductIndex',
        component: () => import('@/views/product/index.vue'),
        meta: { title: '产品列表', requiresAuth: true }
      }
    ]
  },
  {
    path: '/order',
    name: 'Order',
    component: Layout,
    meta: { title: '订单管理', requiresAuth: true },
    children: [
      {
        path: '',
        name: 'OrderIndex',
        component: () => import('@/views/order/index.vue'),
        meta: { title: '订单列表', requiresAuth: true }
      }
    ]
  },
  {
    path: '/host',
    name: 'Host',
    component: Layout,
    meta: { title: '实例管理', requiresAuth: true },
    children: [
      {
        path: '',
        name: 'HostIndex',
        component: () => import('@/views/host/index.vue'),
        meta: { title: '实例列表', requiresAuth: true }
      }
    ]
  },
  {
    path: '/server',
    name: 'Server',
    component: Layout,
    meta: { title: '服务器管理', requiresAuth: true },
    children: [
      {
        path: '',
        name: 'ServerIndex',
        component: () => import('@/views/server/index.vue'),
        meta: { title: '服务器列表', requiresAuth: true }
      }
    ]
  },
  {
    path: '/server_group',
    name: 'ServerGroup',
    component: Layout,
    meta: { title: '服务器组', requiresAuth: true },
    children: [
      { path: '', name: 'ServerGroupIndex', component: () => import('@/views/server_group/index.vue'), meta: { title: '服务器组', requiresAuth: true } }
    ]
  },
  {
    path: '/supplier',
    name: 'Supplier',
    component: Layout,
    meta: { title: '供应商管理', requiresAuth: true },
    children: [
      { path: '', name: 'SupplierIndex', component: () => import('@/views/supplier/index.vue'), meta: { title: '供应商列表', requiresAuth: true } }
    ]
  },
  {
    path: '/banner',
    name: 'Banner',
    component: Layout,
    meta: { title: '轮播图管理', requiresAuth: true },
    children: [
      { path: '', name: 'BannerIndex', component: () => import('@/views/banner/index.vue'), meta: { title: '轮播图列表', requiresAuth: true } }
    ]
  },
  {
    path: '/notice',
    name: 'Notice',
    component: Layout,
    meta: { title: '通知管理', requiresAuth: true },
    children: [
      { path: '', name: 'NoticeIndex', component: () => import('@/views/notice/index.vue'), meta: { title: '通知列表', requiresAuth: true } }
    ]
  },
  {
    path: '/configuration',
    name: 'Configuration',
    component: Layout,
    meta: { title: '系统配置', requiresAuth: true },
    children: [
      { path: '', name: 'ConfigurationIndex', component: () => import('@/views/configuration/index.vue'), meta: { title: '系统配置', requiresAuth: true } }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '404', requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ top: 0 })
})

export default router
