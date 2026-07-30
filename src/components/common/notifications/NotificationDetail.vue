<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <NotificationAvatar
          :sender-type="notification.sender_type"
          :sender-avatar="notification.sender_avatar"
          :sender-name="notification.sender_name"
          :icon="notification.icon"
        />
        <div>
          <h2 class="text-lg font-semibold text-gray-900">{{ notification.title }}</h2>
          <p class="text-sm text-gray-500">
            {{ notification.sender_name }} · {{ notification.sender_role }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <PriorityBadge :priority="notification.priority" />
        <CategoryBadge :category="notification.category" />
      </div>
    </div>

    <div class="prose max-w-none mb-6">
      <p class="text-gray-700 whitespace-pre-wrap">{{ notification.message }}</p>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
      <div>
        <span class="text-gray-500">Status:</span>
        <span class="ml-2 font-medium">{{ notification.is_read ? 'Read' : 'Unread' }}</span>
      </div>
      <div>
        <span class="text-gray-500">Created:</span>
        <span class="ml-2">{{ formatDate(notification.created_at) }}</span>
      </div>
      <div v-if="notification.read_at">
        <span class="text-gray-500">Read at:</span>
        <span class="ml-2">{{ formatDate(notification.read_at) }}</span>
      </div>
      <div>
        <span class="text-gray-500">Reference module:</span>
        <span class="ml-2 capitalize">{{ notification.reference_type }}</span>
      </div>
    </div>

    <div v-if="$slots.reference" class="mb-6">
      <h3 class="text-sm font-semibold text-gray-900 mb-2">Related Information</h3>
      <div class="bg-gray-50 rounded-lg p-4">
        <slot name="reference" :reference="notification.reference_data" :reference-type="notification.reference_type" :reference-id="notification.reference_id" />
      </div>
    </div>

    <div class="flex items-center justify-between pt-4 border-t border-gray-200">
      <div class="flex items-center gap-2">
        <button
          v-if="notification.action_url"
          @click="goToAction"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Action
        </button>
        <button
          v-if="!notification.is_read"
          @click="$emit('mark-read')"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Mark Read
        </button>
        <button
          v-else
          @click="$emit('mark-unread')"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Mark Unread
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="$emit('back')"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          @click="confirmDelete"
          class="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>

    <ConfirmationModal
      v-if="showDeleteModal"
      title="Delete Notification"
      message="Are you sure you want to delete this notification?"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Notification } from '@/types/notification';
import NotificationAvatar from './NotificationAvatar.vue';
import PriorityBadge from './PriorityBadge.vue';
import CategoryBadge from './CategoryBadge.vue';
import ConfirmationModal from '@/components/common/ConfirmationModal.vue';

const props = defineProps<{
  notification: Notification;
}>();

defineEmits<{
  'mark-read': [];
  'mark-unread': [];
  back: [];
  delete: [];
  action: [];
}>();

const showDeleteModal = ref(false);

watch(
  () => props.notification,
  async (newNotification) => {
    if (!newNotification.is_read && newNotification.id) {
      try {
        const { $api } = useNuxtApp();
        await $api(`/notifications/${newNotification.id}/read`, { method: 'PATCH' });
      } catch (error) {
        console.error('Failed to auto-mark as read:', error);
      }
    }
  },
  { immediate: true }
);

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

const goToAction = () => {
  if (props.notification.action_url) {
    navigateTo(props.notification.action_url);
  }
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const handleDelete = () => {
  showDeleteModal.value = false;
  emit('delete');
};
</script>