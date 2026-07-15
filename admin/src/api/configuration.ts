import request from '@/utils/request'
import type { ApiResponse } from '@/types/common'

export function getConfiguration(): Promise<ApiResponse<Record<string, unknown>>> {
  return request({ url: '/v1/configuration', method: 'get' })
}
export function updateConfiguration(data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: '/v1/configuration', method: 'put', data })
}
export function clearCache(): Promise<ApiResponse<null>> {
  return request({ url: '/v1/cache/clear', method: 'post' })
}
