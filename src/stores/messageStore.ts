import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { messageService } from '@/services/messageService'
import { parseApiError } from '@/utils/errorParser'
import type { MessageConversation, MessageItem } from '@/types/message'

export const useMessageStore = defineStore('message', () => {
  const conversations = ref<MessageConversation[]>([])
  const messages = ref<MessageItem[]>([])
  const activeConversationId = ref<number | null>(null)
  const loadingConversations = ref(false)
  const loadingMessages = ref(false)
  const sendingMessage = ref(false)
  const error = ref<string | null>(null)
  const lastPollTime = ref<string | null>(null)
  const echoSubscribed = ref(false)
  let pollIntervalId: ReturnType<typeof setInterval> | null = null

  const activeConversation = computed(() => {
    if (activeConversationId.value == null) return null
    return conversations.value.find(
      (c) => c.user?.id === activeConversationId.value || c.company?.id === activeConversationId.value,
    ) ?? null
  })

  const totalUnreadCount = computed(() => {
    return conversations.value.reduce((sum, c) => sum + c.unread_count, 0)
  })

  /**
   * Handle an incoming message from either WebSocket or polling.
   */
  function handleIncomingMessage(msg: MessageItem): void {
    const activeId = activeConversationId.value

    // Check if this message belongs to the active conversation
    const belongsToActive = activeId && (
      msg.tutor_id === activeId || msg.company_id === activeId
    )

    if (belongsToActive) {
      // Add to messages if not already there
      const exists = messages.value.some((m) => m.id === msg.id)
      if (!exists) {
        messages.value = [...messages.value, msg]
      }
    } else {
      // Message for another conversation — update unread count
      const conv = conversations.value.find((c) =>
        c.user?.id === msg.tutor_id || c.company?.id === msg.company_id
      )
      if (conv) {
        conv.unread_count += 1
        // Update last message preview
        if (msg.message) {
          conv.last_message = {
            id: msg.id,
            message: msg.message,
            sender_type: msg.sender_type,
            created_at: msg.created_at,
          }
        }
      }
    }
  }

  /**
   * Subscribe to Echo channels for real-time WebSocket updates.
   */
  function subscribeToEcho(): void {
    if (echoSubscribed.value) return
    if (typeof window.Echo === 'undefined') return

    const auth = useAuthStore()
    const userId = auth.user?.id
    const role = auth.userRole
    if (!userId) return

    const channelName = role === 'supervisor'
      ? `company.${userId}`
      : `tutor.${userId}`

    window.Echo.private(channelName).listen('.new-message', (data: Record<string, unknown>) => {
      const msg: MessageItem = {
        id: data.id as number,
        message: data.message as string,
        sender_type: data.sender_type as 'company' | 'tutor',
        is_read: data.is_read as boolean,
        created_at: data.created_at as string,
        company_id: data.company_id as number | undefined,
        tutor_id: data.tutor_id as number | undefined,
      }
      handleIncomingMessage(msg)
      updateLastPollTime(msg.created_at)
    })

    echoSubscribed.value = true
  }

  /**
   * Unsubscribe from Echo channels.
   */
  function unsubscribeFromEcho(): void {
    if (!echoSubscribed.value) return
    if (typeof window.Echo === 'undefined') return

    const auth = useAuthStore()
    const userId = auth.user?.id
    const role = auth.userRole
    if (!userId) return

    const channelName = role === 'supervisor'
      ? `company.${userId}`
      : `tutor.${userId}`

    try {
      window.Echo.leave(channelName)
    } catch {
      // Ignore errors on leave
    }
    echoSubscribed.value = false
  }

  function updateLastPollTime(time: string): void {
    if (time && (!lastPollTime.value || time > lastPollTime.value)) {
      lastPollTime.value = time
    }
  }

  async function fetchConversations(): Promise<void> {
    loadingConversations.value = true
    error.value = null

    try {
      const res = await messageService.getConversations()
      conversations.value = res.data
    } catch (err: unknown) {
      const parsed = parseApiError(err)
      error.value = parsed.message
    } finally {
      loadingConversations.value = false
    }
  }

  async function fetchMessages(otherPartyId: number): Promise<void> {
    loadingMessages.value = true
    error.value = null
    activeConversationId.value = otherPartyId

    try {
      const res = await messageService.getMessages(otherPartyId)
      messages.value = res.data

      // Mark conversation as read
      const conv = conversations.value.find(
        (c) => c.user?.id === otherPartyId || c.company?.id === otherPartyId,
      )
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

  async function sendMessage(otherPartyId: number, text: string): Promise<MessageItem | null> {
    sendingMessage.value = true
    error.value = null

    try {
      const res = await messageService.sendMessage(otherPartyId, { message: text })
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
   * Acts as fallback when Echo is not available.
   */
  async function pollForUpdates(): Promise<boolean> {
    if (!lastPollTime.value) {
      lastPollTime.value = new Date().toISOString()
      return false
    }

    try {
      const res = await messageService.getUpdates(
        lastPollTime.value,
        activeConversationId.value ?? undefined,
      )

      const { new_messages, server_time } = res

      if (new_messages && new_messages.length > 0) {
        for (const msg of new_messages) {
          handleIncomingMessage(msg)
        }
        // Refresh conversations list in background to update last messages
        fetchConversations()
      }

      lastPollTime.value = server_time || new Date().toISOString()
      return new_messages && new_messages.length > 0
    } catch {
      return false
    }
  }

  /**
   * Start real-time updates: Echo WebSocket + polling fallback.
   * @param intervalMs Polling interval in milliseconds (default 5000)
   */
  function startRealtime(intervalMs = 5000): void {
    subscribeToEcho()
    startPolling(intervalMs)
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
   * Stop polling for real-time updates.
   */
  function stopPolling(): void {
    if (pollIntervalId !== null) {
      clearInterval(pollIntervalId)
      pollIntervalId = null
    }
  }

  /**
   * Stop all real-time updates (Echo + polling).
   */
  function stopRealtime(): void {
    unsubscribeFromEcho()
    stopPolling()
  }

  function clearMessages(): void {
    messages.value = []
    activeConversationId.value = null
  }

  function reset(): void {
    stopRealtime()
    conversations.value = []
    messages.value = []
    activeConversationId.value = null
    loadingConversations.value = false
    loadingMessages.value = false
    sendingMessage.value = false
    error.value = null
    lastPollTime.value = null
    echoSubscribed.value = false
  }

  return {
    conversations,
    messages,
    activeConversationId,
    activeConversation,
    loadingConversations,
    loadingMessages,
    sendingMessage,
    error,
    totalUnreadCount,
    lastPollTime,
    echoSubscribed,
    fetchConversations,
    fetchMessages,
    sendMessage,
    pollForUpdates,
    startPolling,
    stopPolling,
    startRealtime,
    stopRealtime,
    subscribeToEcho,
    unsubscribeFromEcho,
    clearMessages,
    reset,
  }
})
