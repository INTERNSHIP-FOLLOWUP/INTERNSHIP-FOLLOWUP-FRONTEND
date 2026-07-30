<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4 mb-4">
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          v-model="localFilters.category"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="general">General</option>
          <option value="evaluation">Evaluation</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
        <select
          v-model="localFilters.priority"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          v-model="localFilters.is_read"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="true">Read</option>
          <option value="false">Unread</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Sort</label>
        <select
          v-model="localFilters.sort"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input
          v-model="localFilters.search"
          type="text"
          placeholder="Search..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Date From</label>
        <input
          v-model="localFilters.date_from"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Date To</label>
        <input
          v-model="localFilters.date_to"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <div class="flex items-center justify-between mt-4">
      <div class="flex items-center gap-2">
        <button
          @click="$emit('reset')"
          class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { useNotificationsStore } from '@/stores/notifications';

const notificationsStore = useNotificationsStore();

const localFilters = reactive({
  category: notificationsStore.filters.category || '',
  priority: notificationsStore.filters.priority || '',
  is_read: notificationsStore.filters.is_read !== undefined ? (notificationsStore.filters.is_read ? 'true' : 'false') : '' as string,
  sort: 'newest' as 'newest' | 'oldest',
  search: notificationsStore.filters.search || '',
  date_from: notificationsStore.filters.date_from || '',
  date_to: notificationsStore.filters.date_to || '',
});

watch(
  () => localFilters,
  (filters) => {
    notificationsStore.filter({
      category: filters.category || undefined,
      priority: filters.priority || undefined,
      is_read: filters.is_read === 'true' ? true : filters.is_read === 'false' ? false : undefined,
      sort: filters.sort,
      search: filters.search || undefined,
      date_from: filters.date_from || undefined,
      date_to: filters.date_to || undefined,
    });
  },
  { deep: true }
);

watch(
  () => notificationsStore.filters,
  () => {
    localFilters.category = notificationsStore.filters.category || '';
    localFilters.priority = notificationsStore.filters.priority || '';
    localFilters.is_read = notificationsStore.filters.is_read !== undefined ? (notificationsStore.filters.is_read ? 'true' : 'false') : '';
    localFilters.sort = 'newest';
    localFilters.search = notificationsStore.filters.search || '';
    localFilters.date_from = notificationsStore.filters.date_from || '';
    localFilters.date_to = notificationsStore.filters.date_to || '';
  },
  { deep: true }
);

defineEmits<{
  reset: [];
}>();
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
- [ ] Update ReferenceCard component
- [ ] Update notification views
- [ ] Run migration
- [ ] Verify event wiring
</parameter>
</write_to_file>