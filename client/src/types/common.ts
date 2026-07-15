export interface ApiResponse<T = unknown> { status: number; messages: string; data?: T; time?: number }
export interface PaginatedData<T = unknown> { list: T[]; count: number }
export type PageParams = { page?: number; limit?: number; sort?: string; keywords?: string; [key: string]: unknown }
