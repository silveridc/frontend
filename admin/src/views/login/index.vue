<template>
  <div class="login-container">
    <a-card>
      <h2 class="login-title">Cloud Manager - 管理端</h2>
      <a-form :model="form" :rules="rules" ref="formRef" @finish="handleLogin" layout="vertical">
        <a-form-item name="username">
          <a-input v-model:value="form.username" placeholder="用户名" size="large">
            <template #prefix><UserOutlined /></template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input-password v-model:value="form.password" placeholder="密码" size="large">
            <template #prefix><LockOutlined /></template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-checkbox v-model:checked="form.remember_password">记住密码</a-checkbox>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading" size="large" block>
            登 录
          </a-button>
        </a-form-item>
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

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  remember_password: false
})

const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }]
}

const handleLogin = async () => {
  loading.value = true
  try {
    await userStore.doLogin({
      username: form.username,
      password: form.password,
      remember_password: form.remember_password
    })
    message.success('登录成功')
    const redirect = (route.query.redirect as string) || '/dashboard'
    router.push(redirect)
  } catch (error: any) {
    message.error(error?.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>


<style lang="less" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.login-title {
  text-align: center;
  margin-bottom: 32px;
  color: #333;
  font-size: 22px;
}
</style>
