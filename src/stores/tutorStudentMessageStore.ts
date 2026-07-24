import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tutorStudentMessageService } from '@/services/tutorStudentMessageService'
import { parseApiError } from '@/utils/errorParser'
import type { TutorStudentConversation, TutorStudentMessageItem } from '@/types/message'

export const useTutorStudentMessageStore = defineStore('tutorStudentMessage', () => {
  const conversations = ref<TutorStudentConversation[]>([])
  const messages = ref<TutorStudentMessageItem[]>([])
  const activeStudentId = ref<number | null>(null)
  const loadingConversations = ref(false)
  const loadingMessages = ref(false)
  const sendingMessage = ref(false)
  const error = ref<string | null>(null)
  const lastPollTime = ref<string | null>(null)
  let pollIntervalId: ReturnType<typeof setInterval> | null = null

  const activeConversation = computed(() => {
    if (activeStudentId.value == null) return null
    return conversations.value.find((c) => c.student.id === activeStudentId.value) ?? null
  })

  const totalUnreadCount = computed(() => {
    return conversations.value.reduce((sum, c) => sum + c.unread_count, 0)
  })

  function updateLastPollTime(time: string): void {
    if (time && (!lastPollTime.value || time > lastPollTime.value)) {
      lastPollTime.value = time
    }
  }

  async function fetchConversations(): Promise<void> {
    loadingConversations.value = true
    error.value = null

    try {
      const res = await tutorStudentMessageService.getConversations()
      conversations.value = res.data
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
    } finally {
      loadingConversations.value = false
    }
  }

  async function fetchMessages(studentId: number): Promise<void> {
    loadingMessages.value = true
    error.value = null
    activeStudentId.value = studentId

    try {
      const res = await tutorStudentMessageService.getMessages(studentId)
      messages.value = res.data

      // Mark conversation as read locally
      const conv = conversations.value.find((c) => c.student.id === studentId)
      if (conv) {
        conv.unread_count = 0
      }
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      throw err
    } finally {
      loadingMessages.value = false
    }
  }

  async function sendMessage(studentId: number, text: string): Promise<TutorStudentMessageItem | null> {
    sendingMessage.value = true
    error.value = null

    try {
      const res = await tutorStudentMessageService.sendMessage(studentId, { message: text })
      messages.value = [...messages.value, res.data]
      updateLastPollTime(res.data.created_at)
      // Refresh conversations to update last message
      await fetchConversations()
      return res.data
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
      return null
    } finally {
      sendingMessage.value = false
    }
  }

  /**
   * Poll for new messages since the last poll time.
   */
  async function pollForUpdates(): Promise<boolean> {
    if (!lastPollTime.value) {
      lastPollTime.value = new Date().toISOString()
      return false
    }

    try {
      // Refresh conversations and messages for active conversation
      if (activeStudentId.value) {
        const res = await tutorStudentMessageService.getMessages(activeStudentId.value)
        // Merge any new messages
        for (const msg of res.data) {
          const exists = messages.value.some((m) => m.id === msg.id)
          if (!exists) {
            messages.value = [...messages.value, msg]
          }
        }
        updateLastPollTime(new Date().toISOString())
      }

      // Refresh conversations in background
      fetchConversations()
      return true
    } catch {
      return false
    }
  }

  /**
   * Start polling for real-time updates.
   */
  function startPolling(intervalMs = 5000): void {
    stopPolling()
    if (!lastPollTime.value) {
      lastPollTime.value = new Date().toISOString()
    }
    pollIntervalId = setInterval(() => {
      pollForUpdates()
    }, intervalMs)
  }

  /**
   * Stop polling.
   */
  function stopPolling(): void {
    if (pollIntervalId !== null) {
      clearInterval(pollIntervalId)
      pollIntervalId = null
    }
  }

  function clearMessages(): void {
    messages.value = []
    activeStudentId.value = null
  }

  function reset(): void {
    stopPolling()
    conversations.value = []
    messages.value = []
    activeStudentId.value = null
    loadingConversations.value = false
    loadingMessages.value = false
    sendingMessage.value = false
    error.value = null
    lastPollTime.value = null
  }

  return {
    conversations,
    messages,
    activeStudentId,
    activeConversation,
    loadingConversations,
    loadingMessages,
    sendingMessage,
    error,
    totalUnreadCount,
    lastPollTime,
    fetchConversations,
    fetchMessages,
    sendMessage,
    pollForUpdates,
    startPolling,
    stopPolling,
    clearMessages,
    reset,
  }
})
