import request from '@/utils/request'
import type { ApiResponse, PaginatedData, PageParams } from '@/types/common'

// 获取产品列表
export function getProductList(params?: PageParams): Promise<ApiResponse<PaginatedData<Record<string, unknown>>>> {
  return request({ url: '/v1/product', method: 'get', params })
}

// 获取产品详情
export function getProductDetail(id: number): Promise<ApiResponse<Record<string, unknown>>> {
  return request({ url: `/v1/product/${id}`, method: 'get' })
}

// 创建产品
export function createProduct(data: Record<string, unknown>): Promise<ApiResponse<{ id: number }>> {
  return request({ url: '/v1/product', method: 'post', data })
}

// 更新产品
export function updateProduct(id: number, data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: `/v1/product/${id}`, method: 'put', data })
}

// 删除产品
export function deleteProduct(id: number): Promise<ApiResponse<null>> {
  return request({ url: `/v1/product/${id}`, method: 'delete' })
}

// 上游产品列表
export function getUpstreamProductList(params?: PageParams): Promise<ApiResponse<null>> {
  return request({ url: '/v1/upstream/product', method: 'get', params })
}
