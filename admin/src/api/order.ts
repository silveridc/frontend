import request from '@/utils/request'
import type { ApiResponse, PaginatedData, PageParams } from '@/types/common'

// 获取订单列表
export function getOrderList(params?: PageParams): Promise<ApiResponse<PaginatedData<Record<string, unknown>>>> {
  return request({ url: '/v1/order', method: 'get', params })
}

// 获取订单详情
export function getOrderDetail(id: number): Promise<ApiResponse<Record<string, unknown>>> {
  return request({ url: `/v1/order/${id}`, method: 'get' })
}

// 取消订单
export function cancelOrder(id: number): Promise<ApiResponse<null>> {
  return request({ url: `/v1/order/${id}/cancel`, method: 'put' })
}

// 上游订单列表
export function getUpstreamOrderList(params?: PageParams): Promise<ApiResponse<null>> {
  return request({ url: '/v1/upstream/order', method: 'get', params })
}

// 更新订单
export function updateWidgetOrder(data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: '/v1/widget/order', method: 'put', data })
}

// 首页轮播图排序
export function sortIndexBanner(data: { id: number[] }): Promise<ApiResponse<null>> {
  return request({ url: '/v1/index/banner/order', method: 'put', data })
}

// 云服务器轮播图排序
export function sortServerBanner(data: { id: number[] }): Promise<ApiResponse<null>> {
  return request({ url: '/v1/cloud/server/banner/order', method: 'put', data })
}
