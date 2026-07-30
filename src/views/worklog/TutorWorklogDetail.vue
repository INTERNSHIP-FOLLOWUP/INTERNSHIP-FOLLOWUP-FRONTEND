<template>
  <div class="space-y-6 p-6">
    <!-- Back Button & Breadcrumb -->
    <div class="flex items-center gap-3 text-sm">
      <router-link
        to="/tutor/worklogs"
        class="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-slate-600 transition-colors hover:text-slate-900 dark:bg-slate-700 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Worklogs
      </router-link>
      <span class="text-slate-300 dark:text-slate-500">/</span>
      <span class="font-medium text-slate-900 dark:text-slate-100">
        {{ store.tutorWorklog?.student?.name || 'Worklog Review' }}
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="store.loading" class="flex items-center justify-center py-20">
      <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <!-- Error State -->
    <div v-else-if="store.error" class="flex flex-col items-center justify-center py-20 text-center">
      <svg class="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <p class="mt-4 text-base font-semibold text-red-500">{{ store.error }}</p>
    </div>

    <!-- Not Found -->
    <div v-else-if="!store.tutorWorklog" class="flex flex-col items-center justify-center py-20 text-center">
      <p class="text-sm font-semibold text-slate-500">Worklog not found.</p>
    </div>

    <!-- Worklog Review Card -->
    <div
      v-else
      class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
    >
      <!-- Hero Header with Student Avatar -->
      <div class="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-sky-400 px-8 py-10">
        <div class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div class="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

        <div class="relative flex flex-col items-center gap-5 sm:flex-row sm:items-end">
          <div class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white/50 bg-white shadow-xl dark:bg-slate-800">
            <img
              v-if="!photoFailed && getStudentPhotoUrl(store.tutorWorklog.student)"
              :src="getStudentPhotoUrl(store.tutorWorklog.student) || undefined"
              alt="Student photo"
              class="h-full w-full object-cover"
              @error="photoFailed = true"
            />
            <span v-else class="text-3xl font-bold text-indigo-600">
              {{ getInitials(store.tutorWorklog.student?.name) }}
            </span>
          </div>
          <div class="text-center sm:text-left">
            <p class="text-xs font-semibold uppercase tracking-wider text-white/80">Worklog Review</p>
            <h1 class="text-2xl font-bold text-white drop-shadow-sm">
              {{ store.tutorWorklog.student?.name || 'Student' }}
            </h1>
            <div class="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span class="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                {{ store.tutorWorklog.work_date ? formatDate(store.tutorWorklog.work_date) : 'No date' }}
              </span>
              <span
                v-if="studentMeta(store.tutorWorklog.student).company_name"
                class="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
              >
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {{ studentMeta(store.tutorWorklog.student).company_name }}
              </span>
              <WorklogStatusBadge :status="store.tutorWorklog.status" />
            </div>
          </div>
        </div>
      </div>

      <!-- Content Body -->
      <div class="px-8 py-8">
        <!-- Section: Student & Internship -->
        <div class="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          <div class="space-y-5">
            <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span class="h-1 w-1 rounded-full bg-indigo-500"></span>
              Student Details
            </h3>
            <div class="flex items-start gap-3">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-medium text-slate-400 dark:text-slate-500">Email</p>
                <p class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{{ store.tutorWorklog.student?.email || '—' }}</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-medium text-slate-400 dark:text-slate-500">Phone</p>
                <p class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{{ store.tutorWorklog.student?.phone || '—' }}</p>
              </div>
            </div>
          </div>
          <div class="space-y-5">
            <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span class="h-1 w-1 rounded-full bg-sky-400"></span>
              Internship
            </h3>
            <div class="flex items-start gap-3">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-medium text-slate-400 dark:text-slate-500">Company</p>
                <p class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{{ studentMeta(store.tutorWorklog.student).company_name || '—' }}</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.893 23.893 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-medium text-slate-400 dark:text-slate-500">Position</p>
                <p class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{{ studentMeta(store.tutorWorklog.student).position || '—' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="my-8 border-t border-slate-100 dark:border-slate-700" />

        <!-- Section: Worklog Information -->
        <div class="space-y-5">
          <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <span class="h-1 w-1 rounded-full bg-blue-500"></span>
            Worklog Information
          </h3>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="rounded-xl bg-slate-50/60 p-4 dark:bg-slate-700">
              <p class="text-xs font-medium text-slate-400 dark:text-slate-500">Work Date</p>
              <p class="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                {{ store.tutorWorklog.work_date ? formatDate(store.tutorWorklog.work_date) : '—' }}
              </p>
            </div>
            <div class="rounded-xl bg-slate-50/60 p-4 dark:bg-slate-700">
              <p class="text-xs font-medium text-slate-400 dark:text-slate-500">Working Time</p>
              <p class="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{{ formatTimeRange(store.tutorWorklog.work_time) }}</p>
            </div>
            <div class="rounded-xl bg-slate-50/60 p-4 dark:bg-slate-700">
              <p class="text-xs font-medium text-slate-400 dark:text-slate-500">Submitted</p>
              <p class="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                {{ formatDate(store.tutorWorklog.submitted_at || store.tutorWorklog.created_at) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="my-8 border-t border-slate-100 dark:border-slate-700" />

        <!-- Section: Daily Report -->
        <div class="space-y-6">
          <div v-if="store.tutorWorklog.work_activities" class="space-y-3">
            <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span class="h-1 w-1 rounded-full bg-blue-400"></span>
              Work Activities
            </h3>
            <div class="rounded-xl border border-blue-100 bg-blue-50/40 p-4 dark:border-slate-700 dark:bg-slate-700/50">
              <p class="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{{ store.tutorWorklog.work_activities }}</p>
            </div>
          </div>

          <div v-if="store.tutorWorklog.what_learned" class="space-y-3">
            <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span class="h-1 w-1 rounded-full bg-emerald-400"></span>
              What Did You Learn?
            </h3>
            <div class="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 dark:border-slate-700 dark:bg-slate-700/50">
              <p class="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{{ store.tutorWorklog.what_learned }}</p>
            </div>
          </div>

          <div
            v-if="store.tutorWorklog.difficulties || store.tutorWorklog.solutions"
            class="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <div v-if="store.tutorWorklog.difficulties" class="space-y-3">
              <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span class="h-1 w-1 rounded-full bg-amber-400"></span>
                Difficulties / Issues
              </h3>
              <div class="rounded-xl border border-amber-100 bg-amber-50/40 p-4 dark:border-slate-700 dark:bg-slate-700/50">
                <p class="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{{ store.tutorWorklog.difficulties }}</p>
              </div>
            </div>
            <div v-if="store.tutorWorklog.solutions" class="space-y-3">
              <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span class="h-1 w-1 rounded-full bg-teal-400"></span>
                Solutions
              </h3>
              <div class="rounded-xl border border-teal-100 bg-teal-50/40 p-4 dark:border-slate-700 dark:bg-slate-700/50">
                <p class="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{{ store.tutorWorklog.solutions }}</p>
              </div>
            </div>
          </div>

          <div v-if="store.tutorWorklog.to_do" class="space-y-3">
            <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span class="h-1 w-1 rounded-full bg-purple-400"></span>
              To Do
            </h3>
            <div class="rounded-xl border border-purple-100 bg-purple-50/40 p-4 dark:border-slate-700 dark:bg-slate-700/50">
              <p class="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{{ store.tutorWorklog.to_do }}</p>
            </div>
          </div>

          <div v-if="store.tutorWorklog.comment" class="space-y-3">
            <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span class="h-1 w-1 rounded-full bg-slate-400"></span>
              Comment
            </h3>
            <div class="rounded-xl border border-slate-100 bg-slate-50/40 p-4 dark:border-slate-700 dark:bg-slate-700/50">
              <p class="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{{ store.tutorWorklog.comment }}</p>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="my-8 border-t border-slate-100 dark:border-slate-700" />

        <!-- Section: Attachments -->
        <div class="space-y-5">
          <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <span class="h-1 w-1 rounded-full bg-violet-400"></span>
            Attachments ({{ (store.tutorWorklog.attachments || []).length }})
          </h3>
          <div
            v-if="(store.tutorWorklog.attachments || []).length"
            class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-700/50"
          >
            <AttachmentList :attachments="store.tutorWorklog.attachments || []" />
          </div>
          <div
            v-else
            class="rounded-xl border border-dashed border-slate-200 py-6 text-center text-sm text-slate-400 dark:border-slate-600 dark:text-slate-500"
          >
            No attachments provided.
          </div>
        </div>

        <!-- Divider -->
        <div class="my-8 border-t border-slate-100 dark:border-slate-700" />

        <!-- Section: Tutor Feedback -->
        <div class="space-y-5">
          <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <span class="h-1 w-1 rounded-full bg-indigo-500"></span>
            Tutor Feedback
          </h3>
          <textarea
            v-model="feedback"
            rows="5"
            class="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition-colors focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-500"
            placeholder="Good progress. Continue improving documentation."
          />
        </div>
      </div>

      <!-- Action Footer -->
      <div class="border-t border-slate-100 bg-slate-50/60 px-8 py-5 dark:border-slate-700 dark:bg-slate-700">
        <p v-if="serverError" class="mb-3 text-sm font-semibold text-red-500">{{ serverError }}</p>
        <div class="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div class="flex items-center gap-2">
            <span class="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
            <span class="text-xs font-medium text-slate-400 dark:text-slate-400">
              Worklog #{{ store.tutorWorklog.id }} — awaiting your review
            </span>
          </div>
          <div class="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              :disabled="submitting"
              @click="submitReview('Pending')"
              class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Pending
            </button>
            <button
              type="button"
              :disabled="submitting"
              @click="submitReview('Rejected')"
              class="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>
            <button
              type="button"
              :disabled="submitting"
              @click="submitReview('Reviewed')"
              class="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Mark Reviewed
            </button>
            <button
              type="button"
              :disabled="submitting"
              @click="submitReview('Approved')"
              class="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorklogStore } from '@/stores/worklogStore'
import WorklogStatusBadge from '@/components/worklog/WorklogStatusBadge.vue'
import AttachmentList from '@/components/worklog/AttachmentList.vue'
import type { Worklog, WorklogStatus } from '@/types/worklog'

const route = useRoute()
const router = useRouter()
const store = useWorklogStore()

const worklogId = computed(() => Number(route.params.id))

const feedback = ref('')
const submitting = ref(false)
const serverError = ref('')

onMounted(async () => {
  const id = worklogId.value
  if (!Number.isFinite(id)) return
  await store.fetchTutorWorklog(id)
  if (store.tutorWorklog?.tutor_review?.feedback) {
    feedback.value = store.tutorWorklog.tutor_review.feedback
  }
})

const photoFailed = ref(false)

function getStudentPhotoUrl(student: Worklog['student']): string | null {
  const url = (student as { photo_url?: string | null } | undefined)?.photo_url
  if (!url) return null
  if (/^https?:\/\//.test(url)) return url
  const base = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/?api\/?$/, '')
  if (url.startsWith('/storage/')) return `${base}${url}`
  return `${base}/storage/${url.replace(/^\//, '')}`
}

function studentMeta(student: Worklog['student']): { company_name?: string | null; position?: string | null } {
  return (student as { company_name?: string | null; position?: string | null } | undefined) ?? {}
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatTimeRange(time?: string): string {
  if (!time) return '—'
  const parts = time.split(' to ')
  return parts.map((t) => {
    const [h, m] = t.trim().split(':')
    if (!h || !m) return t.trim()
    const hour = parseInt(h, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${m} ${ampm}`
  }).join(' to ')
}

function formatDate(date?: string): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function submitReview(status: WorklogStatus) {
  if (!store.tutorWorklog) return
  submitting.value = true
  serverError.value = ''
  try {
    await store.reviewWorklog(store.tutorWorklog.id, {
      status,
      feedback: feedback.value,
    })
    router.push('/tutor/worklogs')
  } catch {
    serverError.value = 'Failed to submit review.'
  } finally {
    submitting.value = false
  }
}
</script>
