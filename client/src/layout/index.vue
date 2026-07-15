<template>
  <a-layout style="min-height: 100vh">
    <a-layout-header class="header">
      <div class="header-left">
        <h3 @click="$router.push('/')" style="cursor:pointer;margin:0;color:#1677ff">Cloud Manager</h3>
      </div>
      <div class="header-nav">
        <a-menu mode="horizontal" :selectedKeys="selectedKeys" @click="onMenuClick" theme="dark"
          style="background:transparent;border-bottom:none">
          <a-menu-item key="/dashboard">控制台</a-menu-item>
          <a-menu-item key="/product">产品选购</a-menu-item>
          <a-menu-item key="/order">订单管理</a-menu-item>
          <a-menu-item key="/host">产品实例</a-menu-item>
          <a-menu-item key="/cart">购物车</a-menu-item>
          <a-menu-item key="/transaction">交易记录</a-menu-item>
        </a-menu>
      </div>
      <div class="header-right">
        <a-dropdown :menu="{ items: userItems }" @menu-click="onUserAction" v-if="userStore.token">
          <a><user-outlined /><span style="margin-left:4px">{{ userStore.userInfo?.name || '用户'
              }}</span><down-outlined /></a>
        </a-dropdown>
        <a-space v-else>
          <a-button type="link" @click="$router.push('/login')">登录</a-button>
          <a-button type="primary" @click="$router.push('/register')">注册</a-button>
        </a-space>
      </div>
    </a-layout-header>
    <a-layout-content class="content"><router-view /></a-layout-content>
    <a-layout-footer class="footer">Cloud Manager &copy; 2026</a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { UserOutlined, DownOutlined, LogoutOutlined, SettingOutlined } from '@antdv-next/icons'
import type { MenuItemType } from 'antdv-next'

const route = useRoute(); const router = useRouter(); const userStore = useUserStore()
const selectedKeys = ref<string[]>([route.path])
watch(() => route.path, p => selectedKeys.value = [p])
const onMenuClick = ({ key }: { key: string }) => router.push(key)
const userItems: MenuItemType[] = [
  { key: 'account', label: '账户管理', icon: SettingOutlined },
  { key: 'logout', label: '退出登录', icon: LogoutOutlined }
]
const onUserAction = (info: { key: string }) => {
  if (info.key === 'logout') userStore.doLogout()
  else if (info.key === 'account') router.push('/account')
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  background: #001529;
  padding: 0 24px;
  height: 56px;
  color: #fff;
}

.header-left {
  margin-right: 24px;
}

.header-nav {
  flex: 1;
  overflow: hidden;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
}

.content {
  margin: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  min-height: calc(100vh - 56px - 70px - 32px);
}

.footer {
  text-align: center;
  background: #f0f0f0;
  padding: 24px;
}
</style>
