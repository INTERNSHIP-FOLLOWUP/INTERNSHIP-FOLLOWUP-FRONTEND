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
      <div class="rounded-2xl border border-slate-100 dark:bg-slate-800 bg-white p-4 shadow-sm">
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
      <div class="rounded-2xl border border-slate-100 dark:bg-slate-800 bg-white p-4 shadow-sm">
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
      <div class="rounded-2xl border border-slate-100 dark:bg-slate-800 bg-white p-4 shadow-sm">
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
      <div class="rounded-2xl border border-slate-100 dark:bg-slate-800 bg-white p-4 shadow-sm">
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
    <div class="rounded-2xl border border-slate-100 dark:bg-slate-800 bg-white p-5 shadow-sm">
      <div class="grid gap-3 md:grid-cols-4">
        <div class="md:col-span-2">
          <label class="text-xs font-semibold text-slate-500">Student Name</label>
          <input
            v-model="search"
            type="text"
            placeholder="Search student..."
            class="mt-1 h-10 w-full rounded-xl border border-slate-200 dark:bg-slate-800 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div>
          <label class="text-xs font-semibold text-slate-500">Status</label>
          <select
            v-model="statusFilter"
            @change="onFilterChange"
            class="mt-1 h-10 w-full rounded-xl border border-slate-200 dark:bg-slate-800 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
            class="mt-1 h-10 w-full rounded-xl border border-slate-200 dark:bg-slate-800 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
          class="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:bg-slate-800 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          Reset Filters
        </button>
      </div>
    </div>

    <!-- Cards grid / loading/error/empty -->
    <div class="rounded-2xl border border-slate-100 dark:bg-slate-800 bg-white shadow-sm">
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
            class="rounded-2xl border border-slate-100 dark:bg-slate-800 bg-white transition hover:shadow-md hover:-translate-y-0.5"
          >
            <div class="p-5">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <img
                      v-if="studentPhotoUrl(w.student)"
                      :src="studentPhotoUrl(w.student) || undefined"
                      alt="Student photo"
                      class="h-full w-full object-cover"
                      @error="onPhotoError(w.student)"
                    />
                    <div
                      v-else
                      class="flex h-full w-full items-center justify-center bg-indigo-50 text-indigo-700 font-bold"
                    >
                      {{ initials(w.student?.name) }}
                    </div>
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
                  <span class="text-xs text-slate-400">{{
                    formatDate(w.work_date || w.submission_date || w.submitted_at || w.created_at)
                  }}</span>
                  <span v-if="w.work_time" class="text-xs text-slate-400">{{ formatTimeRange(w.work_time) }}</span>
                </div>
                <p class="mt-2 line-clamp-2 text-sm text-slate-700">{{ w.work_activities || w.description || '—' }}</p>
                <p v-if="w.what_learned" class="mt-1 line-clamp-2 text-sm text-slate-500">
                  Learned: {{ w.what_learned }}
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
                class="rounded-xl border border-slate-200 dark:bg-slate-800 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
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
                      : 'dark:bg-slate-800 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50',
                  ]"
                >
                  {{ p }}
                </button>
              </div>
              <button
                :disabled="currentPage >= lastPage"
                @click="go(currentPage + 1)"
                class="rounded-xl border border-slate-200 dark:bg-slate-800 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
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
      <div class="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border dark:border-slate-700 border-slate-100 dark:bg-slate-800 bg-white shadow-2xl">
        <!-- Hero Header with Student Avatar -->
        <div class="relative shrink-0 overflow-visible bg-gradient-to-r from-indigo-500 to-sky-400 px-6 py-6 sm:px-8">
          <div class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div class="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

          <div class="absolute right-4 top-4 z-10 flex items-center gap-2">
            <!-- Export dropdown -->
            <div class="relative">
              <div
                v-if="showExport"
                class="fixed inset-0 z-10"
                @click="showExport = false"
              ></div>
              <button
                type="button"
                @click="toggleExport"
                class="inline-flex items-center gap-2 rounded-xl bg-white/20 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Export
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                v-if="showExport"
                class="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 dark:bg-slate-800 bg-white py-1 shadow-lg"
              >
                <button
                  type="button"
                  @click="exportAs('pdf')"
                  class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <span class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">PDF</span>
                  Download as PDF
                </button>
                <button
                  type="button"
                  @click="exportAs('word')"
                  class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <span class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">DOC</span>
                  Download as Word
                </button>
                <button
                  type="button"
                  @click="exportAs('excel')"
                  class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <span class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">XLS</span>
                  Download as Excel
                </button>
              </div>
            </div>

            <button
              type="button"
              @click="closeDetails"
              class="rounded-xl bg-white/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/30"
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

          <div class="relative flex flex-col items-center gap-4 pt-8 sm:flex-row sm:items-end sm:pt-4">
            <div class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white/50 dark:bg-slate-800 bg-white shadow-xl">
              <img
                v-if="studentPhotoUrl(detailsWorklog.student)"
                :src="studentPhotoUrl(detailsWorklog.student) || undefined"
                alt="Student photo"
                class="h-full w-full object-cover"
                @error="onPhotoError(detailsWorklog.student)"
              />
              <span v-else class="text-2xl font-bold text-indigo-600">
                {{ initials(detailsWorklog.student?.name) }}
              </span>
            </div>
            <div class="text-center sm:text-left">
              <p class="text-xs font-semibold uppercase tracking-wider text-white/80">Worklog Review</p>
              <h1 class="text-2xl font-bold text-white drop-shadow-sm">{{ detailsWorklog.student?.name || 'Student' }}</h1>
              <div class="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span class="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  {{ detailsWorklog.work_date ? formatDate(detailsWorklog.work_date) : 'No date' }}
                </span>
                <span
                  v-if="studentMeta(detailsWorklog.student).company_name"
                  class="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
                >
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {{ studentMeta(detailsWorklog.student).company_name }}
                </span>
                <WorklogStatusBadge :status="detailsWorklog.status" />
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <!-- Section: Student & Internship -->
          <div class="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            <div class="space-y-5">
              <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider dark:text-slate-500 text-slate-400">
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
                  <p class="text-xs font-medium dark:text-slate-500 text-slate-400">Email</p>
                  <p class="truncate text-sm font-semibold dark:text-slate-100 text-slate-900">{{ detailsWorklog.student?.email || '—' }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-medium dark:text-slate-500 text-slate-400">Phone</p>
                  <p class="truncate text-sm font-semibold dark:text-slate-100 text-slate-900">{{ detailsWorklog.student?.phone || '—' }}</p>
                </div>
              </div>
            </div>
            <div class="space-y-5">
              <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider dark:text-slate-500 text-slate-400">
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
                  <p class="text-xs font-medium dark:text-slate-500 text-slate-400">Company</p>
                  <p class="truncate text-sm font-semibold dark:text-slate-100 text-slate-900">{{ studentMeta(detailsWorklog.student).company_name || '—' }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.893 23.893 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-medium dark:text-slate-500 text-slate-400">Position</p>
                  <p class="truncate text-sm font-semibold dark:text-slate-100 text-slate-900">{{ studentMeta(detailsWorklog.student).position || '—' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="my-8 border-t dark:border-slate-700 border-slate-100" />

          <!-- Section: Worklog Information -->
          <div class="space-y-5">
            <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider dark:text-slate-500 text-slate-400">
              <span class="h-1 w-1 rounded-full bg-blue-500"></span>
              Worklog Information
            </h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div class="rounded-xl dark:bg-slate-700 bg-slate-50/60 p-4">
                <p class="text-xs font-medium dark:text-slate-500 text-slate-400">Work Date</p>
                <p class="mt-1 text-sm font-semibold dark:text-slate-200 text-slate-700">{{ detailsWorklog.work_date ? formatDate(detailsWorklog.work_date) : '—' }}</p>
              </div>
              <div class="rounded-xl dark:bg-slate-700 bg-slate-50/60 p-4">
                <p class="text-xs font-medium dark:text-slate-500 text-slate-400">Working Time</p>
                <p class="mt-1 text-sm font-semibold dark:text-slate-200 text-slate-700">{{ formatTimeRange(detailsWorklog.work_time) }}</p>
              </div>
              <div class="rounded-xl dark:bg-slate-700 bg-slate-50/60 p-4">
                <p class="text-xs font-medium dark:text-slate-500 text-slate-400">Submitted</p>
                <p class="mt-1 text-sm font-semibold dark:text-slate-200 text-slate-700">
                  {{
                    formatDate(
                      detailsWorklog.work_date ||
                        detailsWorklog.submission_date ||
                        detailsWorklog.submitted_at ||
                        detailsWorklog.created_at,
                    )
                  }}
                </p>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="my-8 border-t dark:border-slate-700 border-slate-100" />

          <!-- Section: Daily Report -->
          <div class="space-y-6">
            <div v-if="detailsWorklog.work_activities" class="space-y-3">
              <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider dark:text-slate-500 text-slate-400">
                <span class="h-1 w-1 rounded-full bg-blue-400"></span>
                Work Activities
              </h3>
              <div class="rounded-xl border border-blue-100 bg-blue-50/40 p-4 dark:border-slate-700 dark:bg-slate-700/50">
                <p class="whitespace-pre-wrap text-sm dark:text-slate-200 text-slate-700">{{ detailsWorklog.work_activities }}</p>
              </div>
            </div>

            <div v-if="detailsWorklog.what_learned" class="space-y-3">
              <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider dark:text-slate-500 text-slate-400">
                <span class="h-1 w-1 rounded-full bg-emerald-400"></span>
                What Did You Learn?
              </h3>
              <div class="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 dark:border-slate-700 dark:bg-slate-700/50">
                <p class="whitespace-pre-wrap text-sm dark:text-slate-200 text-slate-700">{{ detailsWorklog.what_learned }}</p>
              </div>
            </div>

            <div v-if="detailsWorklog.difficulties || detailsWorklog.solutions" class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div v-if="detailsWorklog.difficulties" class="space-y-3">
                <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider dark:text-slate-500 text-slate-400">
                  <span class="h-1 w-1 rounded-full bg-amber-400"></span>
                  Difficulties / Issues
                </h3>
                <div class="rounded-xl border border-amber-100 bg-amber-50/40 p-4 dark:border-slate-700 dark:bg-slate-700/50">
                  <p class="whitespace-pre-wrap text-sm dark:text-slate-200 text-slate-700">{{ detailsWorklog.difficulties }}</p>
                </div>
              </div>
              <div v-if="detailsWorklog.solutions" class="space-y-3">
                <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider dark:text-slate-500 text-slate-400">
                  <span class="h-1 w-1 rounded-full bg-teal-400"></span>
                  Solutions
                </h3>
                <div class="rounded-xl border border-teal-100 bg-teal-50/40 p-4 dark:border-slate-700 dark:bg-slate-700/50">
                  <p class="whitespace-pre-wrap text-sm dark:text-slate-200 text-slate-700">{{ detailsWorklog.solutions }}</p>
                </div>
              </div>
            </div>

            <div v-if="detailsWorklog.to_do" class="space-y-3">
              <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider dark:text-slate-500 text-slate-400">
                <span class="h-1 w-1 rounded-full bg-purple-400"></span>
                To Do
              </h3>
              <div class="rounded-xl border border-purple-100 bg-purple-50/40 p-4 dark:border-slate-700 dark:bg-slate-700/50">
                <p class="whitespace-pre-wrap text-sm dark:text-slate-200 text-slate-700">{{ detailsWorklog.to_do }}</p>
              </div>
            </div>

            <div v-if="detailsWorklog.comment" class="space-y-3">
              <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider dark:text-slate-500 text-slate-400">
                <span class="h-1 w-1 rounded-full bg-slate-400"></span>
                Comment
              </h3>
              <div class="rounded-xl border dark:border-slate-700 border-slate-100 bg-slate-50/40 dark:bg-slate-700/50 p-4">
                <p class="whitespace-pre-wrap text-sm dark:text-slate-200 text-slate-700">{{ detailsWorklog.comment }}</p>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="my-8 border-t dark:border-slate-700 border-slate-100" />

          <!-- Section: Attachments -->
          <div class="space-y-5">
            <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider dark:text-slate-500 text-slate-400">
              <span class="h-1 w-1 rounded-full bg-violet-400"></span>
              Attachments ({{ (detailsWorklog.attachments || []).length }})
            </h3>
            <div
              v-if="(detailsWorklog.attachments || []).length"
              class="rounded-xl border dark:border-slate-700 border-slate-100 dark:bg-slate-700/50 bg-slate-50/50 p-4"
            >
              <AttachmentList :attachments="detailsWorklog.attachments || []" />
            </div>
            <div
              v-else
              class="rounded-xl border border-dashed dark:border-slate-600 border-slate-200 py-6 text-center text-sm dark:text-slate-500 text-slate-400"
            >
              No attachments provided.
            </div>
          </div>
        </div>

        <!-- Action Footer -->
        <div class="shrink-0 border-t dark:border-slate-700 border-slate-100 dark:bg-slate-700 bg-slate-50/60 px-6 py-4 sm:px-8">
          <p v-if="detailsServerError" class="mb-3 text-sm font-semibold text-red-500">{{ detailsServerError }}</p>
          <div class="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div class="flex items-center gap-2">
              <span class="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
              <span class="text-xs font-medium dark:text-slate-400 text-slate-400">Worklog #{{ detailsWorklog.id }} — awaiting your review</span>
            </div>
            <div class="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                @click="closeDetails"
                class="inline-flex items-center gap-1.5 rounded-xl border dark:border-slate-600 border-slate-200 dark:bg-slate-800 bg-white px-4 py-2 text-sm font-semibold dark:text-slate-200 text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                @click="submitStatus('Rejected')"
                :disabled="submitting"
                class="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject
              </button>
              <button
                type="button"
                @click="submitStatus('Reviewed')"
                :disabled="submitting || reviewingStatus === 'Reviewed'"
                class="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-600 transition-colors hover:bg-amber-100 hover:text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Request Revision
              </button>
              <button
                type="button"
                @click="submitStatus('Approved')"
                :disabled="submitting"
                class="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
import { exportWorklogPDF, exportWorklogWord, exportWorklogExcel } from '@/utils/exportWorklog'

const store = useWorklogStore()

const search = ref('')
const statusFilter = ref('')
const weekFilter = ref('')
const weeks = Array.from({ length: 52 }, (_, i) => i + 1)

const detailsWorklog = ref<Worklog | null>(null)
const detailsServerError = ref('')
const submitting = ref(false)
const reviewingStatus = ref<WorklogStatus | null>(null)
const showExport = ref(false)

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

const failedPhotos = ref<Set<string>>(new Set())

function studentMeta(student: Worklog['student']): { company_name?: string | null; position?: string | null } {
  return (student as { company_name?: string | null; position?: string | null } | undefined) ?? {}
}

function studentPhotoUrl(student: Worklog['student']): string | null {
  const url = (student as { photo_url?: string | null } | undefined)?.photo_url
  if (!url || failedPhotos.value.has(url)) return null
  if (/^https?:\/\//.test(url)) return url
  const base = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/?api\/?$/, '')
  if (url.startsWith('/storage/')) return `${base}${url}`
  return `${base}/storage/${url.replace(/^\//, '')}`
}

function onPhotoError(student: Worklog['student']) {
  const url = (student as { photo_url?: string | null } | undefined)?.photo_url
  if (url) {
    const next = new Set(failedPhotos.value)
    next.add(url)
    failedPhotos.value = next
  }
}

function openDetails(w: Worklog) {
  detailsWorklog.value = w
  detailsServerError.value = ''
  reviewingStatus.value = null
}

function closeDetails() {
  detailsWorklog.value = null
  detailsServerError.value = ''
  reviewingStatus.value = null
  showExport.value = false
}

function toggleExport() {
  showExport.value = !showExport.value
}

function exportAs(format: 'pdf' | 'word' | 'excel') {
  if (!detailsWorklog.value) return
  try {
    if (format === 'pdf') exportWorklogPDF(detailsWorklog.value)
    else if (format === 'word') exportWorklogWord(detailsWorklog.value)
    else exportWorklogExcel(detailsWorklog.value)
  } catch {
    detailsServerError.value = `Failed to export as ${format.toUpperCase()}.`
  }
  showExport.value = false
}

async function submitStatus(status: WorklogStatus) {
  if (!detailsWorklog.value) return
  detailsServerError.value = ''
  submitting.value = true
  reviewingStatus.value = status
  try {
    await store.reviewWorklog(detailsWorklog.value.id, {
      status,
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
    await store.reviewWorklog(id, {
      status,
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
