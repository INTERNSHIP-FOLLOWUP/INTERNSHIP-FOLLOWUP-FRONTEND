<template>
  <div class="mx-auto max-w-[900px]">
    <!-- Header -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Notifications</h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ unreadCount }} unread notification{{ unreadCount !== 1 ? 's' : '' }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="goBack"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      <button
        v-if="unreadCount > 0"
        @click="markAllAsRead"
        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
      >
        Mark All as Read
      </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-wrap gap-2">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="activeFilter = filter.value"
        class="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
        :class="activeFilter === filter.value
          ? 'bg-blue-600 text-white shadow-sm'
          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- Search -->
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full sm:w-96">
        <svg class="absolute left-3 top-2.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search notifications..."
          class="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      <button
        v-if="unreadCount > 0"
        @click="markAllAsRead"
        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
      >
        <svg class="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Mark all as read
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 6" :key="i" class="animate-pulse rounded-2xl bg-slate-50 p-5">
        <div class="flex gap-4">
          <div class="h-12 w-12 rounded-xl bg-slate-200" />
          <div class="flex-1 space-y-3">
            <div class="h-4 w-3/4 rounded bg-slate-200" />
            <div class="h-3 w-1/2 rounded bg-slate-200" />
            <div class="h-2 w-1/4 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications List -->
    <div v-else-if="filteredNotifications.length > 0" class="space-y-3">
      <NotificationCard
        v-for="notification in filteredNotifications"
        :key="notification.id"
        :notification="notification"
        @click="handleNotificationClick(notification)"
      >
        <!-- Extra slot for View button in center page -->
      </NotificationCard>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 px-4">
      <svg class="h-16 w-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      <h3 class="mt-4 text-lg font-bold text-slate-900">No notifications yet</h3>
      <p class="mt-1 text-sm text-slate-500">You're all caught up! Check back later for updates.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notificationStore'
import NotificationCard from './NotificationCard.vue'

const route = useRoute()
const router = useRouter()
const notificationStore = useNotificationStore()

const loading = ref(false)
const searchQuery = ref('')
const activeFilter = ref<'all' | 'unread'>('all')

onMounted(() => {
  notificationStore.fetchNotifications()
})

const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)

const filters: { label: string; value: 'all' | 'unread' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
]

const filteredNotifications = computed(() => {
  let result = [...notifications.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query)
    )
  }

  // Unread filter
  if (activeFilter.value === 'unread') {
    result = result.filter((n) => !n.isRead)
  }

  // Sort by newest first
  result.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return dateB - dateA
  })

  return result
})

function goBack() {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

async function markAllAsRead() {
  notificationStore.markAllAsRead()
}

function handleNotificationClick(notification: typeof notifications.value[0]) {
  notificationStore.markAsRead(notification.id)
  if (notification.actionRoute) {
    router.push(notification.actionRoute)
  }
}
</script>