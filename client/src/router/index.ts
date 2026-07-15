import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
const Layout = () => import('@/layout/index.vue')
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', name: 'Login', component: () => import('@/views/login/index.vue'), meta: { title: '登录', requiresAuth: false } },
  { path: '/register', name: 'Register', component: () => import('@/views/register/index.vue'), meta: { title: '注册', requiresAuth: false } },
  { path: '/dashboard', name: 'Dashboard', component: Layout, meta: { title: '控制台', requiresAuth: true }, children: [{ path: '', name: 'DashboardIndex', component: () => import('@/views/dashboard/index.vue'), meta: { title: '控制台', requiresAuth: true } }] },
  { path: '/product', name: 'Product', component: Layout, meta: { title: '产品选购', requiresAuth: true }, children: [{ path: '', name: 'ProductIndex', component: () => import('@/views/product/index.vue'), meta: { title: '产品列表', requiresAuth: true } }] },
  { path: '/order', name: 'Order', component: Layout, meta: { title: '订单管理', requiresAuth: true }, children: [{ path: '', name: 'OrderIndex', component: () => import('@/views/order/index.vue'), meta: { title: '订单列表', requiresAuth: true } }] },
  { path: '/host', name: 'Host', component: Layout, meta: { title: '产品实例', requiresAuth: true }, children: [{ path: '', name: 'HostIndex', component: () => import('@/views/host/index.vue'), meta: { title: '实例列表', requiresAuth: true } }] },
  { path: '/cart', name: 'Cart', component: Layout, meta: { title: '购物车', requiresAuth: true }, children: [{ path: '', name: 'CartIndex', component: () => import('@/views/cart/index.vue'), meta: { title: '购物车', requiresAuth: true } }] },
  { path: '/account', name: 'Account', component: Layout, meta: { title: '账户管理', requiresAuth: true }, children: [{ path: '', name: 'AccountIndex', component: () => import('@/views/account/index.vue'), meta: { title: '账户信息', requiresAuth: true } }] },
  { path: '/transaction', name: 'Transaction', component: Layout, meta: { title: '交易记录', requiresAuth: true }, children: [{ path: '', name: 'TransactionIndex', component: () => import('@/views/transaction/index.vue'), meta: { title: '交易记录', requiresAuth: true } }] },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/login/index.vue'), meta: { title: '404', requiresAuth: false } }
]
export default createRouter({ history: createWebHashHistory(), routes, scrollBehavior: () => ({ top: 0 }) })
