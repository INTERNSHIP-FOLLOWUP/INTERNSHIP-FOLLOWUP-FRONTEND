<template>
  <div class="container mx-auto px-4 py-6">
    <div v-if="notificationsStore.selectedNotification" class="max-w-3xl">
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-start gap-3 mb-4">
          <NotificationAvatar
            :sender-type="notification.sender?.type || 'system'"
            :sender-avatar="notification.sender?.avatar"
            :sender-name="notification.sender?.name || 'System'"
          />
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-semibold text-gray-900">
                {{ notification.sender?.name || 'System' }}
              </span>
              <span v-if="notification.sender?.role" class="text-xs text-gray-500">
                {{ notification.sender.role }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs px-2 py-1 rounded capitalize" :class="categoryClass">
                {{ notification.category }}
              </span>
              <span class="text-xs px-2 py-1 rounded capitalize" :class="priorityClass">
                {{ notification.priority }}
              </span>
              <span v-if="notification.event" class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 capitalize">
                {{ notification.event }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">{{ getNotificationIcon(notification.icon, notification.event) }}</span>
          <div>
            <h2 class="text-xl font-bold text-gray-900">{{ notification.title }}</h2>
            <p class="text-sm text-gray-500">{{ formatTimeAgo(notification.created_at) }}</p>
          </div>
        </div>

        <div class="prose max-w-none mb-6 p-4 bg-gray-50 rounded-lg">
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
          <div v-if="notification.reference_type">
            <span class="text-gray-500">Reference:</span>
            <span class="ml-2 capitalize">{{ notification.reference_type }}</span>
          </div>
        </div>

        <ReferenceCard
          v-if="notification.reference"
          :reference="notification.reference"
          :reference-type="notification.reference_type"
          :can-view-reference="!!notification.action_url"
        />

        <div class="flex items-center justify-between pt-4 border-t border-gray-200">
          <div class="flex items-center gap-2">
            <button
              v-if="notification.action_url"
              @click="goToAction"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Related
            </button>
            <button
              v-if="!notification.is_read"
              @click="markRead"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Mark Read
            </button>
            <button
              v-else
              @click="markUnread"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Mark Unread
            </button>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="goBack"
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
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-gray-500">Loading notification...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useNotificationsStore } from '@/stores/notifications';
import NotificationAvatar from '@/components/common/notifications/NotificationAvatar.vue';
import ReferenceCard from '@/components/common/notifications/ReferenceCard.vue';

const notificationsStore = useNotificationsStore();
const notificationId = computed(() => useRoute().params.id as string);

const notification = computed(() => notificationsStore.selectedNotification!);

const categoryClass = computed(() => {
  const classes = {
    general: 'bg-gray-100 text-gray-800',
    evaluation: 'bg-blue-100 text-blue-800',
  };
  return classes[notification.value.category] || 'bg-gray-100 text-gray-800';
});

const priorityClass = computed(() => {
  const classes = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };
  return classes[notification.value.priority] || 'bg-gray-100 text-gray-800';
});

onMounted(async () => {
  if (notificationId.value) {
    await notificationsStore.fetchNotification(Number(notificationId.value));
  }
});

const getNotificationIcon = (icon: string | null, event: string): string => {
  if (icon) return icon;
  const icons: Record<string, string> = {
    worklog_submitted: '📝',
    worklog_approved: '✅',
    worklog_rejected: '❌',
    evaluation_submitted: '📊',
    evaluation_updated: '🔄',
    evaluation_approved: '👍',
    evaluation_rejected: '👎',
    evaluation_reminder: '⏰',
    evaluation_overdue: '🚨',
    evaluation_finalized: '🏆',
    followup_created: '📅',
    followup_reminder: '🔔',
    issue_created: '⚠️',
    issue_assigned: '👤',
    issue_resolved: '✅',
    assignment_created: '💼',
    assignment_updated: '📋',
    announcement: '📢',
  };
  return icons[event] || '🔔';
};

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

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

const goToAction = () => {
  if (notificationsStore.selectedNotification?.action_url) {
    navigateTo(notificationsStore.selectedNotification.action_url);
  }
};

const goBack = () => {
  navigateTo('/notifications');
};

const markRead = async () => {
  if (notificationsStore.selectedNotification) {
    await notificationsStore.markRead(notificationsStore.selectedNotification);
  }
};

const markUnread = async () => {
  if (notificationsStore.selectedNotification) {
    await notificationsStore.markUnread(notificationsStore.selectedNotification);
  }
};

const confirmDelete = async () => {
  if (notificationsStore.selectedNotification && confirm('Are you sure you want to delete this notification?')) {
    await notificationsStore.deleteNotification(notificationsStore.selectedNotification);
    navigateTo('/notifications');
  }
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
- [x] Update NotificationDetailView
- [ ] Run migration
- [ ] Verify event wiring
</parameter>
</write_to_file>