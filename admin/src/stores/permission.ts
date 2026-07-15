import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layout/index.vue')

// 静态路由菜单配置（前端直接定义，不依赖后端动态菜单）
export const menuRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Layout,
    meta: { title: '控制台', icon: 'DashboardOutlined', requiresAuth: true },
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
    meta: { title: '管理员管理', icon: 'UserOutlined', requiresAuth: true },
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
    meta: { title: '客户管理', icon: 'TeamOutlined', requiresAuth: true },
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
    meta: { title: '产品管理', icon: 'AppstoreOutlined', requiresAuth: true },
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
    meta: { title: '订单管理', icon: 'FileTextOutlined', requiresAuth: true },
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
    meta: { title: '实例管理', icon: 'CloudServerOutlined', requiresAuth: true },
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
    meta: { title: '服务器管理', icon: 'ClusterOutlined', requiresAuth: true },
    children: [
      {
        path: '',
        name: 'ServerIndex',
        component: () => import('@/views/server/index.vue'),
        meta: { title: '服务器列表', requiresAuth: true }
      }
    ]
  }
]

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: menuRoutes,
    dynamicRoutesApplied: false
  }),

  actions: {
    generateRoutes(): RouteRecordRaw[] {
      return menuRoutes
    },

    markDynamicRoutesApplied() {
      this.dynamicRoutesApplied = true
    }
  }
})
