import request from '@/utils/request'
import type { ApiResponse, PaginatedData, PageParams } from '@/types/common'

// 获取客户列表
export function getClientList(params?: PageParams): Promise<ApiResponse<PaginatedData<Record<string, unknown>>>> {
  return request({ url: '/v1/client', method: 'get', params })
}

// 获取客户详情
export function getClientDetail(id: number): Promise<ApiResponse<Record<string, unknown>>> {
  return request({ url: `/v1/client/${id}`, method: 'get' })
}

// 创建客户
export function createClient(data: Record<string, unknown>): Promise<ApiResponse<{ id: number }>> {
  return request({ url: '/v1/client', method: 'post', data })
}

// 更新客户
export function updateClient(id: number, data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: `/v1/client/${id}`, method: 'put', data })
}

// 删除客户
export function deleteClient(id: number): Promise<ApiResponse<null>> {
  return request({ url: `/v1/client/${id}`, method: 'delete' })
}
