import request from '@/utils/request'
import type { ApiResponse, PaginatedData, PageParams } from '@/types/common'

// 邮件通知
export function getNoticeEmailList(params?: PageParams): Promise<ApiResponse<PaginatedData<Record<string, unknown>>>> {
  return request({ url: '/v1/notice/email', method: 'get', params })
}
export function getNoticeEmailDetail(id: number | string): Promise<ApiResponse<Record<string, unknown>>> {
  return request({ url: `/v1/notice/email/${id}`, method: 'get' })
}
export function updateNoticeEmail(id: number | string, data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: `/v1/notice/email/${id}`, method: 'put', data })
}

// 短信通知
export function getNoticeSmsList(params?: PageParams): Promise<ApiResponse<PaginatedData<Record<string, unknown>>>> {
  return request({ url: '/v1/notice/sms', method: 'get', params })
}
export function getNoticeSmsDetail(id: number | string): Promise<ApiResponse<Record<string, unknown>>> {
  return request({ url: `/v1/notice/sms/${id}`, method: 'get' })
}
export function updateNoticeSms(id: number | string, data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: `/v1/notice/sms/${id}`, method: 'put', data })
}

// 通知设置
export function getNoticeSettingList(params?: PageParams): Promise<ApiResponse<PaginatedData<Record<string, unknown>>>> {
  return request({ url: '/v1/notice/setting', method: 'get', params })
}
export function updateNoticeSetting(id: number | string, data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: `/v1/notice/setting/${id}`, method: 'put', data })
}
