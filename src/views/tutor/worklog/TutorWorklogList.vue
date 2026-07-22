<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Tutor Worklog Review</h1>
        <p class="text-sm text-slate-500">
          Review, approve, or request changes to student weekly worklogs.
        </p>
      </div>
    </div>

    <!-- Stats -->
    <div v-if="!store.loading && !store.error" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="rounded-xl bg-blue-50 p-2.5 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18V6z"
              />
            </svg>
          </div>
          <div>
            <p class="text-xs text-slate-500">Total Worklogs</p>
            <p class="text-xl font-bold text-slate-900">{{ stats.total }}</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="rounded-xl bg-amber-50 p-2.5 text-amber-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p class="text-xs text-slate-500">Pending Review</p>
            <p class="text-xl font-bold text-slate-900">{{ stats.pending }}</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-slate-500">Approved</p>
            <p class="text-xl font-bold text-slate-900">{{ stats.approved }}</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="rounded-xl bg-orange-50 p-2.5 text-orange-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348c4.183.626 6.977 3.26 6.977 7.053A7.5 7.5 0 119.75 1.5c4.232 0 7.273 2.527 7.273 5.848z"
              />
            </svg>
          </div>
          <div>
            <p class="text-xs text-slate-500">Needs Revision</p>
            <p class="text-xl font-bold text-slate-900">{{ stats.needsRevision }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div class="grid gap-3 md:grid-cols-4">
        <div class="md:col-span-2">
          <label class="text-xs font-semibold text-slate-500">Student Name</label>
          <input
            v-model="search"
            type="text"
            placeholder="Search student..."
            class="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div>
          <label class="text-xs font-semibold text-slate-500">Status</label>
          <select
            v-model="statusFilter"
            @change="onFilterChange"
            class="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Statuses</option>
            <option value="Submitted">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-slate-500">Week</label>
          <select
            v-model="weekFilter"
            @change="onFilterChange"
            class="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Weeks</option>
            <option v-for="w in weeks" :key="w" :value="String(w)">Week {{ w }}</option>
          </select>
        </div>
      </div>
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          @click="onFilterChange"
          class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 0010.5 18.75 7.5 7.5 0 005.5 10.5 7.5 7.5 0 0010.5 3z"
            />
          </svg>
          Search
        </button>
        <button
          type="button"
          @click="resetFilters"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          Reset Filters
        </button>
      </div>
    </div>

    <!-- Cards grid / loading/error/empty -->
    <div class="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <SkeletonGrid v-if="store.loading" />
      <div
        v-else-if="store.error"
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <div class="rounded-full bg-red-50 p-3 text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <p class="mt-3 text-sm font-semibold text-red-600">Unable to load worklogs.</p>
        <button
          type="button"
          @click="refresh"
          class="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
        >
          Retry
        </button>
      </div>
      <div
        v-else-if="filtered.length === 0"
        class="flex flex-col items-center justify-center py-16 text-center px-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 text-slate-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <p class="mt-3 text-sm font-semibold text-slate-500">No worklogs found.</p>
        <p class="text-xs text-slate-400">There are currently no worklogs matching your filters.</p>
        <button
          type="button"
          @click="refresh"
          class="mt-3 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition"
        >
          Refresh
        </button>
      </div>
      <div v-else class="p-6">
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="w in paged"
            :key="w.id"
            class="rounded-2xl border border-slate-100 bg-white transition hover:shadow-md hover:-translate-y-0.5"
          >
            <div class="p-5">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-bold"
                  >
                    {{ initials(w.student?.name) }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-bold text-slate-900 truncate">
                      {{ w.student?.name || '—' }}
                    </p>
                    <p class="text-xs text-slate-500 truncate">ID: {{ w.id }}</p>
                  </div>
                </div>
                <WorklogStatusBadge :status="w.status" />
              </div>

              <div class="mt-4">
                <div class="flex items-center gap-2">
                  <span
                    class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700"
                    >Week {{ w.week_number }}</span
                  >
                  <span class="text-xs text-slate-400">{{
                    formatDate(w.submission_date || w.submitted_at || w.created_at)
                  }}</span>
                </div>
                <p class="mt-2 line-clamp-2 text-sm text-slate-700">{{ w.description || '—' }}</p>
                <p v-if="w.challenges" class="mt-1 line-clamp-2 text-sm text-slate-500">
                  Challenges: {{ w.challenges }}
                </p>
                <div class="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9m-9 0V6.75"
                    />
                  </svg>
                  {{ (w.attachments || []).length }} Attachments
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 border-t border-slate-100 p-4">
              <button
                type="button"
                @click="openDetails(w)"
                class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-50 px-3.5 py-2.5 text-sm font-bold text-sky-700 hover:bg-sky-100 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.09 7.36 4.5 12 4.5c4.64 0 8.577 2.59 9.964 7.182.09.318.09.66 0 .978C20.577 16.41 16.64 18.5 12 18.5c-4.64 0-8.577-2.59-9.964-7.178z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                View Details
              </button>
              <button
                v-if="w.status === 'Submitted'"
                type="button"
                @click="quickReview(w.id, 'Approved')"
                class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a8.678 8.678 0 012.888.52c1.185.48 2.337 1.103 3.234 1.84.897.738 1.586 1.574 1.973 2.454H19.5a2.25 2.25 0 012.25 2.25v.75"
                  />
                </svg>
                Approve
              </button>
            </div>
          </div>
        </div>

        <div v-if="store.tutorPagination && worklogs.length > 0" class="mt-5">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-xs text-slate-500">{{ metaText }}</p>
            <div class="flex items-center gap-2">
              <button
                :disabled="currentPage === 1"
                @click="go(currentPage - 1)"
                class="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
              >
                Previous
              </button>
              <div class="flex items-center gap-1.5">
                <button
                  v-for="p in visiblePages"
                  :key="p"
                  @click="go(p)"
                  :class="[
                    'min-w-[2rem] rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                    p === currentPage
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50',
                  ]"
                >
                  {{ p }}
                </button>
              </div>
              <button
                :disabled="currentPage >= lastPage"
                @click="go(currentPage + 1)"
                class="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Details dialog -->
    <div
      v-if="detailsWorklog"
      tabindex="0"
      aria-modal="true"
      class="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
    >
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeDetails"></div>
      <div class="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div class="flex items-start justify-between border-b border-slate-100 p-5">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Worklog Review</h3>
            <p class="text-xs text-slate-500">Review details and submit feedback.</p>
          </div>
          <button
            type="button"
            @click="closeDetails"
            class="rounded-lg p-2 text-slate-400 hover:text-slate-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="max-h-[70vh] space-y-4 overflow-y-auto p-5">
          <section class="rounded-2xl border border-slate-100 bg-white p-5">
            <h2 class="text-sm font-bold text-slate-900">Student Information</h2>
            <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <p class="text-xs font-semibold text-slate-500">Name</p>
                <p class="text-sm font-bold text-slate-900">
                  {{ detailsWorklog.student?.name || '—' }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold text-slate-500">Email</p>
                <p class="text-sm font-bold text-slate-900">
                  {{ detailsWorklog.student?.email || '—' }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold text-slate-500">Phone</p>
                <p class="text-sm font-bold text-slate-900">
                  {{ detailsWorklog.student?.phone || '—' }}
                </p>
              </div>
            </div>
          </section>

          <section class="rounded-2xl border border-slate-100 bg-white p-5">
            <h2 class="text-sm font-bold text-slate-900">Worklog Information</h2>
            <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <p class="text-xs font-semibold text-slate-500">Week</p>
                <p class="text-sm font-bold text-slate-900">{{ detailsWorklog.week_number }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-slate-500">Submitted</p>
                <p class="text-sm font-bold text-slate-900">
                  {{
                    formatDate(
                      detailsWorklog.submission_date ||
                        detailsWorklog.submitted_at ||
                        detailsWorklog.created_at,
                    )
                  }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold text-slate-500">Status</p>
                <div class="mt-1"><WorklogStatusBadge :status="detailsWorklog.status" /></div>
              </div>
            </div>

            <div class="mt-4">
              <p class="text-xs font-semibold text-slate-500">Description</p>
              <p class="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                {{ detailsWorklog.description }}
              </p>
            </div>

            <div class="mt-4" v-if="detailsWorklog.challenges">
              <p class="text-xs font-semibold text-slate-500">Challenges</p>
              <p class="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                {{ detailsWorklog.challenges }}
              </p>
            </div>

            <div class="mt-4">
              <p class="text-xs font-semibold text-slate-500">Attachments</p>
              <div class="mt-2">
                <AttachmentList :attachments="detailsWorklog.attachments || []" />
              </div>
            </div>
          </section>

          <section class="rounded-2xl border border-slate-100 bg-white p-5">
            <h2 class="text-sm font-bold text-slate-900">Tutor Feedback</h2>
            <label class="mt-4 block text-sm font-semibold text-slate-700">Feedback</label>
            <textarea
              v-model="detailsFeedback"
              rows="4"
              class="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Explicit note to share..."
            />
            <p v-if="detailsServerError" class="mt-2 text-sm font-semibold text-red-600">
              {{ detailsServerError }}
            </p>

            <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                @click="submitStatus('Reviewed')"
                :disabled="
                  submitting || (reviewingStatus === 'Reviewed' && !detailsFeedback.trim())
                "
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100 disabled:opacity-60 transition"
              >
                Request Revision
              </button>
              <button
                type="button"
                @click="submitStatus('Approved')"
                :disabled="submitting"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60 transition"
              >
                Approve
              </button>
              <button
                type="button"
                @click="submitStatus('Rejected')"
                :disabled="submitting"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-bold text-red-700 hover:bg-red-100 disabled:opacity-60 transition"
              >
                Reject
              </button>
            </div>
          </section>
        </div>

        <div class="flex items-center justify-end gap-2 border-t border-slate-100 p-5">
          <button
            type="button"
            @click="closeDetails"
            class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useWorklogStore } from '@/stores/worklogStore'
import WorklogStatusBadge from '@/components/worklog/WorklogStatusBadge.vue'
import AttachmentList from '@/components/worklog/AttachmentList.vue'
import SkeletonGrid from '@/components/worklog/SkeletonGrid.vue'
import type { Worklog, WorklogStatus } from '@/types/worklog'
import { usePagination } from '@/composables/usePagination'

const store = useWorklogStore()

const search = ref('')
const statusFilter = ref('')
const weekFilter = ref('')
const weeks = Array.from({ length: 52 }, (_, i) => i + 1)

const detailsWorklog = ref<Worklog | null>(null)
const detailsFeedback = ref('')
const detailsServerError = ref('')
const submitting = ref(false)
const reviewingStatus = ref<WorklogStatus | null>(null)

const worklogs = computed(() => store.tutorWorklogs)
const pagination = computed(() => store.tutorPagination)

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return worklogs.value.filter((w: Worklog) => {
    const matchesStatus = statusFilter.value ? w.status === statusFilter.value : true
    const matchesWeek = weekFilter.value ? String(w.week_number) === weekFilter.value : true
    const matchesSearch = term ? (w.student?.name || '').toLowerCase().includes(term) : true
    return matchesStatus && matchesWeek && matchesSearch
  })
})

const currentPage = ref(1)
const perPage = computed(() => (pagination.value?.per_page as number) || 12)
const lastPage = computed(() =>
  Math.max(1, pagination.value?.last_page || Math.ceil(filtered.value.length / perPage.value)),
)
const metaText = computed(
  () =>
    `Showing ${(currentPage.value - 1) * perPage.value + 1}–${Math.min(currentPage.value * perPage.value, filtered.value.length)} of ${filtered.value.length}`,
)
const paged = computed(() =>
  filtered.value.slice((currentPage.value - 1) * perPage.value, currentPage.value * perPage.value),
)
const visiblePages = computed(() => {
  const pages: number[] = []
  for (let i = 1; i <= lastPage.value; i++)
    if (
      i === 1 ||
      i === lastPage.value ||
      (i >= currentPage.value - 1 && i <= currentPage.value + 1)
    )
      pages.push(i)
  return pages
})

const stats = computed(() => {
  const items = worklogs.value
  return {
    total: items.length,
    pending: items.filter((w) => w.status === 'Pending').length,
    approved: items.filter((w) => w.status === 'Approved').length,
    needsRevision: items.filter((w) => w.status === 'Reviewed').length,
  }
})

function initFetch({ page }: { page: number }) {
  store
    .fetchTutorWorklogs({
      page,
      week: weekFilter.value ? Number(weekFilter.value) : undefined,
      status: statusFilter.value ? (statusFilter.value as WorklogStatus) : undefined,
    })
    .then(() => {
      currentPage.value = pagination.value?.current_page || page || 1
    })
}

const { setPage } = usePagination(initFetch)

function onFilterChange() {
  setPage(1)
}

function resetFilters() {
  search.value = ''
  statusFilter.value = ''
  weekFilter.value = ''
  onFilterChange()
}

function refresh() {
  onFilterChange()
}

function go(page: number) {
  setPage(page)
}

function formatDate(date?: string): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function initials(name?: string) {
  if (!name || typeof name !== 'string') return '??'
  const parts = name.trim().split(' ')
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

function openDetails(w: Worklog) {
  detailsWorklog.value = w
  detailsFeedback.value = w.tutor_review?.feedback || ''
  detailsServerError.value = ''
  reviewingStatus.value = null
}

function closeDetails() {
  detailsWorklog.value = null
  detailsFeedback.value = ''
  detailsServerError.value = ''
  reviewingStatus.value = null
}

async function submitStatus(status: WorklogStatus) {
  if (!detailsWorklog.value) return
  detailsServerError.value = ''
  submitting.value = true
  reviewingStatus.value = status
  try {
    await store.reviewWorklog(detailsWorklog.value.id, {
      status,
      feedback: detailsFeedback.value.trim(),
    })
    closeDetails()
    onFilterChange()
  } catch {
    detailsServerError.value = 'Failed to submit review.'
  } finally {
    submitting.value = false
    reviewingStatus.value = null
  }
}

async function quickReview(id: number, status: WorklogStatus) {
  detailsServerError.value = ''
  submitting.value = true
  reviewingStatus.value = status
  try {
    const w = worklogs.value.find((item) => item.id === id)
    const feedback =
      (w?.tutor_review?.feedback || '').toString().trim() || detailsFeedback.value.trim()

    await store.reviewWorklog(id, {
      status,
      feedback,
    })
    onFilterChange()
  } catch {
    detailsServerError.value = 'Failed to submit review.'
  } finally {
    submitting.value = false
    reviewingStatus.value = null
  }
}

onMounted(() => {
  initFetch({ page: 1 })
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
