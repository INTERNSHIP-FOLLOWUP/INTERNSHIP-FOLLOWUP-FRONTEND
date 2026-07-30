<template>
  <div class="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
    <div v-if="loading" class="divide-y divide-gray-100">
      <NotificationSkeleton v-for="i in 5" :key="i" />
    </div>

    <div v-else-if="notifications.length === 0" class="p-8">
      <NotificationEmpty title="No notifications" description="You're all caught up!" />
    </div>

    <div v-else>
      <div v-for="notification in notifications" :key="notification.id" class="flex items-start gap-3 p-4">
        <input
          type="checkbox"
          :checked="selectedIds.includes(notification.id)"
          @change="toggleSelect(notification.id)"
          class="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <div class="flex-1">
          <NotificationCard
            :notification="notification"
            @click="$emit('click', notification)"
          />
        </div>
      </div>
    </div>

    <div v-if="selectedIds.length > 0" class="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200">
      <span class="text-sm text-gray-700">{{ selectedIds.length }} selected</span>
      <div class="flex items-center gap-2">
        <button
          @click="$emit('bulk-read')"
          class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Mark Read
        </button>
        <button
          @click="$emit('bulk-unread')"
          class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Mark Unread
        </button>
        <button
          @click="$emit('bulk-delete')"
          class="px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Notification } from '@/types/notification';
import NotificationCard from './NotificationCard.vue';
import NotificationEmpty from './NotificationEmpty.vue';
import NotificationSkeleton from './NotificationSkeleton.vue';

const props = defineProps<{
  notifications: Notification[];
  loading: boolean;
  selectedIds?: number[];
}>();

const emit = defineEmits<{
  click: [notification: Notification];
  'update:selectedIds': [ids: number[]];
  'bulk-read': [];
  'bulk-unread': [];
  'bulk-delete': [];
}>();

const internalSelectedIds = ref<number[]>([]);

const selectedIds = computed({
  get: () => props.selectedIds ?? internalSelectedIds.value,
  set: (value: number[]) => {
    internalSelectedIds.value = value;
    emit('update:selectedIds', value);
  },
});

function toggleSelect(id: number) {
  const index = selectedIds.value.indexOf(id);
  if (index === -1) {
    selectedIds.value = [...selectedIds.value, id];
  } else {
    selectedIds.value = selectedIds.value.filter((itemId) => itemId !== id);
  }
}
</script>
