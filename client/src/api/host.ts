import request from '@/utils/request'
import type { ApiResponse, PaginatedData, PageParams } from '@/types/common'

export function getHostList(params?: PageParams): Promise<ApiResponse<PaginatedData<Record<string, unknown>>>> {
  return request({ url: '/v1/host', method: 'get', params })
}
export function getHostDetail(id: number): Promise<ApiResponse<Record<string, unknown>>> {
  return request({ url: `/v1/host/${id}`, method: 'get' })
}
export function updateHostNotes(id: number, data: { notes: string }): Promise<ApiResponse<null>> {
  return request({ url: `/v1/host/${id}/notes`, method: 'put', data })
}
