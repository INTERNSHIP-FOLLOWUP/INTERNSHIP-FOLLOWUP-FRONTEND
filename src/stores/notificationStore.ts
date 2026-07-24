import { defineStore } from 'pinia'
import type { Notification } from '@/types/notificationTypes'
import { notificationService } from '@/services/notification'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

function mapNotificationFromApi(apiNotification: Record<string, unknown>): Notification {
  return {
    id: String(apiNotification.id),
    title: apiNotification.title as string,
    message: apiNotification.message as string,
    type: apiNotification.type as Notification['type'],
    category: (apiNotification.category as Notification['category']) || 'all',
    role: (apiNotification.role as string) || 'general',
    isRead: (apiNotification.is_read as boolean) || false,
    createdAt: apiNotification.created_at as string,
    updatedAt: (apiNotification.updated_at as string) || undefined,
    readAt: (apiNotification.read_at as string) || undefined,
    actionUrl: (apiNotification.action_url as string) || undefined,
    actionLabel: (apiNotification.actionLabel as string) || undefined,
    actionRoute: (apiNotification.actionRoute as string) || undefined,
    sender: apiNotification.sender as Notification['sender'] || undefined,
    entityType: (apiNotification.entity_type as string) || undefined,
    entityId: (apiNotification.entity_id as string | number) || undefined,
    priority: (apiNotification.priority as string) || undefined,
  }
}

export const useNotificationStore = defineStore('notification', {
  state: (): { notifications: Notification[]; loading: boolean; error: string | null } => ({
    notifications: [],
    loading: false,
    error: null,
  }),

  getters: {
    unreadCount: (state) => state.notifications.filter((n) => !n.isRead).length,
  },

  actions: {
    async fetchNotifications() {
      this.loading = true
      this.error = null

      try {
        const response = await notificationService.getAll()
        this.notifications = response.data.map(mapNotificationFromApi)
      } catch (error) {
        this.error = 'Failed to fetch notifications'
        const toastStore = useToastStore()
        toastStore.error('Failed to load notifications. Please try again.', 'Error')
      } finally {
        this.loading = false
      }
    },

    async fetchUnreadCount() {
      try {
        const response = await notificationService.getUnreadCount()
        return response.data.count
      } catch (error) {
        const toastStore = useToastStore()
        toastStore.error('Failed to fetch unread count.', 'Error')
        return 0
      }
    },

    async markAsRead(id: string) {
      try {
        const response = await notificationService.markAsRead(id)
        const updatedNotification = mapNotificationFromApi(response.data)

        const index = this.notifications.findIndex((n) => n.id === id)
        if (index !== -1) {
          this.notifications[index] = updatedNotification
        }
      } catch (error) {
        const toastStore = useToastStore()
        toastStore.error('Failed to mark notification as read.', 'Error')
      }
    },

    async markAllAsRead() {
      try {
        await notificationService.markAllAsRead()

        this.notifications.forEach((notification) => {
          notification.isRead = true
        })
      } catch (error) {
        const toastStore = useToastStore()
        toastStore.error('Failed to mark all notifications as read.', 'Error')
      }
    },

    async deleteNotification(id: string) {
      try {
        await notificationService.delete(id)

        this.notifications = this.notifications.filter((n) => n.id !== id)
      } catch (error) {
        const toastStore = useToastStore()
        toastStore.error('Failed to delete notification.', 'Error')
      }
    },
  },
})