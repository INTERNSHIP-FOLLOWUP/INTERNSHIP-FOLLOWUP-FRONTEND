<template>
  <div class="p-6 space-y-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Worklog Detail</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">View full student submission.</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="worklog && isEditable(worklog)"
          type="button"
          class="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
          @click="confirmDelete = true"
        >
          <svg class="-ml-0.5 mr-1.5 inline-block h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
        <router-link
          :to="`/student/worklogs/${worklog?.id}/edit`"
          v-if="worklog && isEditable(worklog)"
          class="rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
        >
          Edit
        </router-link>
        <router-link
          to="/student/worklogs"
          class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Back
        </router-link>
      </div>
    </div>

    <div v-if="store.loading" class="flex items-center justify-center py-16">
      <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <div v-else-if="store.error" class="flex flex-col items-center justify-center py-16 text-center">
      <svg class="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <p class="mt-3 text-sm font-semibold text-red-500">{{ store.error }}</p>
    </div>

    <div v-else-if="!store.worklog" class="flex flex-col items-center justify-center py-16 text-center">
      <p class="text-sm font-semibold text-slate-500">Worklog not found.</p>
    </div>

    <div v-else class="space-y-6">
      <section class="rounded-2xl border border-slate-100 bg-white shadow-sm p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-bold text-slate-900">Student Information</h2>
        <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <p class="text-xs font-semibold text-slate-500">Student</p>
            <p class="text-sm font-bold text-slate-900">{{ worklog?.student?.name || '—' }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-500">Company</p>
            <p class="text-sm font-bold text-slate-900">{{ (worklog?.student as any)?.company_name || '—' }}</p>

          </div>
          <div>
            <p class="text-xs font-semibold text-slate-500">Position</p>
            <p class="text-sm font-bold text-slate-900">{{ (worklog?.student as any)?.position || (worklog?.student as any)?.internship_position || '—' }}</p>

          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-100 bg-white shadow-sm p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-bold text-slate-900">Worklog Information</h2>

        <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div>
            <p class="text-xs font-semibold text-slate-500">Week</p>
            <p class="text-sm font-bold text-slate-900">{{ worklog?.week_number }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-500">Status</p>
            <div class="mt-1">
              <WorklogStatusBadge :status="worklog!.status" />
            </div>
          </div>
          <div class="md:col-span-2">
            <p class="text-xs font-semibold text-slate-500">Submitted Date</p>
            <p class="text-sm font-bold text-slate-900">{{ formatDate(worklog?.submitted_at) }}</p>
          </div>
        </div>

        <div class="mt-4">
          <p class="text-xs font-semibold text-slate-500">Description</p>
          <p class="mt-1 whitespace-pre-wrap text-sm text-slate-700">{{ worklog?.description }}</p>
        </div>

        <div class="mt-4" v-if="worklog?.challenges">
          <p class="text-xs font-semibold text-slate-500">Challenges</p>
          <p class="mt-1 whitespace-pre-wrap text-sm text-slate-700">{{ worklog?.challenges }}</p>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-100 bg-white shadow-sm p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-bold text-slate-900">Attachments</h2>
        <div class="mt-3">
          <AttachmentList :attachments="worklog?.attachments || []" />
        </div>
      </section>

      <section class="rounded-2xl border border-slate-100 bg-white shadow-sm p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-bold text-slate-900">Tutor Review</h2>
        <div v-if="worklog?.tutor_review" class="mt-3 space-y-3">
          <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <p class="text-xs font-semibold text-slate-500">Tutor</p>
              <p class="text-sm font-bold text-slate-900">{{ worklog.tutor_review.tutor_name }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500">Review Date</p>
              <p class="text-sm font-bold text-slate-900">{{ formatDate(worklog.tutor_review.reviewed_at) }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500">Review Status</p>
              <div class="mt-1">
                <WorklogStatusBadge :status="worklog.tutor_review.status" />
              </div>
            </div>
          </div>

          <div>
            <p class="text-xs font-semibold text-slate-500">Feedback</p>
            <p class="mt-1 whitespace-pre-wrap text-sm text-slate-700">{{ worklog.tutor_review.feedback }}</p>
          </div>
        </div>

        <div v-else class="mt-3 flex flex-col items-center justify-center text-center py-10">
          <p class="text-sm font-semibold text-slate-500">No tutor feedback yet.</p>
        </div>
      </section>
    </div>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :show="confirmDelete"
      title="Delete Worklog"
      :message="`Are you sure you want to delete Week ${worklog?.week_number} worklog? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      :loading="deleting"
      :error="deleteError"
      @confirm="handleDelete"
      @cancel="confirmDelete = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorklogStore } from '@/stores/worklogStore'
import { useToastStore } from '@/stores/toast'
import WorklogStatusBadge from '@/components/worklog/WorklogStatusBadge.vue'
import AttachmentList from '@/components/worklog/AttachmentList.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import type { Worklog } from '@/types/worklog'

const route = useRoute()
const router = useRouter()
const store = useWorklogStore()
const toast = useToastStore()

const worklogId = computed(() => Number(route.params.id))

const worklog = computed(() => store.worklog)

const confirmDelete = ref(false)
const deleting = ref(false)
const deleteError = ref<string | null>(null)

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
  if (typeof (w as any).can_edit === 'boolean') return (w as any).can_edit
  return w.status === 'Pending' || w.status === 'Reviewed'
}

async function handleDelete() {
  deleting.value = true
  deleteError.value = null
  try {
    await store.deleteWorklog(worklogId.value)
    toast.success('Worklog deleted successfully.', 'Deleted')
    router.push('/student/worklogs')
  } catch (err: unknown) {
    deleteError.value = (err as any)?.response?.data?.message || 'Failed to delete worklog. Please try again.'
  } finally {
    deleting.value = false
  }
}
</script>
