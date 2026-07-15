<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible theme="dark">
      <div class="logo">
        <span v-if="!collapsed">Cloud Manager</span>
        <span v-else class="logo-collapsed">CM</span>
      </div>
      <a-menu
        :selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        @click="onMenuClick"
      >
        <a-menu-item key="/dashboard">
          <dashboard-outlined />
          <span>控制台</span>
        </a-menu-item>
        <a-menu-item key="/admin">
          <user-outlined />
          <span>管理员管理</span>
        </a-menu-item>
        <a-menu-item key="/client">
          <team-outlined />
          <span>客户管理</span>
        </a-menu-item>
        <a-menu-item key="/product">
          <appstore-outlined />
          <span>产品管理</span>
        </a-menu-item>
        <a-menu-item key="/order">
          <file-text-outlined />
          <span>订单管理</span>
        </a-menu-item>
        <a-menu-item key="/host">
          <cloud-server-outlined />
          <span>实例管理</span>
        </a-menu-item>
        <a-menu-item key="/server">
          <cluster-outlined />
          <span>服务器管理</span>
        </a-menu-item>
        <a-menu-item key="/server_group">
          <cluster-outlined />
          <span>服务器组</span>
        </a-menu-item>
        <a-menu-item key="/supplier">
          <shop-outlined />
          <span>供应商管理</span>
        </a-menu-item>
        <a-menu-item key="/banner">
          <picture-outlined />
          <span>轮播图管理</span>
        </a-menu-item>
        <a-menu-item key="/notice">
          <bell-outlined />
          <span>通知管理</span>
        </a-menu-item>
        <a-menu-item key="/configuration">
          <setting-outlined />
          <span>系统配置</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="layout-header">
        <div class="header-right">
          <a-dropdown :menu="{ items: userMenuItems }" @menu-click="handleUserAction">
            <a class="user-action" @click.prevent>
              <user-outlined />
              <span class="username">管理员</span>
              <down-outlined />
            </a>
          </a-dropdown>
        </div>
      </a-layout-header>

      <a-layout-content class="layout-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { LogoutOutlined } from '@antdv-next/icons'
import type { MenuItemType } from 'antdv-next'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const collapsed = ref(false)
const selectedKeys = ref<string[]>([route.path])

watch(() => route.path, (path) => {
  selectedKeys.value = [path]
})

const onMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}

const userMenuItems: MenuItemType[] = [
  {
    key: 'logout',
    label: '退出登录',
    icon: LogoutOutlined
  }
]

const handleUserAction = (info: { key: string }) => {
  if (info.key === 'logout') {
    userStore.doLogout()
  }
}
</script>

<script lang="ts">
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  CloudServerOutlined,
  ClusterOutlined,
  ShopOutlined,
  PictureOutlined,
  BellOutlined,
  SettingOutlined,
  DownOutlined
} from '@antdv-next/icons'
</script>

<style lang="less" scoped>
.layout-header {
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  height: 56px;
  line-height: 56px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-action {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #333;
  font-size: 14px;
}

.username {
  margin: 0 4px;
}

.logo {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
}

.logo-collapsed {
  font-size: 14px;
}

.layout-content {
  margin: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  min-height: calc(100vh - 56px - 32px);
}
</style>
