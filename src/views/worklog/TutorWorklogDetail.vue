<template>
    <div class="p-6 space-y-6">
        <div class="flex items-start justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tutor Review</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400">Review and update status.</p>
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

        <div v-else-if="!store.worklog" class="flex flex-col items-center justify-center py-16 text-center">
            <p class="text-sm font-semibold text-slate-500">Worklog not found.</p>
        </div>

        <div v-else class="space-y-6">
      <section class="rounded-2xl border border-slate-100 bg-white shadow-sm p-5 dark:border-slate-800 dark:bg-slate-900">
                <h2 class="text-sm font-bold text-slate-900">Student</h2>
                <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div>
                        <p class="text-xs font-semibold text-slate-500">Name</p>
                        <p class="text-sm font-bold text-slate-900">{{ store.worklog.student?.name || '—' }}</p>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-slate-500">Company</p>
                        <p class="text-sm font-bold text-slate-900">{{ store.worklog.student?.company_name || '—' }}</p>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-slate-500">Position</p>
                        <p class="text-sm font-bold text-slate-900">{{ store.worklog.student?.position || '—' }}</p>
                    </div>
                </div>
            </section>

      <section class="rounded-2xl border border-slate-100 bg-white shadow-sm p-5 dark:border-slate-800 dark:bg-slate-900">
                <h2 class="text-sm font-bold text-slate-900">Worklog</h2>
                <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div>
                        <p class="text-xs font-semibold text-slate-500">Week</p>
                        <p class="text-sm font-bold text-slate-900">{{ store.worklog.week_number }}</p>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-slate-500">Submitted</p>
                        <p class="text-sm font-bold text-slate-900">{{ formatDate(store.worklog.submitted_at) }}</p>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-slate-500">Current Status</p>
                        <div class="mt-1">
                            <WorklogStatusBadge :status="store.worklog.status" />
                        </div>
                    </div>
                </div>

                <div class="mt-4">
                    <p class="text-xs font-semibold text-slate-500">Description</p>
                    <p class="mt-1 whitespace-pre-wrap text-sm text-slate-700">{{ store.worklog.description }}</p>
                </div>

                <div class="mt-4" v-if="store.worklog.challenges">
                    <p class="text-xs font-semibold text-slate-500">Challenges</p>
                    <p class="mt-1 whitespace-pre-wrap text-sm text-slate-700">{{ store.worklog.challenges }}</p>
                </div>

                <div class="mt-4">
                    <p class="text-xs font-semibold text-slate-500">Attachments</p>
                    <div class="mt-2">
                        <AttachmentList :attachments="store.worklog.attachments || []" />
                    </div>
                </div>
            </section>

      <section class="rounded-2xl border border-slate-100 bg-white shadow-sm p-5 dark:border-slate-800 dark:bg-slate-900">
                <h2 class="text-sm font-bold text-slate-900">Tutor Review</h2>

                <div class="mt-4 space-y-4">
                    <div>
                        <label class="text-sm font-semibold text-slate-700">Feedback</label>
            <textarea
              v-model="feedback"
              rows="5"
                            class="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Good progress. Continue improving documentation."
            />
                    </div>

                    <div class="grid grid-cols-1 gap-2 sm:grid-cols-4">
            <button
              type="button"
              :disabled="submitting"
              @click="setStatus('Reviewed')"
              class="rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-60"
            >
                            Mark Reviewed
                        </button>
            <button
              type="button"
              :disabled="submitting"
              @click="setStatus('Approved')"
              class="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
            >
                            Approve
                        </button>
            <button
              type="button"
              :disabled="submitting"
              @click="setStatus('Rejected')"
              class="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
            >
                            Reject
                        </button>
            <button
              type="button"
              :disabled="submitting"
              @click="setStatus('Pending')"
              class="rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
            >
                            Pending
                        </button>
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
import WorklogStatusBadge from '@/components/worklog/WorklogStatusBadge.vue'
import AttachmentList from '@/components/worklog/AttachmentList.vue'
import type { WorklogStatus } from '@/types/worklog'

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
    await store.fetchWorklog(id)
    if (store.worklog?.tutor_review?.feedback) {
        feedback.value = store.worklog.tutor_review.feedback
    }
})

function formatDate(date?: string): string {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function setStatus(status: WorklogStatus) {
    if (!store.worklog) return
    submitting.value = true
    serverError.value = ''
    try {
        await store.updateWorklog(store.worklog.id, undefined as any, {
            tutor_feedback: feedback.value,
            tutor_status: status,
        } as any)
        router.push('/tutor/worklogs')
    } catch (e) {
        serverError.value = 'Failed to submit review.'
    } finally {
        submitting.value = false
    }
}
</script>

