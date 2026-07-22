import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tutorDashboardService } from '@/services/tutorDashboard'
import { useToastStore } from '@/stores/toast'
import type { DashboardStats, DashboardData } from '@/types/tutor'

export const useTutorDashboardStore = defineStore('tutorDashboard', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<DashboardData | null>(null)

  const stats = computed<DashboardStats | null>(() => data.value?.stats ?? null)

  const recentWorklogs = computed(() => data.value?.recent_worklogs ?? [])
  const upcomingFollowups = computed(() => data.value?.upcoming_followups ?? [])
  const openIssues = computed(() => data.value?.open_issues ?? [])
  const recentActivity = computed(() => data.value?.recent_activity ?? [])

  async function fetchDashboard(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const payload = await tutorDashboardService.getDashboard()
      data.value = payload
    } catch (err: unknown) {
      const parsed = err as { message?: string }
      error.value = parsed?.message || 'Failed to load dashboard.'
      useToastStore().error(error.value, 'Dashboard')
    } finally {
      loading.value = false
    }
  }

  function reset(): void {
    loading.value = false
    error.value = null
    data.value = null
  }

  return {
    loading,
    error,
    data,
    stats,
    recentWorklogs,
    upcomingFollowups,
    openIssues,
    recentActivity,
    fetchDashboard,
    reset,
  }
})
