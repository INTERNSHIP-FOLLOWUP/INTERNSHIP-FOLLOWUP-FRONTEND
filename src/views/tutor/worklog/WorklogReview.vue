<template>
  <div class="space-y-6 p-4 sm:p-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Tutor Worklog Review</h1>
        <p class="mt-1 text-sm text-slate-500">Review the full submission and update the student status.</p>
      </div>
      <router-link to="/tutor/worklogs" class="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
        Back to worklogs
      </router-link>
    </div>

    <div v-if="store.loading" class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="h-4 w-24 animate-pulse rounded bg-slate-200"></div>
      <div class="mt-4 h-8 w-40 animate-pulse rounded bg-slate-100"></div>
      <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div class="h-24 animate-pulse rounded-2xl bg-slate-100"></div>
        <div class="h-24 animate-pulse rounded-2xl bg-slate-100"></div>
        <div class="h-24 animate-pulse rounded-2xl bg-slate-100"></div>
        <div class="h-24 animate-pulse rounded-2xl bg-slate-100"></div>
      </div>
    </div>

    <div v-else-if="store.error" class="flex flex-col items-center justify-center rounded-3xl border border-rose-200 bg-rose-50 px-6 py-16 text-center">
      <p class="text-sm font-semibold text-rose-700">{{ store.error }}</p>
      <button type="button" class="mt-5 rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700" @click="loadCurrentWorklog">
        Try again
      </button>
    </div>

    <div v-else-if="!worklog" class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <p class="text-sm font-semibold text-slate-500">Worklog not found.</p>
    </div>

    <div v-else class="space-y-6">
      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Week {{ worklog.week_number }}</p>
            <h2 class="mt-3 text-2xl font-semibold text-slate-900">{{ worklog.description || 'Weekly worklog submission' }}</h2>
            <p class="mt-2 text-sm leading-6 text-slate-600">Submitted by {{ studentName }} on {{ formatDate(worklog.submitted_at) }}</p>
          </div>
          <WorklogStatusBadge :status="worklog.status" />
        </div>

        <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Student</p>
            <p class="mt-2 text-sm font-semibold text-slate-900">{{ studentName }}</p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Student ID</p>
            <p class="mt-2 text-sm font-semibold text-slate-900">{{ studentCode }}</p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Submitted</p>
            <p class="mt-2 text-sm font-semibold text-slate-900">{{ formatDate(worklog.submitted_at) }}</p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Attachments</p>
            <p class="mt-2 text-sm font-semibold text-slate-900">{{ (worklog.attachments || []).length }}</p>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-semibold text-slate-900">Description</h3>
        <p class="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">{{ worklog.description || 'No description provided.' }}</p>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" v-if="worklog.challenges">
        <h3 class="text-lg font-semibold text-slate-900">Challenges</h3>
        <p class="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">{{ worklog.challenges }}</p>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h3 class="text-lg font-semibold text-slate-900">Attachments</h3>
            <p class="mt-2 text-sm text-slate-500">Download or preview submitted files.</p>
          </div>
          <button type="button" class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" @click="downloadAttachments" :disabled="!(worklog.attachments?.length)">
            Download all
          </button>
        </div>
        <div class="mt-5">
          <AttachmentList :attachments="worklog.attachments || []" />
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 class="text-lg font-semibold text-slate-900">Tutor Review</h3>
            <p class="mt-2 text-sm text-slate-500">Leave feedback and set the final tutor decision.</p>
          </div>
          <WorklogStatusBadge :status="status" />
        </div>

        <div class="mt-6 grid gap-4 lg:grid-cols-[1.5fr_0.5fr]">
          <div>
            <label class="block text-sm font-semibold text-slate-700">Feedback</label>
            <textarea v-model="feedback" rows="6" class="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" placeholder="Provide constructive feedback for the student..."></textarea>
          </div>

          <div class="space-y-4">
            <label class="block text-sm font-semibold text-slate-700">Status</label>
            <select v-model="status" class="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-400">
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Approved">Approved</option>
              <option value="Needs Revision">Needs Revision</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div class="mt-4 flex flex-wrap gap-3">
              <button type="button" class="inline-flex items-center justify-center rounded-3xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60" :disabled="submitting" @click="saveReview">
                Save review
              </button>
              <button type="button" class="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" @click="router.push('/tutor/worklogs')">
                Close
              </button>
            </div>
            <p v-if="serverError" class="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{{ serverError }}</p>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm" v-if="worklog.tutor_review">
        <h3 class="text-lg font-semibold text-slate-900">Last Review</h3>
        <div class="mt-4 rounded-3xl bg-white p-5 shadow-sm">
          <p class="text-sm leading-6 text-slate-700">{{ worklog.tutor_review?.feedback || 'No previous feedback recorded.' }}</p>
          <div class="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span class="rounded-full bg-slate-100 px-3 py-1">Status: {{ worklog.tutor_review?.status || 'Pending' }}</span>
            <span>Reviewed on {{ formatDate(worklog.tutor_review?.reviewed_at) }}</span>
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
import type { Worklog, WorklogStatus } from '@/types/worklog'

const route = useRoute()
const router = useRouter()
const store = useWorklogStore()

const feedback = ref('')
const status = ref<WorklogStatus>('Pending')
const serverError = ref('')
const submitting = ref(false)

const worklogId = computed(() => Number(route.params.id))
const worklog = computed(() => store.tutorWorklog)

const studentName = computed(() => worklog.value?.student?.name || '—')
const studentCode = computed(() => String((worklog.value?.student as any)?.student_code || '—'))

async function loadCurrentWorklog() {
  const id = worklogId.value
  if (!Number.isFinite(id) || id <= 0) return
  try {
    await store.fetchTutorWorklog(id)
    if (store.tutorWorklog) {
      feedback.value = store.tutorWorklog.tutor_review?.feedback || ''
      status.value = store.tutorWorklog.tutor_review?.status || store.tutorWorklog.status || 'Pending'
    }
  } catch {
    // store.error will surface in the UI
  }
}

onMounted(loadCurrentWorklog)

function formatDate(date?: string): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function saveReview() {
  if (!worklog.value) return
  serverError.value = ''
  submitting.value = true
  try {
    await store.reviewWorklog(worklog.value.id, {
      status: status.value,
      feedback: feedback.value.trim(),
    })
    router.push('/tutor/worklogs')
  } catch {
    serverError.value = 'Failed to save review.'
  } finally {
    submitting.value = false
  }
}

function downloadAttachments() {
  const attachments = worklog.value?.attachments || []
  attachments.forEach((attachment) => {
    if (attachment.url) window.open(attachment.url, '_blank', 'noopener,noreferrer')
  })
}
</script>
