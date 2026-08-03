import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export interface AppNotification {
  id: string
  type: string
  data: {
    type: string
    evaluation_id?: number
    worklog_id?: number
    issue_id?: number
    student_id?: number
    student_name?: string
    company_name?: string
    overall_score?: number | null
    status?: string
    week_number?: number | string
    title?: string
    priority?: string
    position?: string
    message: string
  }
  read_at: string | null
  created_at: string
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<AppNotification[]>([])
  const unreadCount = ref(0)
  const loading = ref(false)

  async function fetchNotifications(): Promise<void> {
    loading.value = true
    try {
      const res = await api.get('/notifications')
      notifications.value = res.data?.data ?? []
      unreadCount.value = res.data?.unread_count ?? 0
    } catch {
      // keep previous state on failure
    } finally {
      loading.value = false
    }
  }

  async function markRead(id: string): Promise<void> {
    const notif = notifications.value.find((n) => n.id === id)
    if (!notif || notif.read_at) return

    notif.read_at = new Date().toISOString()
    unreadCount.value = Math.max(0, unreadCount.value - 1)

    try {
      await api.post(`/notifications/${id}/read`)
    } catch {
      // non-critical; local state already updated optimistically
    }
  }

  async function markAllRead(): Promise<void> {
    const now = new Date().toISOString()
    notifications.value.forEach((n) => {
      if (!n.read_at) n.read_at = now
    })
    unreadCount.value = 0

    try {
      await api.post('/notifications/read-all')
    } catch {
      // non-critical; local state already updated optimistically
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markRead,
    markAllRead,
  }
})
