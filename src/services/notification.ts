import api from './api'
import type { Notification } from '@/types/notificationTypes'

export interface NotificationListResponse {
  success: boolean
  data: Notification[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface NotificationResponse {
  success: boolean
  data: Notification
}

export interface UnreadCountResponse {
  success: boolean
  data: { count: number }
}

export interface NotificationUpdateResponse {
  success: boolean
  message: string
  data: { updated_count: number }
}

export const notificationService = {
  async getAll(params?: Record<string, unknown>): Promise<NotificationListResponse> {
    const response = await api.get('/notifications', { params })
    return response.data
  },

  async getUnreadCount(): Promise<UnreadCountResponse> {
    const response = await api.get('/notifications/unread-count')
    return response.data
  },

  async getById(id: number | string): Promise<NotificationResponse> {
    const response = await api.get(`/notifications/${id}`)
    return response.data
  },

  async markAsRead(id: number | string): Promise<NotificationResponse> {
    const response = await api.patch(`/notifications/${id}/read`)
    return response.data
  },

  async markAllAsRead(): Promise<NotificationUpdateResponse> {
    const response = await api.patch('/notifications/read-all')
    return response.data
  },

  async delete(id: number | string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/notifications/${id}`)
    return response.data
  },

  async filter(filters: Record<string, unknown>): Promise<NotificationListResponse> {
    const response = await api.get('/notifications/filter', { params: filters })
    return response.data
  },
}