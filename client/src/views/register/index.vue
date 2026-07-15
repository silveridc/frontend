<template>
  <div class="login-page">
    <a-card class="login-card" title="用户注册">
      <a-form :model="form" :rules="rules" ref="formRef" @finish="handleRegister" layout="vertical">
        <a-form-item name="username">
          <a-input v-model:value="form.username" placeholder="用户名" size="large" />
        </a-form-item>
        <a-form-item name="email">
          <a-input v-model:value="form.email" placeholder="邮箱" size="large" />
        </a-form-item>
        <a-form-item name="phone">
          <a-input v-model:value="form.phone" placeholder="手机号" size="large" />
        </a-form-item>
        <a-form-item name="password">
          <a-input-password v-model:value="form.password" placeholder="密码" size="large" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading" size="large" block>
            注册</a-button>
        </a-form-item>
        <div style="text-align:center">
          <a @click="$router.push('/login')">已有账号？去登录</a>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'antdv-next'
import { register } from '@/api/auth'
import { useUserStore } from '@/stores/user'
import { setToken } from '@/utils/auth'
const router = useRouter(); const userStore = useUserStore()
const formRef = ref(); const loading = ref(false)
const form = reactive({ username: '', email: '', phone: '', phone_code: '86', password: '' })
const rules = { username: [{ required: true, message: '请输入用户名' }], password: [{ required: true, message: '请输入密码' }] }
const handleRegister = async () => {
  loading.value = true
  try {
    const res = await register(form)
    if (res.status !== 200) { message.error(res.messages || '注册失败'); return }
    const data = res.data || {} as any; const token = data?.jwt || ''
    if (token) { userStore.token = token; userStore.userInfo = data; setToken(token) }
    message.success('注册成功'); router.push('/dashboard')
  } catch (e: any) { message.error(e?.message || '注册失败') }
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
