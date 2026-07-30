import type { Notification, NotificationListResponse, NotificationFilters } from '@/types/notification';

export const notificationService = {
  async getNotifications(filters?: NotificationFilters): Promise<NotificationListResponse> {
    const { $api } = useNuxtApp();
    const params: Record<string, any> = { per_page: 15, ...filters };
    return $api('/notifications', { params });
  },

  async getUnreadCount(): Promise<{ count: number }> {
    const { $api } = useNuxtApp();
    return $api('/notifications/unread-count');
  },

  async getNotification(id: number): Promise<Notification> {
    const { $api } = useNuxtApp();
    const response = await $api<{ data: Notification }>(`/notifications/${id}`);
    return response.data;
  },

  async markAsRead(id: number): Promise<Notification> {
    const { $api } = useNuxtApp();
    const response = await $api<{ data: Notification }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
    return response.data;
  },

  async markAsUnread(id: number): Promise<Notification> {
    const { $api } = useNuxtApp();
    const response = await $api<{ data: Notification }>(`/notifications/${id}/unread`, {
      method: 'PATCH',
    });
    return response.data;
  },

  async markAllAsRead(): Promise<{ marked: number }> {
    const { $api } = useNuxtApp();
    const response = await $api<{ data: { marked: number } }>('/notifications/read-all', {
      method: 'PATCH',
    });
    return response.data;
  },

  async deleteNotification(id: number): Promise<void> {
    const { $api } = useNuxtApp();
    await $api(`/notifications/${id}`, {
      method: 'DELETE',
    });
  },

  async deleteRead(): Promise<{ deleted: number }> {
    const { $api } = useNuxtApp();
    const response = await $api<{ data: { deleted: number } }>('/notifications/read', {
      method: 'DELETE',
    });
    return response.data;
  },

  async deleteAll(): Promise<{ deleted: number }> {
    const { $api } = useNuxtApp();
    const response = await $api<{ data: { deleted: number } }>('/notifications', {
      method: 'DELETE',
    });
    return response.data;
  },
};