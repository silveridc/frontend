import { defineStore } from 'pinia'
import { login, logout } from '@/api/admin'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { message } from 'antdv-next'
import router from '@/router'

interface UserInfo {
  id?: string | number
  name?: string
  email?: string
  phone?: string
  status?: number
  [key: string]: unknown
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken() || '',
    userInfo: {} as UserInfo
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    applyUserInfo(info: UserInfo = {}) {
      this.userInfo = info
    },

    clearUserState() {
      this.userInfo = {}
    },

    async doLogin(loginForm: { username: string; password: string; remember_password?: boolean }) {
      const res = await login(loginForm)
      if (res.status !== 200) {
        throw new Error(res.messages || '登录失败')
      }
      // 后端 token 字段为 jwt
      const data = res.data || (res as any)
      const token = data?.jwt || data?.token || data?.data?.token || ''
      if (!token) {
        throw new Error('登录成功但未获取到 token')
      }
      this.token = token
      setToken(token, loginForm.remember_password)
      return data
    },

    resetToken() {
      this.token = ''
      removeToken()
    },

    async doLogout() {
      try {
        await logout()
      } catch (error) {
        console.error('登出请求失败:', error)
      } finally {
        this.resetToken()
        router.push('/login')
      }
    }
  }
})
