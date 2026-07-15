import request from '@/utils/request'
import type { ApiResponse } from '@/types/common'

export function login(data: { account: string; password: string; remember_password?: number }): Promise<ApiResponse<{ jwt: string; id: number; name: string }>> {
  return request({ url: '/v1/auth/login', method: 'post', data })
}
export function register(data: Record<string, unknown>): Promise<ApiResponse<{ jwt: string; id: number; name: string }>> {
  return request({ url: '/v1/auth/register', method: 'post', data })
}
export function logout(): Promise<ApiResponse<null>> {
  return request({ url: '/v1/auth/logout', method: 'post' })
}
export function changePassword(data: { old_password: string; new_password: string }): Promise<ApiResponse<null>> {
  return request({ url: '/v1/auth/password', method: 'put', data })
}
