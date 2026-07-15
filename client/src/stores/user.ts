import { defineStore } from 'pinia'
import { login, logout } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => ({ token: getToken() || '', userInfo: {} as Record<string, unknown> }),
  getters: { isLoggedIn: (state) => !!state.token },
  actions: {
    async doLogin(form: { account: string; password: string; remember_password?: number }) {
      const res = await login(form)
      if (res.status !== 200) throw new Error(res.messages || '登录失败')
      const data = res.data || {} as any
      const token = data?.jwt || ''
      if (!token) throw new Error('登录成功但未获取到 token')
      this.token = token; this.userInfo = data
      setToken(token, !!form.remember_password)
      return data
    },
    resetToken() { this.token = ''; removeToken() },
    async doLogout() {
      try { await logout() } catch { /* */ }
      finally { this.resetToken(); router.push('/login') }
    }
  }
})
