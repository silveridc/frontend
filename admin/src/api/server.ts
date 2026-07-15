import request from '@/utils/request'
import type { ApiResponse, PaginatedData, PageParams } from '@/types/common'

// 获取服务器列表
export function getServerList(params?: PageParams): Promise<ApiResponse<PaginatedData<Record<string, unknown>>>> {
  return request({ url: '/v1/server', method: 'get', params })
}

// 获取服务器详情
export function getServerDetail(id: number | string): Promise<ApiResponse<Record<string, unknown>>> {
  return request({ url: `/v1/server/${id}`, method: 'get' })
}

// 创建服务器
export function createServer(data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: '/v1/server', method: 'post', data })
}

// 更新服务器
export function updateServer(id: number | string, data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: `/v1/server/${id}`, method: 'put', data })
}

// 删除服务器
export function deleteServer(id: number | string): Promise<ApiResponse<null>> {
  return request({ url: `/v1/server/${id}`, method: 'delete' })
}
