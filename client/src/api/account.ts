import request from '@/utils/request'
import type { ApiResponse } from '@/types/common'

export function getProfile(): Promise<ApiResponse<Record<string, unknown>>> {
  return request({ url: '/v1/account/profile', method: 'get' })
}
export function updateProfile(data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: '/v1/account/profile', method: 'put', data })
}
export function getDashboard(): Promise<ApiResponse<Record<string, unknown>>> {
  return request({ url: '/v1/dashboard', method: 'get' })
}
export function getCountryList(): Promise<ApiResponse<Record<string, unknown>>> {
  return request({ url: '/v1/common/country', method: 'get' })
}
