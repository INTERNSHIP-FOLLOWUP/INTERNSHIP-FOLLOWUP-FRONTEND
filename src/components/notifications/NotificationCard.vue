<template>
  <div
    class="group relative flex cursor-pointer gap-3.5 rounded-xl p-3.5 transition-all duration-200"
    :class="[
      !notification.isRead
        ? 'bg-blue-50/60 hover:bg-blue-50'
        : 'bg-white hover:bg-slate-50'
    ]"
    @click="$emit('click', notification)"
  >
    <!-- Icon -->
    <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white shadow-sm">
      <svg
        class="h-5 w-5"
        :class="iconColor"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        v-html="iconPath"
      />
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between gap-2">
        <p
          class="text-sm font-semibold"
          :class="!notification.isRead ? 'text-slate-900' : 'text-slate-700'"
        >
          {{ notification.title }}
        </p>
        <span
          v-if="!notification.isRead"
          class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500 ring-2 ring-blue-100"
        />
      </div>
      <p class="mt-1 text-xs text-slate-600 line-clamp-2">{{ notification.message }}</p>
      <div class="mt-2 flex items-center justify-between">
        <span class="text-xs text-slate-400">{{ formattedTime }}</span>
        <div class="flex items-center gap-2">
          <span
            v-if="notification.actionLabel"
            class="text-xs font-semibold text-blue-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          >
            {{ notification.actionLabel }}
          </span>
          <button
            v-if="notification.actionRoute"
            @click.stop="handleViewClick(notification)"
            class="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-blue-700"
          >
            View
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Notification } from '@/types/notificationTypes'

const props = defineProps<{
  notification: Notification
}>()

const emit = defineEmits<{
  click: [notification: Notification]
}>()

const formattedTime = computed(() => {
  const date = new Date(props.notification.createdAt)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
})

const iconPath = computed(() => {
  const paths: Record<string, string> = {
    worklog: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
    evaluation: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    assignment: 'M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M8.5 11a4 4 0 100-8 4 4 0 000 8z',
    followup: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    issue: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
    reminder: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    student: 'M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c0 1.657 3.134 3 7 3s7-1.343 7-3v-5',
    company: 'M3 21h18 M3 10h18 M5 6l7-3 7 3 M4 10v11 M20 10v11 M8 14v3 M12 14v3 M16 14v3',
    tutor: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z',
    system: 'M18 8A6 6 0 006 8c0 7 3 9 3 9h6s3-2 3-9 M12 18v-4',
    general: 'M18 8A6 6 0 006 8c0 7 3 9 3 9h6s3-2 3-9 M12 18v-4',
  }
  return paths[props.notification.type] || paths.general
})

const iconColor = computed(() => {
  const colors: Record<string, string> = {
    worklog: 'text-emerald-600',
    evaluation: 'text-purple-600',
    assignment: 'text-blue-600',
    followup: 'text-amber-600',
    issue: 'text-rose-600',
    reminder: 'text-violet-600',
    student: 'text-teal-600',
    company: 'text-indigo-600',
    tutor: 'text-cyan-600',
    system: 'text-slate-600',
    general: 'text-slate-600',
  }
  return colors[props.notification.type] || 'text-slate-600'
})

function handleViewClick(notification: Notification) {
  // TODO: Replace with actual navigation when routes are implemented
  console.log('Navigate to:', notification.actionRoute)
  emit('click', notification)
}
</script>

