<template>
  <!-- ─── FORCED: Inactive tutor must change password to access dashboard ─── -->
  <div v-if="auth.user?.status === 'inactive'" class="flex items-center justify-center min-h-[70vh]">
    <div class="w-full max-w-lg animate-fade-in">
      <div class="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
        <div class="h-2 bg-gradient-to-r from-indigo-400 to-purple-500"></div>

        <div class="p-8 text-center">
          <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 ring-8 ring-indigo-50/50">
            <svg class="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          <h1 class="text-xl font-bold text-slate-900">Account Activation Required</h1>
          <p class="mt-2 text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            Your tutor account is currently inactive. You must set a new password to activate your account and access the tutor dashboard.
          </p>
        </div>

        <div class="px-8 pb-8">
          <form @submit.prevent="handlePasswordSubmit" class="space-y-5">
            <PasswordInput v-model="passwordForm.current_password" label="Current Password" placeholder="Enter current password" required :error="passwordErrors.current_password ?? ''" autocomplete="current-password" />
            <PasswordInput v-model="passwordForm.password" label="New Password" placeholder="Min. 8 characters" required :error="passwordErrors.password ?? ''" autocomplete="new-password" />
            <PasswordInput v-model="passwordForm.password_confirmation" label="Confirm New Password" placeholder="Re-enter new password" required :error="passwordErrors.password_confirmation ?? ''" autocomplete="new-password" />

            <div class="rounded-lg bg-amber-50/60 border border-amber-100 px-4 py-3">
              <div class="flex items-start gap-2">
                <svg class="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-xs text-amber-800">Password must be at least 8 characters and should include a mix of letters, numbers, and symbols for better security.</p>
              </div>
            </div>

            <ErrorAlert :message="passwordErrors._form" />

            <button type="submit" :disabled="passwordSubmitting || !isPasswordFormValid"
              class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:from-indigo-700 hover:to-indigo-600 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
              <LoadingSpinner v-if="passwordSubmitting" size="sm" color="white" />
              {{ passwordSubmitting ? 'Activating...' : 'Activate Account' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- ─── NORMAL: Active tutor dashboard ─── -->
  <template v-else>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Tutor Dashboard</h1>
          <p class="text-sm text-slate-500">
            Overview of your assigned students, reviews, and follow-ups.
          </p>
        </div>
        <button
          type="button"
          @click="refresh"
          :disabled="store.loading"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348c4.183.626 6.977 3.26 6.977 7.053A7.5 7.5 0 119.75 1.5c4.232 0 7.273 2.527 7.273 5.848z" />
          </svg>
          Refresh
        </button>
      </div>

      <!-- Stats -->
      <div v-if="!store.loading && !store.error" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Assigned Students" :value="store.stats?.assigned_students ?? 0" colorClass="bg-indigo-500" description="Total students assigned to you" href="/tutor/students" />
        <StatCard label="Pending Reviews" :value="store.stats?.pending_reviews ?? 0" :colorClass="pendingColor" description="Worklogs awaiting your feedback" :urgent="(store.stats?.pending_reviews ?? 0) > 0" href="/tutor/worklogs" />
        <StatCard label="Follow-ups Due" :value="store.stats?.followups_due ?? 0" colorClass="bg-emerald-500" description="Scheduled in next 7–14 days" href="/tutor/followups" />
        <StatCard label="Open Issues" :value="store.stats?.open_issues ?? 0" :colorClass="issuesColor" description="Unresolved issues" :urgent="(store.stats?.open_issues ?? 0) > 0" href="/tutor/issues" />
        <StatCard label="Inactive Students" :value="store.stats?.inactive_students ?? 0" colorClass="bg-amber-500" description="No worklog in 2+ weeks" :urgent="(store.stats?.inactive_students ?? 0) > 0" href="/tutor/students" />
      </div>

      <!-- Panels -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel title="Recent Worklogs" :loading="store.loading" :error="store.error" :emptyCheck="store.recentWorklogs" empty-title="No recent worklogs" empty-message="Once your students submit worklogs, they will appear here.">
          <template #default>
            <div class="divide-y divide-slate-100">
              <div v-for="w in store.recentWorklogs" :key="w.id" class="flex items-start gap-3 py-3 last:pb-0">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">{{ initials(w.student?.name) }}</div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between gap-2">
                    <p class="truncate text-sm font-semibold text-slate-900">{{ w.student?.name ?? '' }}</p>
                    <span class="text-xs text-slate-400">Week {{ w.week_number }}</span>
                  </div>
                  <p class="mt-0.5 truncate text-xs text-slate-500">{{ w.description }}</p>
                  <div class="mt-1 flex items-center gap-2">
                    <span class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-700">{{ w.status }}</span>
                    <span class="text-xs text-slate-400">{{ formatDate(w.submission_date || w.submitted_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Panel>

        <Panel title="Upcoming Follow-ups" :loading="store.loading" :error="store.error" :emptyCheck="store.upcomingFollowups" empty-title="No upcoming follow-ups" empty-message="Schedule follow-ups with your students to stay aligned.">
          <template #default>
            <div class="divide-y divide-slate-100">
              <div v-for="f in store.upcomingFollowups" :key="f.id" class="flex items-start gap-3 py-3 last:pb-0">
                <div class="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <span class="text-[11px] font-bold leading-none">{{ monthLabel(f.date_label) }}</span>
                  <span class="text-md font-bold leading-tight">{{ dayLabel(f.date_label) }}</span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-slate-900">{{ f.student?.name ?? '' }}</p>
                  <p class="text-xs text-slate-500">{{ f.type }} · {{ f.time_label }}</p>
                  <span class="mt-1 inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">{{ f.relative }}</span>
                </div>
              </div>
            </div>
          </template>
        </Panel>

        <Panel title="Open Issues" :loading="store.loading" :error="store.error" :emptyCheck="store.openIssues" empty-title="No open issues" empty-message="When issues are opened, they will show up here.">
          <template #default>
            <div class="divide-y divide-slate-100">
              <div v-for="issue in store.openIssues" :key="issue.id" class="flex items-start justify-between gap-3 py-3 last:pb-0">
                <div>
                  <p class="text-sm font-semibold text-slate-900">{{ issue.title }}</p>
                  <p class="text-xs text-slate-500">{{ issue.student?.name ?? '' }}</p>
                </div>
                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold" :class="priorityColor(issue.priority)">{{ issue.priority }}</span>
              </div>
            </div>
          </template>
        </Panel>

        <Panel title="Recent Activity" :loading="store.loading" :error="store.error" :emptyCheck="store.recentActivity" empty-title="No recent activity" empty-message="Actions like submissions, issues, and follow-ups will appear here.">
          <template #default>
            <div class="divide-y divide-slate-100">
              <div v-for="item in store.recentActivity" :key="(item.reference_id ?? 'no-ref') + '-' + (item.type ?? 'no-type') + '-' + item.message" class="flex items-start gap-3 py-3 last:pb-0">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <svg v-if="item.icon === 'worklog'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M5.625 3.75h13.5c1.036 0 1.875.84 1.875 1.875v13.5c0 1.036-.84 1.875-1.875 1.875h-13.5A1.875 1.875 0 013.75 19.125V5.625c0-1.036.84-1.875 1.875-1.875z" />
                  </svg>
                  <svg v-else-if="item.icon === 'issue'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm text-slate-700">{{ item.message }}</p>
                  <p class="text-xs text-slate-400">{{ relativeTimestamp(item.timestamp) }}</p>
                </div>
              </div>
            </div>
          </template>
        </Panel>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/auth'
import { useToastStore } from '@/stores/toast'
import StatCard from '@/components/dashboard/StatCard.vue'
import Panel from '@/components/dashboard/Panel.vue'
import PasswordInput from '@/components/ui/PasswordInput.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import { useTutorDashboardStore } from '@/stores/tutorDashboard'
import { parseApiError } from '@/utils/errorParser'
import { mapValidationErrors } from '@/utils/mapValidationErrors'

const auth = useAuthStore()
const toast = useToastStore()
const store = useTutorDashboardStore()

const pendingColor = computed(() =>
  store.stats?.pending_reviews && store.stats.pending_reviews > 0 ? 'bg-rose-500' : 'bg-amber-500',
)
const issuesColor = computed(() =>
  store.stats?.open_issues && store.stats.open_issues > 0 ? 'bg-rose-500' : 'bg-indigo-500',
)

onMounted(() => {
  store.fetchDashboard()
})

function refresh() {
  store.fetchDashboard()
}

function formatDate(date?: string) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function initials(name?: string) {
  if (!name || typeof name !== 'string') return ''
  return name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

function monthLabel(label?: string) {
  if (!label) return ''
  return new Date(label).toLocaleString('en-US', { month: 'short' })
}

function dayLabel(label?: string) {
  if (!label) return ''
  return new Date(label).getDate().toString()
}

function priorityColor(priority?: string) {
  switch (priority) {
    case 'Critical':
      return 'bg-rose-50 text-rose-700'
    case 'High':
      return 'bg-orange-50 text-orange-700'
    case 'Medium':
      return 'bg-indigo-50 text-indigo-700'
    case 'Low':
      return 'bg-slate-100 text-slate-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function relativeTimestamp(iso?: string) {
  if (!iso) return ''
  const timestamp = new Date(iso).getTime()
  if (Number.isNaN(timestamp)) return ''
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return seconds <= 0 ? 'just now' : `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── Password Change ──
const passwordSubmitting = ref(false)
const passwordForm = reactive({
  current_password: '',
  password: '',
  password_confirmation: '',
})
const passwordErrors = reactive<Record<string, string>>({})

const isPasswordFormValid = computed(() => {
  return (
    passwordForm.current_password.length > 0 &&
    passwordForm.password.length >= 8 &&
    passwordForm.password_confirmation.length > 0 &&
    passwordForm.password === passwordForm.password_confirmation
  )
})

function clearPasswordErrors(): void {
  for (const key of Object.keys(passwordErrors)) {
    delete passwordErrors[key]
  }
}

function validatePasswordForm(): boolean {
  let valid = true
  clearPasswordErrors()
  if (!passwordForm.current_password) {
    passwordErrors.current_password = 'Current password is required.'
    valid = false
  }
  if (!passwordForm.password) {
    passwordErrors.password = 'New password is required.'
    valid = false
  } else if (passwordForm.password.length < 8) {
    passwordErrors.password = 'Password must be at least 8 characters.'
    valid = false
  }
  if (!passwordForm.password_confirmation) {
    passwordErrors.password_confirmation = 'Please confirm your new password.'
    valid = false
  } else if (passwordForm.password !== passwordForm.password_confirmation) {
    passwordErrors.password_confirmation = 'Passwords do not match.'
    valid = false
  }
  return valid
}

async function handlePasswordSubmit(): Promise<void> {
  if (!validatePasswordForm()) return
  passwordSubmitting.value = true
  try {
    await authService.changePassword({
      current_password: passwordForm.current_password,
      password: passwordForm.password,
      password_confirmation: passwordForm.password_confirmation,
    })
    toast.success('Your password has been updated successfully.', 'Password Changed')
    await auth.refreshUser()
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: { status?: number; data?: { errors?: Record<string, string[]>; message?: string } }
    }
    if (axiosErr.response?.status === 422 && axiosErr.response.data?.errors) {
      const mapped = mapValidationErrors(axiosErr.response.data.errors)
      for (const [key, msg] of Object.entries(mapped)) {
        (passwordErrors as Record<string, string>)[key] = msg
      }
    } else {
      const parsed = parseApiError(err)
      passwordErrors._form = parsed.message
    }
  } finally {
    passwordSubmitting.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

