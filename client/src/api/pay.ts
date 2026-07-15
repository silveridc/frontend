import request from '@/utils/request'
import type { ApiResponse, PaginatedData, PageParams } from '@/types/common'

export function getPayGatewayList(params?: PageParams): Promise<ApiResponse<PaginatedData<Record<string, unknown>>>> {
  return request({ url: '/v1/pay/gateway', method: 'get', params })
}
export function pay(data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: '/v1/pay', method: 'post', data })
}
export function creditPay(data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: '/v1/pay/credit', method: 'post', data })
}
