<template>
  <div class="flex h-[calc(100vh-8rem)] gap-4">
    <!-- Conversations List -->
    <div
      class="w-full shrink-0 overflow-hidden rounded-2xl border dark:border-slate-600 border-slate-200 dark:bg-slate-800 bg-white shadow-sm sm:w-80 lg:w-96"
      :class="{ 'hidden md:block': store.activeConversationId !== null }"
    >
      <div class="border-b dark:border-slate-700 border-slate-100 px-5 py-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold dark:text-slate-100 text-slate-900">Messages</h2>
          <span
            v-if="store.totalUnreadCount > 0"
            class="inline-flex items-center justify-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700"
          >
            {{ store.totalUnreadCount }} new
          </span>
        </div>
        <p class="mt-0.5 text-xs dark:dark:text-slate-500 text-slate-400 text-slate-500">
          Communicate with your assigned tutors
        </p>
      </div>

      <!-- Search -->
      <div class="border-b dark:border-slate-700 border-slate-100 px-4 py-3">
        <div class="relative">
          <svg
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 dark:text-slate-500 text-slate-400"
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
            placeholder="Search conversations..."
            class="h-9 w-full rounded-xl border dark:border-slate-600 border-slate-200 dark:bg-slate-700 bg-slate-50 pl-9 pr-3 text-sm dark:text-slate-200 text-slate-700 placeholder-slate-400 transition-all focus:border-indigo-300 focus:dark:bg-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <!-- Conversations -->
      <div class="overflow-y-auto" style="height: calc(100% - 120px)">
        <!-- Loading -->
        <div
          v-if="store.loadingConversations"
          class="flex items-center justify-center py-16"
        >
          <svg
            class="h-8 w-8 animate-spin text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>

        <!-- Empty state -->
        <div
          v-else-if="filteredConversations.length === 0"
          class="flex flex-col items-center justify-center py-16 text-center"
        >
          <svg
            class="h-12 w-12 dark:text-slate-500 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p class="mt-3 text-sm font-semibold dark:text-slate-500 text-slate-400">
            {{ searchQuery ? 'No conversations match your search.' : 'No conversations yet.' }}
          </p>
          <p v-if="!searchQuery" class="mt-1 text-xs dark:text-slate-500 text-slate-400">
            Start a conversation by sending a message to a tutor.
          </p>
        </div>

        <!-- Conversation list -->
        <div v-else class="divide-y dark:divide-slate-700 divide-slate-50">
          <button
            v-for="conv in filteredConversations"
            :key="conv.user?.id || conv.company?.id"
            @click="selectConversation(conv)"
            class="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-all hover:dark:bg-slate-700 bg-slate-50"
            :class="{
              'bg-indigo-50/50': (conv.user?.id === store.activeConversationId || conv.company?.id === store.activeConversationId),
            }"
          >
            <!-- Avatar -->
            <div class="relative flex-shrink-0">
              <div
                class="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
                :class="conv.user ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'"
              >
                <img
                  v-if="conv.user?.avatar_url || conv.company?.logo_url"
                  :src="conv.user?.avatar_url || conv.company?.logo_url || undefined"
                  :alt="getConversationName(conv)"
                  class="h-full w-full rounded-full object-cover"
                />
                <span v-else>{{ getInitials(getConversationName(conv)) }}</span>
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
                  :class="conv.unread_count > 0 ? 'dark:text-slate-100 text-slate-900' : 'dark:text-slate-200 text-slate-700'"
                >
                  {{ getConversationName(conv) }}
                </h3>
                <span
                  v-if="conv.last_message"
                  class="ml-2 shrink-0 text-[11px]"
                  :class="conv.unread_count > 0 ? 'font-semibold text-indigo-600' : 'dark:text-slate-500 text-slate-400'"
                >
                  {{ formatTime(conv.last_message.created_at) }}
                </span>
              </div>
              <p
                v-if="conv.last_message"
                class="mt-0.5 truncate text-xs"
                :class="conv.unread_count > 0 ? 'font-medium dark:text-slate-200 text-slate-700' : 'dark:text-slate-500 text-slate-400'"
              >
                {{ isOwnMessage(conv.last_message) ? 'You: ' : '' }}
                {{ conv.last_message.message }}
              </p>
              <p v-else class="mt-0.5 text-xs dark:text-slate-500 text-slate-400 italic">
                No messages yet
              </p>

              <!-- Badge for participant type -->
              <span
                class="mt-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                :class="conv.user
                  ? 'bg-purple-50 text-purple-700'
                  : 'bg-emerald-50 text-emerald-700'"
              >
                {{ conv.user ? 'Tutor' : 'Company' }}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Chat Area -->
    <div
      class="flex flex-1 flex-col overflow-hidden rounded-2xl border dark:border-slate-600 border-slate-200 dark:bg-slate-800 bg-white shadow-sm"
      :class="{ 'hidden md:flex': store.activeConversationId === null }"
    >
      <!-- No conversation selected -->
      <div
        v-if="!activeConversation"
        class="flex flex-1 flex-col items-center justify-center text-center"
      >
        <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl dark:bg-slate-700 bg-slate-50">
          <svg
            class="h-10 w-10 dark:text-slate-500 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 class="mt-4 text-lg font-bold text-slate-800">Your Messages</h3>
        <p class="mt-1 max-w-xs text-sm dark:dark:text-slate-500 text-slate-400 text-slate-500">
          Select a conversation from the left to start chatting with a tutor.
        </p>
      </div>

      <!-- Active conversation -->
      <template v-else>
        <!-- Chat header -->
        <div
          class="flex items-center gap-3 border-b dark:border-slate-700 border-slate-100 px-5 py-4"
        >
          <!-- Mobile back button -->
          <button
            class="flex h-9 w-9 items-center justify-center rounded-xl dark:dark:text-slate-500 text-slate-400 text-slate-500 transition-colors hover:dark:bg-slate-600 bg-slate-100 md:hidden"
            @click="store.clearMessages()"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          <div
            class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
            :class="activeConversation.user
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
              : 'bg-gradient-to-br from-emerald-500 to-teal-600'"
          >
            <img
              v-if="activeConversation.user?.avatar_url || activeConversation.company?.logo_url"
              :src="activeConversation.user?.avatar_url || activeConversation.company?.logo_url || undefined"
              :alt="getConversationName(activeConversation)"
              class="h-full w-full rounded-full object-cover"
            />
            <span v-else>{{ getInitials(getConversationName(activeConversation)) }}</span>
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="truncate text-sm font-bold dark:text-slate-100 text-slate-900">
              {{ getConversationName(activeConversation) }}
            </h3>
            <p class="text-xs dark:dark:text-slate-500 text-slate-400 text-slate-500">
              {{ activeConversation.user ? 'Tutor' : 'Company Representative' }}
            </p>
          </div>
        </div>

        <!-- Messages -->
        <div ref="messagesContainer" class="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          <!-- Loading messages -->
          <div
            v-if="store.loadingMessages"
            class="flex items-center justify-center py-16"
          >
            <svg
              class="h-8 w-8 animate-spin text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>

          <!-- Empty messages -->
          <div
            v-else-if="store.messages.length === 0"
            class="flex flex-col items-center justify-center py-16 text-center"
          >
            <svg
              class="h-10 w-10 dark:text-slate-500 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h4 class="mt-3 text-sm font-bold dark:text-slate-400 text-slate-600">No messages yet</h4>
            <p class="mt-1 text-xs dark:text-slate-500 text-slate-400">
              Send a message to start the conversation.
            </p>
          </div>

          <!-- Message bubbles -->
          <template v-else>
            <div
              v-for="msg in store.messages"
              :key="msg.id"
              class="flex"
              :class="isOwnMessage(msg) ? 'justify-end' : 'justify-start'"
            >
              <div
                class="max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm"
                :class="
                  isOwnMessage(msg)
                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-br-md'
                    : 'dark:bg-slate-600 bg-slate-100 text-slate-800 rounded-bl-md'
                "
              >
                <p class="whitespace-pre-wrap text-sm leading-relaxed">{{ msg.message }}</p>
                <div
                  class="mt-1 flex items-center justify-end gap-1"
                  :class="isOwnMessage(msg) ? '' : 'dark:text-slate-500 text-slate-400'"
                >
                  <span
                    class="text-[10px]"
                    :class="isOwnMessage(msg) ? 'text-indigo-200' : ''"
                  >
                    {{ formatTime(msg.created_at) }}
                  </span>
                  <svg
                    v-if="isOwnMessage(msg)"
                    class="h-3 w-3"
                    :class="msg.is_read ? 'text-indigo-200' : 'text-indigo-400'"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      v-if="msg.is_read"
                      d="M9.129 15.231a.75.75 0 001.034.257l7.5-4.5a.75.75 0 10-.826-1.256l-7.11 4.266-2.893-2.893a.75.75 0 00-1.06 1.06l3 3z"
                    />
                    <path
                      v-else
                      d="M10.129 14.231a.75.75 0 001.034.257l7.5-4.5a.75.75 0 10-.826-1.256l-7.11 4.266-2.893-2.893a.75.75 0 00-1.06 1.06l3 3z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <!-- Scroll anchor -->
            <div ref="scrollAnchor" />
          </template>
        </div>

        <!-- Message Input -->
        <div class="border-t dark:border-slate-700 border-slate-100 px-5 py-4">
          <div class="flex items-end gap-3">
            <div class="relative flex-1">
              <textarea
                v-model="newMessage"
                placeholder="Type your message..."
                rows="1"
                class="block w-full resize-none rounded-xl border dark:border-slate-600 border-slate-200 dark:bg-slate-700 bg-slate-50 px-4 py-2.5 text-sm dark:text-slate-200 text-slate-700 placeholder-slate-400 transition-all focus:border-indigo-300 focus:dark:bg-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                @keydown.enter.exact="handleSend"
                @input="autoResize"
              />
            </div>
            <button
              @click="handleSend"
              :disabled="!newMessage.trim() || store.sendingMessage"
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                v-if="!store.sendingMessage"
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19V5m0 0l-7 7m7-7l7 7"
                />
              </svg>
              <svg
                v-else
                class="h-5 w-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
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
import { useAuthStore } from '@/stores/auth'
import { useMessageStore } from '@/stores/messageStore'
import type { MessageConversation, MessageItem } from '@/types/message'

const auth = useAuthStore()
const store = useMessageStore()
const newMessage = ref('')
const searchQuery = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const scrollAnchor = ref<HTMLElement | null>(null)

const activeConversation = computed(() => store.activeConversation)

const filteredConversations = computed(() => {
  if (!searchQuery.value.trim()) return store.conversations
  const q = searchQuery.value.toLowerCase()
  return store.conversations.filter((conv) => {
    const name = getConversationName(conv).toLowerCase()
    return name.includes(q)
  })
})

/**
 * Is the current user the sender of this message?
 * - Company users: own messages have sender_type === 'company'
 * - Tutor users: own messages have sender_type === 'tutor'
 */
function isOwnMessage(msg: MessageItem | { sender_type: string }): boolean {
  const role = auth.userRole
  if (role === 'supervisor') {
    return msg.sender_type === 'company'
  }
  if (role === 'tutor') {
    return msg.sender_type === 'tutor'
  }
  // Fallback
  return msg.sender_type === 'company'
}

function getConversationName(conv: MessageConversation): string {
  return conv.user?.name || conv.company?.name || 'Unknown'
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
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

async function selectConversation(conv: MessageConversation) {
  const id = conv.user?.id || conv.company?.id
  if (!id) return
  await store.fetchMessages(id)
  scrollToBottom()
}

async function handleSend() {
  const text = newMessage.value.trim()
  const otherId = store.activeConversationId
  if (!text || !otherId) return

  newMessage.value = ''
  await store.sendMessage(otherId, text)
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

// Scroll to bottom when new messages arrive
watch(
  () => store.messages.length,
  () => scrollToBottom(),
)

onMounted(() => {
  store.fetchConversations()
  store.startRealtime(5000)
})

onUnmounted(() => {
  store.stopRealtime()
})
</script>
