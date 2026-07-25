<template>
  <div class="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-1 items-center justify-center">
      <svg class="h-8 w-8 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <!-- No tutor assigned -->
    <div v-else-if="!tutorName" class="flex flex-1 flex-col items-center justify-center text-center px-6">
      <div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50">
        <svg class="h-10 w-10 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h3 class="mt-4 text-lg font-bold text-gray-800">{{ $t('studentMessages.noTutorTitle') }}</h3>
      <p class="mt-1 max-w-sm text-sm text-gray-500">
        {{ $t('studentMessages.noTutorDesc') }}
      </p>
    </div>

    <template v-else>
      <!-- Chat Header -->
      <div class="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white shadow-sm">
          <img v-if="tutorPhotoUrl" :src="tutorPhotoUrl" :alt="tutorName" class="h-full w-full rounded-full object-cover" />
          <span v-else>{{ getInitials(tutorName) }}</span>
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="truncate text-sm font-bold text-gray-900">{{ tutorName }}</h3>
          <p class="text-xs text-gray-500">{{ $t('studentMessages.yourTutor') }}</p>
        </div>
      </div>

      <!-- Messages -->
      <div ref="messagesContainer" class="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        <div v-if="messages.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <svg class="h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h4 class="mt-3 text-sm font-bold text-gray-600">{{ $t('messages.messages.noMessages') }}</h4>
          <p class="mt-1 text-xs text-gray-400">{{ $t('studentMessages.noMessagesDesc') }}</p>
        </div>

        <template v-else>
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="flex"
            :class="msg.sender_type === 'student' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm"
              :class="
                msg.sender_type === 'student'
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-800 rounded-bl-md'
              "
            >
              <p class="whitespace-pre-wrap text-sm leading-relaxed">{{ msg.message }}</p>
              <div class="mt-1 flex items-center justify-end gap-1" :class="msg.sender_type === 'student' ? '' : 'text-gray-400'">
                <span class="text-[10px]" :class="msg.sender_type === 'student' ? 'text-emerald-200' : ''">
                  {{ formatTime(msg.created_at) }}
                </span>
                <svg v-if="msg.sender_type === 'student'" class="h-3 w-3" :class="msg.is_read ? 'text-emerald-200' : 'text-emerald-300'" fill="currentColor" viewBox="0 0 20 20">
                  <path v-if="msg.is_read" d="M9.129 15.231a.75.75 0 001.034.257l7.5-4.5a.75.75 0 10-.826-1.256l-7.11 4.266-2.893-2.893a.75.75 0 00-1.06 1.06l3 3z" />
                  <path v-else d="M10.129 14.231a.75.75 0 001.034.257l7.5-4.5a.75.75 0 10-.826-1.256l-7.11 4.266-2.893-2.893a.75.75 0 00-1.06 1.06l3 3z" />
                </svg>
              </div>
            </div>
          </div>
          <div ref="scrollAnchor" />
        </template>
      </div>

      <!-- Message Input -->
      <div class="border-t border-gray-100 px-5 py-4">
        <div class="flex items-end gap-3">
          <div class="relative flex-1">
            <textarea
              v-model="newMessage"
              :placeholder="$t('messages.messages.typeMessage')"
              rows="1"
              class="block w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 transition-all focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              @keydown.enter.exact="handleSend"
              @input="autoResize"
            />
          </div>
          <button
            @click="handleSend"
            :disabled="!newMessage.trim() || sending"
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg v-if="!sending" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
            <svg v-else class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { studentMessageService } from '@/services/studentMessageService'
import type { TutorStudentMessageItem } from '@/types/message'

const messages = ref<TutorStudentMessageItem[]>([])
const tutorName = ref<string | null>(null)
const tutorPhotoUrl = ref<string | null>(null)
const newMessage = ref('')
const loading = ref(true)
const sending = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const scrollAnchor = ref<HTMLElement | null>(null)

let pollInterval: ReturnType<typeof setInterval> | null = null

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatTime(dateStr?: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' })
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

async function fetchMessages() {
  try {
    const result = await studentMessageService.getMessages()
    messages.value = result.messages
    tutorName.value = result.tutorName
    tutorPhotoUrl.value = result.tutorPhotoUrl
  } catch {
    // Ignore errors
  } finally {
    loading.value = false
  }
}

async function handleSend() {
  const text = newMessage.value.trim()
  if (!text) return

  newMessage.value = ''
  sending.value = true
  try {
    const msg = await studentMessageService.sendMessage(text)
    messages.value = [...messages.value, msg]
    scrollToBottom()
  } catch {
    newMessage.value = text // Restore on failure
  } finally {
    sending.value = false
  }
}

function autoResize(e: Event) {
  const el = e.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

function scrollToBottom() {
  nextTick(() => {
    if (scrollAnchor.value) {
      scrollAnchor.value.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

function startPolling() {
  stopPolling()
  pollInterval = setInterval(async () => {
    try {
      const result = await studentMessageService.getMessages()
      // Merge new messages
      for (const msg of result.messages) {
        const exists = messages.value.some(m => m.id === msg.id)
        if (!exists) {
          messages.value = [...messages.value, msg]
        }
      }
      // Update tutor name in case it was null initially
      if (result.tutorName && !tutorName.value) {
        tutorName.value = result.tutorName
        tutorPhotoUrl.value = result.tutorPhotoUrl
      }
    } catch {
      // Silent fail on poll
    }
  }, 5000)
}

function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
}

watch(
  () => messages.value.length,
  () => scrollToBottom(),
)

onMounted(() => {
  fetchMessages()
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})
</script>
