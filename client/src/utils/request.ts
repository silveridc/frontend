import axios from 'axios'
import { message, Modal } from 'antdv-next'
import { useUserStore } from '@/stores/user'
import { getToken } from '@/utils/auth'
import { AUTH_EXPIRED_CODES, HTTP_UNAUTHORIZED } from '@/constants/errorCode'
import router from '@/router'

let loginRedirecting = false

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 120000
})

service.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers['Authorization'] = 'Bearer ' + token
  return config
}, error => Promise.reject(error))

service.interceptors.response.use(response => {
  const res = response.data
  if (AUTH_EXPIRED_CODES.includes(res.status)) {
    if (!loginRedirecting) {
      loginRedirecting = true
      Modal.warning({
        title: '提示', content: res.messages || '登录已过期，请重新登录', okText: '确定',
        onOk: () => { loginRedirecting = false; const s = useUserStore(); s.resetToken(); router.push('/login') }
      })
    }
    return Promise.reject(new Error(res.messages || '认证过期'))
  }
  if (res.status === HTTP_UNAUTHORIZED) {
    if (!loginRedirecting) {
      loginRedirecting = true; const s = useUserStore(); s.resetToken(); router.push('/login'); loginRedirecting = false
    }
    return Promise.reject(new Error('请登录'))
  }
  return res
}, error => {
  message.error(error?.response?.data?.messages || error?.message || '请求失败')
  return Promise.reject(error)
})

export default service
