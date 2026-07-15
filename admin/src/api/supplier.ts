import request from '@/utils/request'
import type { ApiResponse, PaginatedData, PageParams } from '@/types/common'

export function getSupplierList(params?: PageParams): Promise<ApiResponse<PaginatedData<Record<string, unknown>>>> {
  return request({ url: '/v1/supplier', method: 'get', params })
}
export function getSupplierDetail(id: number | string): Promise<ApiResponse<Record<string, unknown>>> {
  return request({ url: `/v1/supplier/${id}`, method: 'get' })
}
export function createSupplier(data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: '/v1/supplier', method: 'post', data })
}
export function updateSupplier(id: number | string, data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: `/v1/supplier/${id}`, method: 'put', data })
}
export function deleteSupplier(id: number | string): Promise<ApiResponse<null>> {
  return request({ url: `/v1/supplier/${id}`, method: 'delete' })
}
