import request from '@/utils/request'
import type { ApiResponse, PaginatedData, PageParams } from '@/types/common'

export function getCartList(params?: PageParams): Promise<ApiResponse<PaginatedData<Record<string, unknown>>>> {
  return request({ url: '/v1/cart', method: 'get', params })
}
export function addToCart(data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: '/v1/cart', method: 'post', data })
}
export function updateCart(id: number | string, data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: `/v1/cart/${id}`, method: 'put', data })
}
export function deleteCart(id: number | string): Promise<ApiResponse<null>> {
  return request({ url: `/v1/cart/${id}`, method: 'delete' })
}
export function batchDeleteCart(data: { ids: number[] }): Promise<ApiResponse<null>> {
  return request({ url: '/v1/cart/batch', method: 'delete', data })
}
export function clearCart(): Promise<ApiResponse<null>> {
  return request({ url: '/v1/cart/clear', method: 'delete' })
}
export function settleCart(data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: '/v1/cart/settle', method: 'post', data })
}
