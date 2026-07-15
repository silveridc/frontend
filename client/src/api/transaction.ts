import request from '@/utils/request'
import type { ApiResponse, PaginatedData, PageParams } from '@/types/common'

export function getTransactionList(params?: PageParams): Promise<ApiResponse<PaginatedData<Record<string, unknown>>>> {
  return request({ url: '/v1/transaction', method: 'get', params })
}
