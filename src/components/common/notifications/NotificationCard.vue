<template>
  <div
    class="p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer"
    :class="{ 'bg-blue-50': !notification.is_read }"
    @click="$emit('click', notification)"
  >
    <div class="flex items-start gap-3">
      <NotificationAvatar
        :sender-type="notification.sender?.type || 'system'"
        :sender-avatar="notification.sender?.avatar"
        :sender-name="notification.sender?.name || 'System'"
      />
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-sm font-semibold text-gray-900 truncate">
            {{ notification.sender?.name || 'System' }}
          </span>
          <span v-if="notification.sender?.role" class="text-xs text-gray-500 truncate">
            {{ notification.sender.role }}
          </span>
          <span v-if="!notification.is_read" class="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" title="Unread" />
        </div>
        <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
        <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ notification.message }}</p>
        <div class="flex items-center gap-2 mt-2">
          <span class="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-800 capitalize">
            {{ notification.category }}
          </span>
          <span class="text-xs px-2 py-0.5 rounded capitalize" :class="priorityClass">
            {{ notification.priority }}
          </span>
          <span class="text-xs text-gray-400">{{ formatTimeAgo(notification.created_at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Notification } from '@/types/notification';
import NotificationAvatar from './NotificationAvatar.vue';

defineProps<{
  notification: Notification;
}>();

defineEmits<{
  click: [notification: Notification];
}>();

const priorityClass = computed(() => {
  const classes = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };
  return classes[notification.value.priority] || 'bg-gray-100 text-gray-800';
});

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>