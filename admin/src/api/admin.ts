import request from '@/utils/request'
import type { ApiResponse, PaginatedData, PageParams } from '@/types/common'

// 管理员登录
export function login(data: { username: string; password: string; remember_password?: boolean }): Promise<ApiResponse<{ token?: string }>> {
  return request({ url: '/v1/admin/login', method: 'post', data })
}

// 管理员退出登录
export function logout(): Promise<ApiResponse<null>> {
  return request({ url: '/v1/admin/logout', method: 'post' })
}

// 管理员修改密码
export function changePassword(data: { oldpass: string; newpass: string }): Promise<ApiResponse<null>> {
  return request({ url: '/v1/admin/changepassword', method: 'put', data })
}

// 获取管理员列表
export function getAdminList(params?: PageParams): Promise<ApiResponse<PaginatedData<Record<string, unknown>>>> {
  return request({ url: '/v1/admin', method: 'get', params })
}

// 获取管理员信息
export function getAdminInfo(id: number): Promise<ApiResponse<Record<string, unknown>>> {
  return request({ url: `/v1/admin/${id}`, method: 'get' })
}

// 创建管理员
export function createAdmin(data: Record<string, unknown>): Promise<ApiResponse<{ admin_id: number }>> {
  return request({ url: '/v1/admin', method: 'post', data })
}

// 修改管理员
export function updateAdmin(id: number, data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: `/v1/admin/${id}`, method: 'put', data })
}

// 删除管理员
export function deleteAdmin(id: number): Promise<ApiResponse<null>> {
  return request({ url: `/v1/admin/${id}`, method: 'delete' })
}

// 获取角色列表
export function getRoleList(params?: PageParams): Promise<ApiResponse<PaginatedData<Record<string, unknown>>>> {
  return request({ url: '/v1/admin/role', method: 'get', params })
}

// 获取角色信息
export function getRoleInfo(id: number): Promise<ApiResponse<Record<string, unknown>>> {
  return request({ url: `/v1/admin/role/${id}`, method: 'get' })
}

// 创建角色
export function createRole(data: Record<string, unknown>): Promise<ApiResponse<{ id: number }>> {
  return request({ url: '/v1/admin/role', method: 'post', data })
}

// 修改角色
export function updateRole(id: number, data: Record<string, unknown>): Promise<ApiResponse<null>> {
  return request({ url: `/v1/admin/role/${id}`, method: 'put', data })
}

// 删除角色
export function deleteRole(id: number): Promise<ApiResponse<null>> {
  return request({ url: `/v1/admin/role/${id}`, method: 'delete' })
}
