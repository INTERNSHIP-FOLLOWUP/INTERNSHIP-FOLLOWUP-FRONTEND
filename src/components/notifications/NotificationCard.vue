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
    <!-- Avatar -->
    <div class="relative shrink-0">
      <img
        v-if="senderAvatar"
        :src="senderAvatar"
        :alt="senderName"
        class="h-11 w-11 rounded-full object-cover shadow-sm ring-2 ring-slate-100"
      />
      <div
        v-else
        class="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600 shadow-sm ring-2 ring-slate-100"
      >
        {{ senderInitials }}
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1 min-w-0">
          <p
            class="text-sm font-bold"
            :class="!notification.isRead ? 'text-slate-900' : 'text-slate-700'"
          >
            {{ senderName }}
          </p>
          <span
            class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium mt-0.5"
            :class="roleBadgeColor"
          >
            {{ senderRole }}
          </span>
        </div>
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

const senderName = computed(() => props.notification.sender?.name || 'System')
const senderRole = computed(() => props.notification.sender?.role || 'System')
const senderAvatar = computed(() => props.notification.sender?.avatar || null)
const senderInitials = computed(() => {
  const name = senderName.value
  if (!name) return '?'
  const parts = name.split(' ')
  return parts.map(part => part[0]).join('').toUpperCase().slice(0, 2)
})

const roleBadgeColor = computed(() => {
  const role = senderRole.value?.toLowerCase()
  switch (role) {
    case 'student':
      return 'bg-blue-100 text-blue-700'
    case 'tutor':
      return 'bg-emerald-100 text-emerald-700'
    case 'company':
      return 'bg-indigo-100 text-indigo-700'
    case 'admin':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
})

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

function handleViewClick(notification: Notification) {
  // TODO: Replace with actual navigation when routes are implemented
  console.log('Navigate to:', notification.actionRoute)
  emit('click', notification)
}
</script>

