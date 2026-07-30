import { defineStore } from 'pinia';
import type { Notification, NotificationFilters, NotificationListResponse } from '@/types/notification';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Notification[],
    selectedNotification: null as Notification | null,
    latestNotifications: [] as Notification[],
    unreadCount: 0,
    loading: false,
    pagination: null as NotificationListResponse['meta'] | null,
    filters: {
      type: undefined as string | undefined,
      category: undefined as string | undefined,
      priority: undefined as string | undefined,
      is_read: undefined as boolean | undefined,
      search: undefined as string | undefined,
      reference_type: undefined as string | undefined,
      page: 1,
      per_page: 15,
    } as NotificationFilters,
  }),

  actions: {
    async fetchNotifications() {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const params: Record<string, any> = {
          page: this.filters.page,
          per_page: this.filters.per_page,
        };
        if (this.filters.type) params.type = this.filters.type;
        if (this.filters.category) params.category = this.filters.category;
        if (this.filters.priority) params.priority = this.filters.priority;
        if (this.filters.is_read !== undefined) params.is_read = this.filters.is_read ? 'true' : 'false';
        if (this.filters.search) params.search = this.filters.search;
        if (this.filters.reference_type) params.reference_type = this.filters.reference_type;

        const response = await $api<NotificationListResponse>('/notifications', { params });
        this.notifications = response.data;
        this.pagination = response.meta;
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchNotification(id: number) {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const response = await $api<{ data: Notification }>(`/notifications/${id}`);
        this.selectedNotification = response.data;
      } catch (error) {
        console.error('Failed to fetch notification:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchLatest() {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const response = await $api<{ data: Notification[] }>('/notifications/latest?limit=10');
        this.latestNotifications = response.data;
      } catch (error) {
        console.error('Failed to fetch latest notifications:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUnreadCount() {
      try {
        const { $api } = useNuxtApp();
        const response = await $api<{ data: { count: number } }>('/notifications/unread-count');
        this.unreadCount = response.data.count;
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
        throw error;
      }
    },

    async markRead(id: number) {
      try {
        const { $api } = useNuxtApp();
        const response = await $api<{ data: Notification }>(`/notifications/${id}/read`, {
          method: 'PATCH',
        });
        const index = this.notifications.findIndex((n) => n.id === id);
        if (index !== -1) {
          this.notifications[index] = response.data;
        }
        if (this.selectedNotification?.id === id) {
          this.selectedNotification = response.data;
        }
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
        throw error;
      }
    },

    async markUnread(id: number) {
      try {
        const { $api } = useNuxtApp();
        const response = await $api<{ data: Notification }>(`/notifications/${id}/unread`, {
          method: 'PATCH',
        });
        const index = this.notifications.findIndex((n) => n.id === id);
        if (index !== -1) {
          this.notifications[index] = response.data;
        }
        if (this.selectedNotification?.id === id) {
          this.selectedNotification = response.data;
        }
        this.unreadCount += 1;
      } catch (error) {
        console.error('Failed to mark notification as unread:', error);
        throw error;
      }
    },

    async markAllRead() {
      try {
        const { $api } = useNuxtApp();
        await $api('/notifications/read-all', {
          method: 'PATCH',
        });
        this.notifications.forEach((n) => {
          n.is_read = true;
          n.read_at = new Date().toISOString();
        });
        this.latestNotifications.forEach((n) => {
          n.is_read = true;
          n.read_at = new Date().toISOString();
        });
        if (this.selectedNotification) {
          this.selectedNotification.is_read = true;
          this.selectedNotification.read_at = new Date().toISOString();
        }
        this.unreadCount = 0;
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
        throw error;
      }
    },

    async deleteNotification(id: number) {
      try {
        const { $api } = useNuxtApp();
        await $api(`/notifications/${id}`, {
          method: 'DELETE',
        });
        this.notifications = this.notifications.filter((n) => n.id !== id);
        if (this.selectedNotification?.id === id) {
          this.selectedNotification = null;
        }
      } catch (error) {
        console.error('Failed to delete notification:', error);
        throw error;
      }
    },

    async deleteRead() {
      try {
        const { $api } = useNuxtApp();
        const response = await $api<{ data: { deleted: number } }>('/notifications/read', {
          method: 'DELETE',
        });
        this.notifications = this.notifications.filter((n) => !n.is_read);
        return response.data.deleted;
      } catch (error) {
        console.error('Failed to delete read notifications:', error);
        throw error;
      }
    },

    async deleteAll() {
      try {
        const { $api } = useNuxtApp();
        const response = await $api<{ data: { deleted: number } }>('/notifications', {
          method: 'DELETE',
        });
        this.notifications = [];
        this.latestNotifications = [];
        this.selectedNotification = null;
        this.unreadCount = 0;
        return response.data.deleted;
      } catch (error) {
        console.error('Failed to delete all notifications:', error);
        throw error;
      }
    },

    search(query: string) {
      this.filters.search = query;
      this.filters.page = 1;
      this.fetchNotifications();
    },

    filter(filters: Partial<NotificationFilters>) {
      this.filters = { ...this.filters, ...filters, page: 1 };
      this.fetchNotifications();
    },

    resetFilters() {
      this.filters = {
        type: undefined,
        category: undefined,
        priority: undefined,
        is_read: undefined,
        search: undefined,
        reference_type: undefined,
        page: 1,
        per_page: 15,
      };
      this.fetchNotifications();
    },
  },
});
