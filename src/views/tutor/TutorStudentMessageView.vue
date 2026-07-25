<template>
  <div class="flex h-[calc(100vh-8rem)] gap-4">
    <!-- Conversations List -->
    <div
      class="w-full shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:w-80 lg:w-96"
      :class="{ 'hidden md:block': store.activeStudentId !== null }"
    >
      <div class="border-b border-gray-100 px-5 py-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900">Students</h2>
          <span
            v-if="store.totalUnreadCount > 0"
            class="inline-flex items-center justify-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700"
          >
            {{ store.totalUnreadCount }} new
          </span>
        </div>
        <p class="mt-0.5 text-xs text-gray-500">
          Chat with your assigned students
        </p>
      </div>

      <!-- Search -->
      <div class="border-b border-gray-100 px-4 py-3">
        <div class="relative">
          <svg
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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
            :placeholder="$t('common.searchStudents')"
            class="h-9 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 transition-all focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <!-- Conversations -->
      <div class="overflow-y-auto" style="height: calc(100% - 120px)">
        <div
          v-if="store.loadingConversations"
          class="flex items-center justify-center py-16"
        >
          <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>

        <div
          v-else-if="filteredConversations.length === 0"
          class="flex flex-col items-center justify-center py-16 text-center"
        >
          <svg class="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p class="mt-3 text-sm font-semibold text-gray-400">
            {{ searchQuery ? 'No students match your search.' : 'No conversations yet.' }}
          </p>
          <p v-if="!searchQuery" class="mt-1 text-xs text-gray-400">
            Start a conversation by sending a message to one of your students.
          </p>
        </div>

        <div v-else class="divide-y divide-gray-50">
          <button
            v-for="conv in filteredConversations"
            :key="conv.student.id"
            @click="selectConversation(conv)"
            class="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-all hover:bg-gray-50"
            :class="{ 'bg-indigo-50/50': conv.student.id === store.activeStudentId }"
          >
            <!-- Avatar -->
            <div class="relative flex-shrink-0">
              <div class="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm bg-gradient-to-br from-indigo-500 to-purple-600">
                <img
                  v-if="conv.student.photo_url"
                  :src="studentPhotoUrl(conv.student.photo_url)"
                  :alt="conv.student.name"
                  class="h-full w-full rounded-full object-cover"
                />
                <span v-else>{{ getInitials(conv.student.name) }}</span>
              </div>
              <span
                v-if="conv.unread_count > 0"
                class="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white ring-2 ring-white"
              >
                {{ conv.unread_count > 9 ? '9+' : conv.unread_count }}
              </span>
            </div>

            <!-- Info -->
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between">
                <h3
                  class="truncate text-sm font-semibold"
                  :class="conv.unread_count > 0 ? 'text-gray-900' : 'text-gray-700'"
                >
                  {{ conv.student.name }}
                </h3>
                <span
                  v-if="conv.last_message"
                  class="ml-2 shrink-0 text-[11px]"
                  :class="conv.unread_count > 0 ? 'font-semibold text-indigo-600' : 'text-gray-400'"
                >
                  {{ formatTime(conv.last_message.created_at) }}
                </span>
              </div>
              <p
                v-if="conv.last_message"
                class="mt-0.5 truncate text-xs"
                :class="conv.unread_count > 0 ? 'font-medium text-gray-700' : 'text-gray-400'"
              >
                {{ conv.last_message.sender_type === 'tutor' ? 'You: ' : '' }}
                {{ conv.last_message.message }}
              </p>
              <p v-else class="mt-0.5 text-xs text-gray-400 italic">No messages yet</p>
              <span class="mt-1.5 inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                Student
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Chat Area -->
    <div
      class="flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
      :class="{ 'hidden md:flex': store.activeStudentId === null }"
    >
      <div
        v-if="!activeConversation"
        class="flex flex-1 flex-col items-center justify-center text-center"
      >
        <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-50">
          <svg class="h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 class="mt-4 text-lg font-bold text-gray-800">Student Messages</h3>
        <p class="mt-1 max-w-xs text-sm text-gray-500">
          Select a student from the list to start chatting.
        </p>
      </div>

      <template v-else>
        <!-- Chat header -->
        <div class="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
          <button
            class="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 md:hidden"
            @click="store.clearMessages()"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-sm">
            <img
              v-if="activeConversation.student.photo_url"
              :src="studentPhotoUrl(activeConversation.student.photo_url)"
              :alt="activeConversation.student.name"
              class="h-full w-full rounded-full object-cover"
            />
            <span v-else>{{ getInitials(activeConversation.student.name) }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="truncate text-sm font-bold text-gray-900">{{ activeConversation.student.name }}</h3>
            <p class="text-xs text-gray-500">Student</p>
          </div>
        </div>

        <!-- Messages -->
        <div ref="messagesContainer" class="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          <div v-if="store.loadingMessages" class="flex items-center justify-center py-16">
            <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>

          <div v-else-if="store.messages.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
            <svg class="h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h4 class="mt-3 text-sm font-bold text-gray-600">No messages yet</h4>
            <p class="mt-1 text-xs text-gray-400">Send a message to start the conversation.</p>
          </div>

          <template v-else>
            <div
              v-for="msg in store.messages"
              :key="msg.id"
              class="flex"
              :class="msg.sender_type === 'tutor' ? 'justify-end' : 'justify-start'"
            >
              <div
                class="max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm"
                :class="
                  msg.sender_type === 'tutor'
                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                "
              >
                <p class="whitespace-pre-wrap text-sm leading-relaxed">{{ msg.message }}</p>
                <div class="mt-1 flex items-center justify-end gap-1" :class="msg.sender_type === 'tutor' ? '' : 'text-gray-400'">
                  <span class="text-[10px]" :class="msg.sender_type === 'tutor' ? 'text-indigo-200' : ''">
                    {{ formatTime(msg.created_at) }}
                  </span>
                  <svg v-if="msg.sender_type === 'tutor'" class="h-3 w-3" :class="msg.is_read ? 'text-indigo-200' : 'text-indigo-400'" fill="currentColor" viewBox="0 0 20 20">
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
                class="block w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 transition-all focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                @keydown.enter.exact="handleSend"
                @input="autoResize"
              />
            </div>
            <button
              @click="handleSend"
              :disabled="!newMessage.trim() || store.sendingMessage"
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg v-if="!store.sendingMessage" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useTutorStudentMessageStore } from '@/stores/tutorStudentMessageStore'
import type { TutorStudentConversation } from '@/types/message'

const store = useTutorStudentMessageStore()
const newMessage = ref('')
const searchQuery = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const scrollAnchor = ref<HTMLElement | null>(null)

const activeConversation = computed(() => store.activeConversation)

const filteredConversations = computed(() => {
  if (!searchQuery.value.trim()) return store.conversations
  const q = searchQuery.value.toLowerCase()
  return store.conversations.filter((conv) => {
    return conv.student.name.toLowerCase().includes(q)
  })
})

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function studentPhotoUrl(photo_url: string): string {
  if (/^https?:\/\//.test(photo_url)) return photo_url
  const base = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/?api\/?$/, '')
  return `${base}/storage/${photo_url.replace(/^\//, '')}`
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

async function selectConversation(conv: TutorStudentConversation) {
  await store.fetchMessages(conv.student.id)
  scrollToBottom()
}

async function handleSend() {
  const text = newMessage.value.trim()
  const studentId = store.activeStudentId
  if (!text || !studentId) return

  newMessage.value = ''
  await store.sendMessage(studentId, text)
  scrollToBottom()
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

watch(
  () => store.messages.length,
  () => scrollToBottom(),
)

onMounted(() => {
  store.fetchConversations()
  store.startPolling(5000)
})

onUnmounted(() => {
  store.reset()
})
</script>
