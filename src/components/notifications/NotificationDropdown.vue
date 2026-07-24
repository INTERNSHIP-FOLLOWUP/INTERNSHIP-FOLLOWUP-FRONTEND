<template>
  <div class="w-[420px] max-h-[500px] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl ring-1 ring-black/5">
    <!-- Header -->
    <div class="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
      <h3 class="text-sm font-bold text-slate-900">Notifications</h3>
      <div class="flex items-center gap-2">
        <button
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          ✓ Read All
        </button>
        <span
          v-if="unreadCount > 0"
          class="flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600"
        >
          <span class="h-2 w-2 rounded-full bg-red-500" />
          {{ unreadCount }} New
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="max-h-80 space-y-2 overflow-y-auto p-3">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-xl bg-slate-50 p-3">
        <div class="flex gap-3">
          <div class="h-10 w-10 rounded-lg bg-slate-200" />
          <div class="flex-1 space-y-2">
            <div class="h-3 w-3/4 rounded bg-slate-200" />
            <div class="h-2 w-1/2 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications List -->
    <div v-else-if="notifications.length > 0" class="max-h-[360px] overflow-y-auto p-2">
      <NotificationCard
        v-for="notification in sortedNotifications"
        :key="notification.id"
        :notification="notification"
        @click="handleNotificationClick(notification)"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-10 px-4">
      <svg class="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      <p class="mt-2 text-sm font-medium text-slate-900">No notifications yet</p>
      <p class="text-xs text-slate-500">You're all caught up!</p>
    </div>

    <!-- Footer -->
    <div
      v-if="notifications.length > 0"
      class="sticky bottom-0 border-t border-slate-100 bg-white px-4 py-2.5"
    >
      <button
        @click="$emit('viewAll')"
        class="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
      >
        View All Notifications
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notificationStore'
import NotificationCard from './NotificationCard.vue'
import type { Notification } from '@/types/notificationTypes'

const router = useRouter()
const notificationStore = useNotificationStore()

const notifications = computed(() => notificationStore.notifications)
const loading = computed(() => notificationStore.loading)
const unreadCount = computed(() => notificationStore.unreadCount)

const sortedNotifications = computed(() => {
  return [...notifications.value].sort((a, b) => {
    if (!a.isRead && b.isRead) return -1
    if (a.isRead && !b.isRead) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

function handleNotificationClick(notification: Notification) {
  notificationStore.markAsRead(notification.id)
  if (notification.actionRoute) {
    router.push(notification.actionRoute)
  }
}

async function markAllAsRead() {
  await notificationStore.markAllAsRead()
}

defineEmits<{
  viewAll: []
}>()
</script>