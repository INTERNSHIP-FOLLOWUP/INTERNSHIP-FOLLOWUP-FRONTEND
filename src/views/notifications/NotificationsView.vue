<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Notifications</h1>
      <div class="flex items-center gap-2">
        <button
          @click="markAllRead"
          :disabled="notificationsStore.unreadCount === 0"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Mark All Read
        </button>
        <button
          @click="deleteRead"
          :disabled="!hasReadNotifications"
          class="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear Read
        </button>
      </div>
    </div>

    <NotificationFilter
      :filters="notificationsStore.filters"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div class="mt-6">
      <NotificationList
        :notifications="notificationsStore.notifications"
        :loading="notificationsStore.loading"
        v-model:selectedIds="selectedIds"
        @click="openNotification"
        @bulk-read="handleBulkRead"
        @bulk-unread="handleBulkUnread"
        @bulk-delete="handleBulkDelete"
      />
    </div>

    <div v-if="notificationsStore.pagination && notificationsStore.pagination.last_page > 1" class="mt-6">
      <BasePagination
        :meta="notificationsStore.pagination"
        @page-change="changePage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationsStore } from '@/stores/notifications';
import NotificationFilter from '@/components/common/notifications/NotificationFilter.vue';
import NotificationList from '@/components/common/notifications/NotificationList.vue';
import BasePagination from '@/components/ui/BasePagination.vue';

const router = useRouter();
const notificationsStore = useNotificationsStore();

const selectedIds = ref<number[]>([]);

const hasReadNotifications = computed(() => 
  notificationsStore.notifications.some(n => n.is_read)
);

onMounted(async () => {
  await notificationsStore.fetchNotifications();
});

const openNotification = (notification: any) => {
  router.push(`/notifications/${notification.id}`);
};

const changePage = (page: number) => {
  notificationsStore.filter({ page });
};

const markAllRead = async () => {
  try {
    await notificationsStore.markAllRead();
  } catch (error) {
    console.error('Failed to mark all as read:', error);
  }
};

const deleteRead = async () => {
  try {
    await notificationsStore.deleteRead();
  } catch (error) {
    console.error('Failed to delete read notifications:', error);
  }
};

const handleBulkRead = async () => {
  try {
    await notificationsStore.bulkMarkRead(selectedIds.value);
    selectedIds.value = [];
  } catch (error) {
    console.error('Failed to bulk mark as read:', error);
  }
};

const handleBulkUnread = async () => {
  try {
    await notificationsStore.bulkMarkUnread(selectedIds.value);
    selectedIds.value = [];
  } catch (error) {
    console.error('Failed to bulk mark as unread:', error);
  }
};

const handleBulkDelete = async () => {
  try {
    await notificationsStore.bulkDelete(selectedIds.value);
    selectedIds.value = [];
  } catch (error) {
    console.error('Failed to bulk delete:', error);
  }
};

const handleFilter = (filters: any) => {
  notificationsStore.filter(filters);
};

const handleReset = () => {
  notificationsStore.reset();
};
</script>
</parameter>
<parameter name="task_progress">- [x] Analyze existing project structure
- [x] Identify gaps in notification system
- [x] Create notification migration files
- [x] Implement notification model, events, listeners, services
- [x] Wire events into existing issue/evaluation/worklog/follow-up/assignment controllers
- [x] Create API routes and controllers for notifications
- [x] Build complete Pinia store with all actions
- [x] Add sorting support to filter component
- [x] Add bulk actions endpoints (mark read/unread, delete)
- [x] Wire bulk actions in NotificationsView
- [x] Fix NotificationList v-model binding
- [x] Integrate ReferenceCard into NotificationDetail
- [x] Fix NotificationEvent (remove broadcast)
- [x] Fix NotificationCard optional chaining
- [x] Fix NotificationList import order
- [x] Register event listener in AppServiceProvider
- [x] Fix is_read boolean conversion bug
- [x] Add sort parameter to controller
- [x] Update migration to match spec
- [x] Update Notification model with scopes and methods
- [x] Update NotificationService with all required methods
- [x] Update NotificationController
- [x] Update frontend types/store
- [x] Update NotificationCard component
- [x] Update NotificationFilter component
- [x] Update ReferenceCard component
- [x] Update NotificationsView
- [ ] Update NotificationDetailView
- [ ] Run migration
- [ ] Verify event wiring
</parameter>
</write_to_file>