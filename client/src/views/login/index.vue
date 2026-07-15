<template>
  <div class="login-page">
    <a-card class="login-card" title="用户登录">
      <a-form :model="form" :rules="rules" ref="formRef" @finish="handleLogin" layout="vertical">
        <a-form-item name="account">
          <a-input v-model:value="form.account" placeholder="邮箱/手机号/用户名" size="large">
            <template #prefix><user-outlined /></template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input-password v-model:value="form.password" placeholder="密码" size="large">
            <template #prefix><lock-outlined /></template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-checkbox v-model:checked="form.remember_password">记住密码</a-checkbox>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading" size="large" block>登 录</a-button>
        </a-form-item>
        <div style="text-align:center">
          <a @click="$router.push('/register')">没有账号？立即注册</a>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'antdv-next'
import { UserOutlined, LockOutlined } from '@antdv-next/icons'
import { useUserStore } from '@/stores/user'
const router = useRouter();
const route = useRoute();
const userStore = useUserStore()
const formRef = ref();
const loading = ref(false)
const form = reactive({ account: '', password: '', remember_password: false })
const rules = {
  account: [{ required: true, message: '请输入账号' }],
  password: [{ required: true, message: '请输入密码' }]
}
const handleLogin = async () => {
  loading.value = true
  try {
    await userStore.doLogin({ account: form.account, password: form.password, remember_password: form.remember_password ? 1 : 0 })
    message.success('登录成功')
    router.push((route.query.redirect as string) || '/dashboard')
  } catch (e: any) { message.error(e?.message || '登录失败') }
  finally { loading.value = false }
}
</script>

<style lang="less" scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1677ff 0%, #764ba2 100%);
}

.login-card {
  width: 420px;
}
</style>
