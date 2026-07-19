<template>
  <div class="p-6 space-y-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Worklog Review</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Provide feedback and mark the work as reviewed.</p>
      </div>

      <router-link
        to="/tutor/worklogs"
        class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Back
      </router-link>
    </div>

    <div v-if="store.loading" class="flex items-center justify-center py-16">
      <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <div v-else-if="store.error" class="flex flex-col items-center justify-center py-16 text-center">
      <p class="text-sm font-semibold text-red-500">{{ store.error }}</p>
    </div>

    <div v-else-if="!store.tutorWorklog" class="flex flex-col items-center justify-center py-16 text-center">
      <p class="text-sm font-semibold text-slate-500">Worklog not found.</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Worklog Details -->
      <section class="rounded-2xl border border-slate-100 bg-white shadow-sm p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-bold text-slate-900">Student</h2>
        <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <p class="text-xs font-semibold text-slate-500">Name</p>
            <p class="text-sm font-bold text-slate-900">{{ store.tutorWorklog.student?.name || '—' }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-500">Company</p>
            <p class="text-sm font-bold text-slate-900">{{ (store.tutorWorklog.student as any)?.company_name || '—' }}</p>

          </div>
          <div>
            <p class="text-xs font-semibold text-slate-500">Position</p>
            <p class="text-sm font-bold text-slate-900">{{ store.tutorWorklog.student?.position || '—' }}</p>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-100 bg-white shadow-sm p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-bold text-slate-900">Worklog</h2>

        <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <p class="text-xs font-semibold text-slate-500">Week</p>
            <p class="text-sm font-bold text-slate-900">{{ store.tutorWorklog.week_number }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-500">Submission Date</p>
            <p class="text-sm font-bold text-slate-900">{{ formatDate(store.tutorWorklog.submitted_at) }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-500">Status</p>
            <div class="mt-1">
              <WorklogStatusBadge :status="store.tutorWorklog.status" />
            </div>
          </div>
        </div>

        <div class="mt-4">
          <p class="text-xs font-semibold text-slate-500">Description</p>
          <p class="mt-1 whitespace-pre-wrap text-sm text-slate-700">{{ store.tutorWorklog.description }}</p>
        </div>

        <div class="mt-4" v-if="store.tutorWorklog.challenges">
          <p class="text-xs font-semibold text-slate-500">Challenges</p>
          <p class="mt-1 whitespace-pre-wrap text-sm text-slate-700">{{ store.tutorWorklog.challenges }}</p>
        </div>

        <div class="mt-4">
          <p class="text-xs font-semibold text-slate-500">Attachments</p>
          <div class="mt-2">
            <AttachmentList :attachments="store.tutorWorklog.attachments || []" />
          </div>
        </div>
      </section>

      <!-- Tutor Review -->
      <section class="rounded-2xl border border-slate-100 bg-white shadow-sm p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-bold text-slate-900">Tutor Feedback</h2>

        <div class="mt-4 space-y-4">
          <div>
            <label class="text-sm font-semibold text-slate-700">Feedback</label>
            <textarea
              v-model="feedback"
              rows="5"
              class="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Add feedback or comments..."
            />
            <p v-if="validationError" class="mt-2 text-sm font-semibold text-red-600">{{ validationError }}</p>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p class="text-sm font-semibold text-slate-700">Status</p>
              <select
                v-model="selectedStatus"
                :disabled="selectedStatusLocked"
                class="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
              >
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
              </select>
            </div>

            <div class="flex items-end justify-start">
              <button
                type="button"
                :disabled="submitting || selectedStatusLocked || (selectedStatus === 'Reviewed' && !feedback.trim())"
                @click="saveReview"
                class="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-95 disabled:opacity-60"
              >
                Save Review
              </button>
            </div>
          </div>

          <div v-if="serverError" class="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
            {{ serverError }}
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorklogStore } from '@/stores/worklogStore'
import AttachmentList from '@/components/worklog/AttachmentList.vue'
import WorklogStatusBadge from '@/components/worklog/WorklogStatusBadge.vue'
import type { WorklogStatus } from '@/types/worklog'

const store = useWorklogStore()
const route = useRoute()
const router = useRouter()

const worklogId = computed(() => Number(route.params.id))

const feedback = ref('')
const serverError = ref('')
const validationError = ref('')
const submitting = ref(false)

const selectedStatus = ref<WorklogStatus>('Pending')

const selectedStatusLocked = computed<boolean>(() => {
  // Tutors can only move Pending → Reviewed
  return store.worklog?.status === 'Reviewed'
})


onMounted(async () => {
  const id = worklogId.value
  if (!Number.isFinite(id)) return
  await store.fetchTutorWorklog(id)

  if (store.tutorWorklog?.tutor_review?.feedback) {
    feedback.value = store.tutorWorklog.tutor_review.feedback
  }

  selectedStatus.value = store.tutorWorklog?.status || 'Pending'
})

const canSubmitReviewed = computed(() => {
  if (selectedStatus.value !== 'Reviewed') return true
  return feedback.value.trim().length > 0
})

async function saveReview() {
  if (!store.tutorWorklog) return
  serverError.value = ''
  validationError.value = ''

  // Validate
  if (selectedStatus.value === 'Reviewed' && !feedback.value.trim()) {
    validationError.value = 'Feedback is required when marking the worklog as Reviewed.'
    return
  }

  // Enforce transition
  if (store.tutorWorklog.status !== 'Pending' && selectedStatus.value !== store.tutorWorklog.status) {
    validationError.value = 'You can only change status from Pending to Reviewed.'
    return
  }

  submitting.value = true
  try {
    await store.reviewWorklog(store.tutorWorklog.id, {
      status: 'Reviewed',
      feedback: feedback.value.trim(),
    })

    router.push('/tutor/worklogs')
  } catch (e) {
    serverError.value = 'Failed to submit review.'
  } finally {
    submitting.value = false
  }
}

function formatDate(date?: string): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

