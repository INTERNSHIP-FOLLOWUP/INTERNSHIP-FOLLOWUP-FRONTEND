<template>
  <div class="relative">
    <button
      type="button"
      @click.stop="toggle"
      class="relative rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600 focus:outline-none dark:hover:bg-slate-700 dark:hover:text-slate-300"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      <span v-if="store.unreadCount > 0" class="absolute right-1.5 top-1.5 flex h-2 w-2">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
        <span class="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
      </span>
    </button>

    <transition name="fade">
      <div
        v-if="open"
        @click.stop
        class="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-gray-100 bg-white py-2 shadow-xl ring-1 ring-black/5 dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="flex items-center justify-between px-4 py-2">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-slate-100">Notifications</h3>
          <button
            v-if="store.unreadCount > 0"
            @click="store.markAllRead()"
            class="text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
          >
            Mark all as read
          </button>
        </div>
        <div class="max-h-80 overflow-y-auto">
          <div
            v-if="store.notifications.length === 0"
            class="px-4 py-6 text-center text-sm text-gray-400 dark:text-slate-500"
          >
            No notifications yet.
          </div>
          <button
            v-for="notif in store.notifications"
            :key="notif.id"
            type="button"
            @click="onNotificationClick(notif)"
            class="flex w-full flex-col items-start gap-0.5 border-b border-gray-50 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-50 dark:border-slate-700/50 dark:hover:bg-slate-700/50"
            :class="!notif.read_at ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''"
          >
            <div class="flex w-full items-start gap-2">
              <span v-if="!notif.read_at" class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
              <span v-else class="mt-1.5 h-1.5 w-1.5 shrink-0" />
              <p class="text-xs font-medium text-gray-700 dark:text-slate-200">{{ notif.data.message }}</p>
            </div>
            <span class="pl-3.5 text-[11px] text-gray-400 dark:text-slate-500">{{ formatTime(notif.created_at) }}</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore, type AppNotification } from '@/stores/notification'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const store = useNotificationStore()
const auth = useAuthStore()

const open = ref(false)

function toggle() {
  open.value = !open.value
  if (open.value) {
    store.fetchNotifications()
  }
}

function close() {
  open.value = false
}

function resolveLink(notif: AppNotification): string | null {
  const d = notif.data
  switch (d.type) {
    case 'evaluation_submitted':
      return d.student_id ? `/tutor/students/${d.student_id}?tab=evaluation` : null
    case 'worklog_submitted':
      return d.worklog_id ? `/tutor/worklogs/${d.worklog_id}` : null
    case 'worklog_reviewed':
      return d.worklog_id ? `/student/worklogs/${d.worklog_id}` : null
    case 'issue_assigned':
    case 'issue_resolved':
      return '/student/issues'
    case 'issue_reported':
      return auth.userRole === 'admin' && d.student_id ? `/admin/student-profile/${d.student_id}` : null
    case 'student_assigned':
      return '/company/students'
    default:
      return null
  }
}

function onNotificationClick(notif: AppNotification) {
  store.markRead(notif.id)
  close()
  const link = resolveLink(notif)
  if (link) router.push(link)
}

function formatTime(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  } catch {
    return dateStr
  }
}

function handleClickOutside() {
  close()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  store.fetchNotifications()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
