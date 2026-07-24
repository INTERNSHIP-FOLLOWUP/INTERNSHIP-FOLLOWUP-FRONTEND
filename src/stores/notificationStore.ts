import { defineStore } from 'pinia'
import type { Notification } from '@/types/notificationTypes'
import { getMockNotificationsByRole } from '@/data/notificationMock'
import { useAuthStore } from '@/stores/auth'

// TODO: Replace mock data with real API calls when backend is ready
export const useNotificationStore = defineStore('notification', {
  state: (): { notifications: Notification[]; loading: boolean } => ({
    notifications: [],
    loading: false,
  }),

  getters: {
    unreadCount: (state) => state.notifications.filter((n) => !n.isRead).length,
  },

  actions: {
    markAsRead(id: string) {
      const notification = this.notifications.find((n) => n.id === id)
      if (notification) {
        notification.isRead = true
      }
    },

    markAllAsRead() {
      this.notifications.forEach((n) => {
        n.isRead = true
      })
    },

    async fetchNotifications() {
      this.loading = true
      const authStore = useAuthStore()
      const userRole = authStore.user?.role || 'student'
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // Load mock data based on role
      this.notifications = getMockNotificationsByRole(userRole)
      
      // TODO: Replace with actual API call
      // this.notifications = await api.notifications.all()
      
      this.loading = false
    },
  },
})