import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove']

/**
 * useActivityTracker
 *
 * Tracks user activity to detect session timeouts.
 * Call once in App.vue or the root layout.
 */
export function useActivityTracker() {
  const store = useAuthStore()

  let checkInterval: ReturnType<typeof setInterval> | null = null

  function handleActivity() {
    store.updateActivity()
  }

  function startTracking() {
    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, handleActivity, { passive: true })
    }

    // Check for session timeout every 30 seconds
    checkInterval = setInterval(() => {
      if (store.isLoggedIn && store.checkSessionTimeout()) {
        store.forceLogout()
      }
    }, 30_000)
  }

  function stopTracking() {
    for (const event of ACTIVITY_EVENTS) {
      window.removeEventListener(event, handleActivity)
    }
    if (checkInterval) {
      clearInterval(checkInterval)
      checkInterval = null
    }
  }

  onMounted(() => startTracking())
  onUnmounted(() => stopTracking())
}
