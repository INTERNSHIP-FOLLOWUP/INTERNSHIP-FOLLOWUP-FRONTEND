<template>
  <div
    class="p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
    :class="{ 'bg-blue-50': !notification.is_read }"
  >
    <div class="flex items-start gap-3">
      <NotificationAvatar
        :sender-type="notification.sender_type"
        :sender-avatar="notification.sender_avatar"
        :sender-name="notification.sender_name"
        :icon="notification.icon"
      />
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-semibold text-gray-900 truncate">
                {{ notification.sender_name }}
              </span>
              <span class="text-xs text-gray-500 truncate">
                {{ notification.sender_role }}
              </span>
              <UnreadBadge v-if="!notification.is_read" />
            </div>
            <p class="text-sm font-medium text-gray-900">
              {{ notification.title }}
            </p>
            <p class="text-xs text-gray-500 mt-1 line-clamp-2">
              {{ notification.message }}
            </p>
            <div class="flex items-center gap-2 mt-2">
              <PriorityBadge :priority="notification.priority" />
              <CategoryBadge :category="notification.category" />
              <span class="text-xs text-gray-400">
                {{ formatTimeAgo(notification.created_at) }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-1 flex-shrink-0">
            <button
              @click="$emit('action', notification)"
              class="p-1 text-gray-400 hover:text-blue-600"
              title="View"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              @click="$emit('delete', notification)"
              class="p-1 text-gray-400 hover:text-red-600"
              title="Delete"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Notification } from '@/types/notification';
import NotificationAvatar from './NotificationAvatar.vue';
import UnreadBadge from './UnreadBadge.vue';
import PriorityBadge from './PriorityBadge.vue';
import CategoryBadge from './CategoryBadge.vue';

defineProps<{
  notification: Notification;
}>();

defineEmits<{
  action: [notification: Notification];
  delete: [notification: Notification];
}>();

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