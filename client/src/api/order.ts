import request from '@/utils/request'
import type { ApiResponse, PaginatedData, PageParams } from '@/types/common'

export function getOrderList(params?: PageParams): Promise<ApiResponse<PaginatedData<Record<string, unknown>>>> {
  return request({ url: '/v1/order', method: 'get', params })
}
export function getOrderDetail(id: number): Promise<ApiResponse<Record<string, unknown>>> {
  return request({ url: `/v1/order/${id}`, method: 'get' })
}
export function cancelOrder(id: number): Promise<ApiResponse<null>> {
  return request({ url: `/v1/order/${id}/cancel`, method: 'put' })
}
