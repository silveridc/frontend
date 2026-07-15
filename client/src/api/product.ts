import request from '@/utils/request'
import type { ApiResponse, PaginatedData, PageParams } from '@/types/common'

export function getProductList(params?: PageParams): Promise<ApiResponse<PaginatedData<Record<string, unknown>>>> {
  return request({ url: '/v1/product', method: 'get', params })
}
export function getProductDetail(id: number | string): Promise<ApiResponse<Record<string, unknown>>> {
  return request({ url: `/v1/product/${id}`, method: 'get' })
}
