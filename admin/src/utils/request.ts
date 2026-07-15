import axios from 'axios'
import { message, Modal } from 'antdv-next'
import { useUserStore } from '@/stores/user'
import { getToken } from '@/utils/auth'
import { API_SUCCESS_CODE, AUTH_EXPIRED_CODES, HTTP_UNAUTHORIZED } from '@/constants/errorCode'
import router from '@/router'

let loginRedirecting = false

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 120000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    // 认证过期
    if (AUTH_EXPIRED_CODES.includes(res.status)) {
      if (!loginRedirecting) {
        loginRedirecting = true
        Modal.warning({
          title: '提示',
          content: res.messages || '登录已过期，请重新登录',
          okText: '确定',
          onOk: () => {
            loginRedirecting = false
            const userStore = useUserStore()
            userStore.resetToken()
            router.push('/login')
          }
        })
      }
      return Promise.reject(new Error(res.messages || '认证过期'))
    }

    if (res.status === HTTP_UNAUTHORIZED) {
      if (!loginRedirecting) {
        loginRedirecting = true
        const userStore = useUserStore()
        userStore.resetToken()
        router.push('/login')
        loginRedirecting = false
      }
      return Promise.reject(new Error('请登录'))
    }

    return res
  },
  error => {
    const msg = error?.response?.data?.messages || error?.message || '请求失败'
    message.error(msg)
    return Promise.reject(error)
  }
)

export default service
