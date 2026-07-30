import { defineStore } from 'pinia';
import type { Notification, NotificationFilters, NotificationListResponse } from '@/types/notification';

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[],
    selectedNotification: null as Notification | null,
    latestNotifications: [] as Notification[],
    unreadCount: 0,
    loading: false,
    pagination: null as NotificationListResponse['meta'] | null,
    filters: {
      search: undefined as string | undefined,
      category: undefined as 'general' | 'evaluation' | undefined,
      event: undefined as string | undefined,
      priority: undefined as 'low' | 'medium' | 'high' | 'urgent' | undefined,
      is_read: undefined as boolean | undefined,
      reference_type: undefined as string | undefined,
      date_from: undefined as string | undefined,
      date_to: undefined as string | undefined,
      sort: 'newest' as 'newest' | 'oldest',
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
          sort: this.filters.sort === 'newest' ? 'desc' : 'asc',
        };
        if (this.filters.search) params.search = this.filters.search;
        if (this.filters.category) params.category = this.filters.category;
        if (this.filters.event) params.event = this.filters.event;
        if (this.filters.priority) params.priority = this.filters.priority;
        if (this.filters.is_read !== undefined) params.is_read = this.filters.is_read ? 'true' : 'false';
        if (this.filters.reference_type) params.reference_type = this.filters.reference_type;
        if (this.filters.date_from) params.date_from = this.filters.date_from;
        if (this.filters.date_to) params.date_to = this.filters.date_to;

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

    async fetchLatest(limit = 10) {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const response = await $api<{ data: Notification[] }>(`/notifications/latest?limit=${limit}`);
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

    async markRead(notification: Notification) {
      try {
        const { $api } = useNuxtApp();
        const response = await $api<{ data: Notification }>(`/notifications/${notification.id}/read`, {
          method: 'PATCH',
        });
        const index = this.notifications.findIndex((n) => n.id === notification.id);
        if (index !== -1) {
          this.notifications[index] = response.data;
        }
        if (this.selectedNotification?.id === notification.id) {
          this.selectedNotification = response.data;
        }
        if (!notification.is_read) {
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
        throw error;
      }
    },

    async markUnread(notification: Notification) {
      try {
        const { $api } = useNuxtApp();
        const response = await $api<{ data: Notification }>(`/notifications/${notification.id}/unread`, {
          method: 'PATCH',
        });
        const index = this.notifications.findIndex((n) => n.id === notification.id);
        if (index !== -1) {
          this.notifications[index] = response.data;
        }
        if (this.selectedNotification?.id === notification.id) {
          this.selectedNotification = response.data;
        }
        if (notification.is_read) {
          this.unreadCount += 1;
        }
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
        console.error('Failed to mark all as read:', error);
        throw error;
      }
    },

    async deleteNotification(notification: Notification) {
      try {
        const { $api } = useNuxtApp();
        await $api(`/notifications/${notification.id}`, {
          method: 'DELETE',
        });
        this.notifications = this.notifications.filter((n) => n.id !== notification.id);
        if (this.selectedNotification?.id === notification.id) {
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
        console.error('Failed to clear all notifications:', error);
        throw error;
      }
    },

    async bulkMarkRead(ids: number[]) {
      try {
        const { $api } = useNuxtApp();
        await $api('/notifications/bulk-read', {
          method: 'PATCH',
          data: { ids },
        });
        this.notifications = this.notifications.map((n) =>
          ids.includes(n.id) ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        );
        this.latestNotifications = this.latestNotifications.map((n) =>
          ids.includes(n.id) ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        );
        this.unreadCount = Math.max(0, this.unreadCount - ids.length);
      } catch (error) {
        console.error('Failed to bulk mark as read:', error);
        throw error;
      }
    },

    async bulkMarkUnread(ids: number[]) {
      try {
        const { $api } = useNuxtApp();
        await $api('/notifications/bulk-unread', {
          method: 'PATCH',
          data: { ids },
        });
        this.notifications = this.notifications.map((n) =>
          ids.includes(n.id) ? { ...n, is_read: false, read_at: null } : n
        );
        this.latestNotifications = this.latestNotifications.map((n) =>
          ids.includes(n.id) ? { ...n, is_read: false, read_at: null } : n
        );
        this.unreadCount += ids.length;
      } catch (error) {
        console.error('Failed to bulk mark as unread:', error);
        throw error;
      }
    },

    async bulkDelete(ids: number[]) {
      try {
        const { $api } = useNuxtApp();
        const response = await $api<{ data: { deleted: number } }>('/notifications/bulk', {
          method: 'DELETE',
          data: { ids },
        });
        this.notifications = this.notifications.filter((n) => !ids.includes(n.id));
        this.latestNotifications = this.latestNotifications.filter((n) => !ids.includes(n.id));
        if (this.selectedNotification && ids.includes(this.selectedNotification.id)) {
          this.selectedNotification = null;
        }
        this.unreadCount = Math.max(0, this.unreadCount - response.data.deleted);
        return response.data.deleted;
      } catch (error) {
        console.error('Failed to bulk delete:', error);
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

    reset() {
      this.filters = {
        search: undefined,
        category: undefined,
        event: undefined,
        priority: undefined,
        is_read: undefined,
        reference_type: undefined,
        date_from: undefined,
        date_to: undefined,
        sort: 'newest',
        page: 1,
        per_page: 15,
      };
      this.fetchNotifications();
    },
  },
});