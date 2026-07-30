<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="Notifications"
    >
      <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      
      <NotificationBadge v-if="unreadCount > 0" :count="unreadCount" />
    </button>

    <NotificationDropdown
      v-if="showDropdown"
      :notifications="latestNotifications"
      :loading="loading"
      @close="showDropdown = false"
      @view-all="goToNotifications"
      @mark-all-read="markAllRead"
      @mark-read="markRead"
      @delete="deleteNotification"
      @see-more="goToNotifications"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationsStore } from '@/stores/notifications';
import NotificationBadge from './NotificationBadge.vue';
import NotificationDropdown from './NotificationDropdown.vue';

const router = useRouter();
const notificationsStore = useNotificationsStore();
const showDropdown = ref(false);

const latestNotifications = notificationsStore.latestNotifications;
const unreadCount = notificationsStore.unreadCount;
const loading = notificationsStore.loading;

onMounted(async () => {
  try {
    await Promise.all([
      notificationsStore.fetchLatest(10),
      notificationsStore.fetchUnreadCount(),
    ]);
  } catch (error) {
    console.error('Failed to load notifications bell:', error);
  }
});

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const goToNotifications = () => {
  showDropdown.value = false;
  router.push('/notifications');
};

const markAllRead = async () => {
  try {
    await notificationsStore.markAllRead();
  } catch (error) {
    console.error('Failed to mark all as read:', error);
  }
};

const markRead = async (notification: any) => {
  try {
    await notificationsStore.markRead(notification);
  } catch (error) {
    console.error('Failed to mark as read:', error);
  }
};

const deleteNotification = async (notification: any) => {
  try {
    if (confirm('Delete this notification?')) {
      await notificationsStore.deleteNotification(notification);
    }
  } catch (error) {
    console.error('Failed to delete notification:', error);
  }
};

const closeDropdown = () => {
  showDropdown.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
