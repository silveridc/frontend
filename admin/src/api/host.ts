import request from '@/utils/request'
import type { ApiResponse, PaginatedData, PageParams } from '@/types/common'

// 获取产品实例列表
export function getHostList(params?: PageParams): Promise<ApiResponse<PaginatedData<Record<string, unknown>>>> {
  return request({ url: '/v1/host', method: 'get', params })
}

// 获取产品实例详情
export function getHostDetail(id: number): Promise<ApiResponse<Record<string, unknown>>> {
  return request({ url: `/v1/host/${id}`, method: 'get' })
}

// 更新实例备注
export function updateHostNotes(id: number, data: { notes: string }): Promise<ApiResponse<null>> {
  return request({ url: `/v1/host/${id}/notes`, method: 'put', data })
}

// 暂停产品实例
export function suspendHost(id: number, data?: { reason: string }): Promise<ApiResponse<null>> {
  return request({ url: `/v1/host/${id}/suspend`, method: 'post', data })
}

// 解除暂停
export function unsuspendHost(id: number): Promise<ApiResponse<null>> {
  return request({ url: `/v1/host/${id}/unsuspend`, method: 'post' })
}

// 终止产品实例
export function terminateHost(id: number): Promise<ApiResponse<null>> {
  return request({ url: `/v1/host/${id}/terminate`, method: 'post' })
}

// 上游实例列表
export function getUpstreamHostList(params?: PageParams): Promise<ApiResponse<null>> {
  return request({ url: '/v1/upstream/host', method: 'get', params })
}
