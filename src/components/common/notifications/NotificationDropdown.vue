<template>
  <div class="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
    <div class="p-4 border-b border-gray-200 flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
      <button
        v-if="notifications.length > 0"
        @click="$emit('mark-all-read')"
        class="text-sm text-blue-600 hover:text-blue-700"
      >
        Mark all read
      </button>
    </div>

    <div class="max-h-96 overflow-y-auto">
      <div v-if="loading" class="p-4 space-y-3">
        <NotificationSkeleton v-for="i in 3" :key="i" />
      </div>

      <div v-else-if="notifications.length === 0" class="p-8">
        <NotificationEmpty title="No notifications" description="You're all caught up!" />
      </div>

      <div v-else>
        <div v-for="notification in notifications" :key="notification.id">
          <NotificationCard
            :notification="notification"
            @click="$emit('see-more', notification)"
          />
          <div class="flex items-center justify-end gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100">
            <button
              @click.stop="$emit('mark-read', notification)"
              class="text-xs text-blue-600 hover:text-blue-700"
            >
              Mark Read
            </button>
            <button
              @click.stop="$emit('delete', notification)"
              class="text-xs text-red-600 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="notifications.length > 0" class="p-3 border-t border-gray-200">
      <button
        @click="$emit('view-all')"
        class="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        View All Notifications
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Notification } from '@/types/notification';
import NotificationCard from './NotificationCard.vue';
import NotificationEmpty from './NotificationEmpty.vue';
import NotificationSkeleton from './NotificationSkeleton.vue';

defineProps<{
  notifications: Notification[];
  loading: boolean;
}>();

defineEmits<{
  close: [];
  'view-all': [];
  'mark-all-read': [];
  'mark-read': [notification: Notification];
  delete: [notification: Notification];
  'see-more': [notification: Notification];
}>();
</script>