import request from '@/utils/request'
import type { ApiResponse, PaginatedData, PageParams } from '@/types/common'

export function getBannerList(params?: PageParams): Promise<ApiResponse<PaginatedData<Record<string, unknown>>>> {
  return request({ url: '/v1/cloud/server/banner', method: 'get', params })
}
export function createBanner(data: Record<string, unknown>): Promise<ApiResponse<{ id: number }>> {
  return request({ url: '/v1/cloud/server/banner', method: 'post', data })
}
export function updateBanner(id: number, data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: `/v1/cloud/server/banner/${id}`, method: 'put', data })
}
export function deleteBanner(id: number): Promise<ApiResponse<null>> {
  return request({ url: `/v1/cloud/server/banner/${id}`, method: 'delete' })
}
export function toggleBannerShow(id: number, show: number): Promise<ApiResponse<null>> {
  return request({ url: `/v1/cloud/server/banner/${id}/show`, method: 'put', data: { show } })
}
