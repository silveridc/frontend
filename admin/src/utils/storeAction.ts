import { API_SUCCESS_CODE, AUTH_EXPIRED_CODES, HTTP_UNAUTHORIZED } from '@/constants/errorCode'
import { getToken, removeToken } from '@/utils/auth'

interface ApiResponse<T = unknown> {
  status?: number
  messages?: string
  data?: T
}

export const unwrapApiData = <T>(
  response: ApiResponse<T>,
  fallbackMessage: string
): T => {
  if (response?.status === API_SUCCESS_CODE) {
    return response?.data as T
  }
  throw new Error(String(response?.messages || fallbackMessage))
}

export const runStoreAction = async <T>(
  runner: () => Promise<ApiResponse<T>>,
  fallbackMessage: string
): Promise<T> => {
  const response = await runner()
  return unwrapApiData<T>(response, fallbackMessage)
}
