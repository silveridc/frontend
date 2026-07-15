import request from '@/utils/request'
import type { ApiResponse, PaginatedData, PageParams } from '@/types/common'

export function getServerGroupList(params?: PageParams): Promise<ApiResponse<PaginatedData<Record<string, unknown>>>> {
  return request({ url: '/v1/server_group', method: 'get', params })
}
export function getServerGroupDetail(id: number | string): Promise<ApiResponse<Record<string, unknown>>> {
  return request({ url: `/v1/server_group/${id}`, method: 'get' })
}
export function createServerGroup(data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: '/v1/server_group', method: 'post', data })
}
export function updateServerGroup(id: number | string, data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: `/v1/server_group/${id}`, method: 'put', data })
}
export function deleteServerGroup(id: number | string): Promise<ApiResponse<null>> {
  return request({ url: `/v1/server_group/${id}`, method: 'delete' })
}
