<template>
  <div class="space-y-6 p-4 sm:p-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Worklog Detail</h1>
        <p class="mt-1 text-sm text-slate-500">Review the full submission and its latest feedback.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <router-link v-if="worklog && isEditable(worklog)" :to="`/student/worklogs/${worklog.id}/edit`" class="rounded-2xl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100">
          Edit
        </router-link>
        <router-link to="/student/worklogs" class="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          Back
        </router-link>
      </div>
    </div>

    <div v-if="store.loading" class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="h-4 w-24 animate-pulse rounded bg-slate-200"></div>
      <div class="mt-4 h-8 w-40 animate-pulse rounded bg-slate-100"></div>
      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <div class="h-32 animate-pulse rounded-2xl bg-slate-100"></div>
        <div class="h-32 animate-pulse rounded-2xl bg-slate-100"></div>
      </div>
    </div>

    <div v-else-if="store.error" class="flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50 px-6 py-16 text-center">
      <p class="text-sm font-semibold text-red-700">{{ store.error }}</p>
    </div>

    <div v-else-if="!worklog" class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <p class="text-sm font-semibold text-slate-500">Worklog not found.</p>
    </div>

    <div v-else class="space-y-6">
      <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Week {{ worklog.week_number }}</p>
            <h2 class="mt-2 text-xl font-semibold text-slate-900">{{ worklog.description }}</h2>
          </div>
          <WorklogStatusBadge :status="worklog.status" />
        </div>

        <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-2xl bg-slate-50 p-3">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Submission Date</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">{{ formatDate(worklog.submitted_at) }}</p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-3">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Last Updated</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">{{ formatDate(worklog.updated_at || worklog.submitted_at) }}</p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-3">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Created By</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">{{ studentName }}</p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-3">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Attachments</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">{{ (worklog.attachments || []).length }}</p>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 class="text-lg font-semibold text-slate-900">Description</h3>
        <p class="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{{ worklog.description || 'No description provided.' }}</p>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 class="text-lg font-semibold text-slate-900">Challenges</h3>
        <p class="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{{ worklog.challenges || 'No challenges recorded.' }}</p>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-lg font-semibold text-slate-900">Attachments</h3>
          <button v-if="(worklog.attachments || []).length" type="button" class="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700" @click="downloadAttachments">
            Download Attachments
          </button>
        </div>
        <div class="mt-4">
          <AttachmentList v-if="(worklog.attachments || []).length" :attachments="worklog.attachments || []" />
          <div v-else class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center">
            <p class="text-sm font-semibold text-slate-500">No attachments uploaded.</p>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 class="text-lg font-semibold text-slate-900">Review Activity</h3>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Reviewer</p>
            <p class="mt-2 text-sm font-semibold text-slate-900">{{ reviewName }}</p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Review Date</p>
            <p class="mt-2 text-sm font-semibold text-slate-900">{{ reviewDate }}</p>
          </div>
        </div>
        <div class="mt-4 rounded-2xl bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Review Status</p>
          <div class="mt-2">
            <WorklogStatusBadge v-if="worklog.tutor_review?.status" :status="worklog.tutor_review.status" />
            <p v-else class="text-sm font-semibold text-slate-500">No review yet.</p>
          </div>
          <p v-if="worklog.tutor_review?.feedback" class="mt-3 text-sm leading-6 text-slate-700">{{ worklog.tutor_review.feedback }}</p>
          <p v-else class="mt-3 text-sm text-slate-500">Feedback will appear here after your tutor reviews the submission.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useWorklogStore } from '@/stores/worklogStore'
import WorklogStatusBadge from '@/components/worklog/WorklogStatusBadge.vue'
import AttachmentList from '@/components/worklog/AttachmentList.vue'
import type { Worklog } from '@/types/worklog'

const route = useRoute()
const store = useWorklogStore()

const worklogId = computed(() => Number(route.params.id))
const worklog = computed(() => store.worklog)

const studentName = computed(() => {
  const student = worklog.value?.student as Record<string, unknown> | undefined
  return (student?.name as string | undefined) || '—'
})

const reviewName = computed(() => worklog.value?.tutor_review?.tutor_name || 'Awaiting review')
const reviewDate = computed(() => formatDate(worklog.value?.tutor_review?.reviewed_at))

onMounted(async () => {
  const id = worklogId.value
  if (Number.isFinite(id)) {
    await store.fetchWorklog(id)
  }
})

function formatDate(date?: string): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function isEditable(w: Worklog): boolean {
  if (typeof (w as Worklog & { can_edit?: boolean }).can_edit === 'boolean') return (w as Worklog & { can_edit?: boolean }).can_edit!
  return w.status === 'Pending' || w.status === 'Reviewed'
}

function downloadAttachments() {
  const attachments = worklog.value?.attachments || []
  attachments.forEach((attachment) => {
    if (attachment.url) window.open(attachment.url, '_blank', 'noopener,noreferrer')
  })
}
</script>

