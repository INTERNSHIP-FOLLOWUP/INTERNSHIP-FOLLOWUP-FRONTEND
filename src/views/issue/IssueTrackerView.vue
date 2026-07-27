<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-slate-100">
          {{ context === 'student' ? 'My Internship Issues' : (context === 'admin' ? 'Global Issue Management' : 'Tutor Issue Management') }}
        </h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {{ context === 'student' ? 'Report challenges or issues during your internship and track tutor resolution.' : 'Track, assign, update, and resolve internship project issues.' }}
        </p>
      </div>
      <button
        v-if="canCreateIssue"
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#1d4ed8]"
        @click="openCreateModal"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        {{ context === 'student' ? 'Report New Issue' : 'Create Issue' }}
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in issueStore.statsItems"
        :key="stat.label"
        class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ stat.label }}</p>
            <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-slate-100">{{ stat.value }}</p>
          </div>
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl text-white transition-transform duration-200 group-hover:scale-110"
            :class="stat.color"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div
      v-if="issueStore.error"
      class="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30"
    >
      <p class="text-sm font-medium text-red-700 dark:text-red-400">{{ issueStore.error }}</p>
      <button
        class="self-start rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50"
        @click="retry"
      >
        Retry
      </button>
    </div>

    <!-- Filters -->
    <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div class="lg:col-span-2">
          <label class="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Search</label>
          <input
            v-model="localSearch"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            placeholder="Search by title or student name..."
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Status</label>
          <select
            v-model="localStatus"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          >
            <option value="">All</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Priority</label>
          <select
            v-model="localPriority"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          >
            <option value="">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
        <div class="flex items-end gap-2">
          <button
            class="flex-1 rounded-xl bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2258e0] disabled:opacity-70"
            :disabled="issueStore.loading"
            @click="applyFilters"
          >
            Search
          </button>
          <button
            class="rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/50"
            @click="resetFilters"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="issueStore.loading" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="i in 6"
        :key="i"
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="h-4 w-24 animate-pulse rounded bg-gray-100 dark:bg-slate-700" />
        <div class="mt-4 h-5 w-3/4 animate-pulse rounded bg-gray-100 dark:bg-slate-700" />
        <div class="mt-3 h-3 w-full animate-pulse rounded bg-gray-100 dark:bg-slate-700" />
        <div class="mt-3 h-3 w-5/6 animate-pulse rounded bg-gray-100 dark:bg-slate-700" />
        <div class="mt-5 h-9 w-full animate-pulse rounded-xl bg-gray-100 dark:bg-slate-700" />
      </div>
    </div>

    <!-- Issue cards -->
    <div
      v-else-if="issueStore.paginatedIssues.length"
      class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <div
        v-for="issue in issueStore.paginatedIssues"
        :key="issue.id"
        class="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="flex items-start justify-between">
          <span
            class="inline-flex items-center rounded-lg bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300"
          >
            {{ issue.id }}
          </span>
          <span
            class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
            :class="statusBadgeClasses(issue.status)"
          >
            {{ issue.status }}
          </span>
        </div>

        <h3 class="mt-3 text-base font-bold leading-snug text-gray-900 dark:text-slate-100">
          {{ issue.title }}
        </h3>
        <p class="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-2 dark:text-slate-400">
          {{ issue.description }}
        </p>

        <div class="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div class="flex items-center gap-1.5">
            <svg
              class="h-3.5 w-3.5 text-gray-400 dark:text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span class="font-medium text-gray-700 dark:text-slate-300">{{ issue.reporter }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <svg
              class="h-3.5 w-3.5 text-gray-400 dark:text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span class="text-gray-700 dark:text-slate-300">{{ issue.assignedTo }}</span>
          </div>
        </div>

        <div class="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span class="flex items-center gap-1.5">
            <svg
              class="h-3.5 w-3.5 text-gray-400 dark:text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            {{ format(issue.createdAt) }}
          </span>
          <span class="flex items-center gap-1.5">
            <svg
              class="h-3.5 w-3.5 text-gray-400 dark:text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Updated {{ format(issue.updatedAt) }}
          </span>
          <span
            class="inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-semibold"
            :class="priorityBadgeClasses(issue.priority)"
          >
            {{ issue.priority }}
          </span>
        </div>

        <div
          v-if="issue.attachments && issue.attachments > 0"
          class="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
        >
          <svg
            class="h-3.5 w-3.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.172 7l-6.586 6.586a2 2 0 000 2.828 2 2 0 002.828 0L18 10m0 0h-6m6 0v6"
            />
          </svg>
          {{ issue.attachments }} attachment{{ issue.attachments === 1 ? '' : 's' }}
        </div>

        <!-- Role-based Action Buttons -->
        <div class="mt-5 grid grid-cols-2 gap-2" v-if="context === 'student'">
          <button
            class="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/50"
            @click="openDetail(issue)"
          >
            View Details
          </button>
          <button
            class="rounded-xl bg-[#2563EB] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="issue.status !== 'Open'"
            @click="openEditModal(issue)"
          >
            Edit Issue
          </button>
        </div>
        <div class="mt-5 grid grid-cols-4 gap-2" v-else>
          <button
            class="rounded-xl border border-gray-200 px-2.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/50"
            @click="openDetail(issue)"
          >
            View
          </button>
          <button
            v-if="context === 'tutor'"
            class="rounded-xl bg-[#2563EB] px-2.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#2258e0] disabled:opacity-70"
            :disabled="closedOnlyView(issue)"
            @click="openEditModal(issue)"
          >
            Edit
          </button>
          <button
            v-else
            class="rounded-xl bg-[#2563EB] px-2.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#2258e0] disabled:opacity-70"
            :disabled="closedOnlyView(issue)"
            @click="openUpdateModal(issue)"
          >
            Update
          </button>
          <button
            class="rounded-xl bg-[#7C3AED] px-2.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#6a2fd9] disabled:opacity-70"
            :disabled="closedOnlyView(issue)"
            @click="openAssignModal(issue)"
          >
            Assign
          </button>
          <button
            class="rounded-xl bg-[#22C55E] px-2.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#16a34a] disabled:opacity-70"
            :disabled="closedOnlyView(issue)"
            @click="resolveIssue(issue)"
          >
            Resolve
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!issueStore.loading && (issueStore.isEmpty || !issueStore.paginatedIssues.length)"
      class="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-14 text-center dark:border-slate-700 dark:bg-slate-800"
    >
      <svg class="h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-slate-100">
        {{ (localSearch || localStatus || localPriority) ? 'No Matching Issues Found' : 'No Issues Found' }}
      </h3>
      <p class="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {{ (localSearch || localStatus || localPriority) ? 'No issues match your selected filters. Try clearing or adjusting your search parameters.' : 'There are currently no reported issues. Click the button below to create the first issue.' }}
      </p>
      <button
        v-if="canCreateIssue"
        class="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2258e0]"
        @click="openCreateModal"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Report New Issue
      </button>
    </div>

    <!-- Pagination -->
    <div
      v-if="issueStore.pagination.totalPages > 1"
      class="flex flex-col items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 sm:flex-row sm:px-6 dark:bg-slate-800"
    >
      <p class="text-xs text-slate-500 dark:text-slate-400">
        Showing
        <span class="font-semibold text-gray-700 dark:text-slate-300">{{ displayRange }}</span>
        of
        <span class="font-semibold text-gray-700 dark:text-slate-300">{{ issueStore.pagination.totalItems }}</span>
        issues
      </p>
      <div class="flex items-center gap-2">
        <button
          class="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-gray-50 disabled:opacity-60 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/50"
          :disabled="issueStore.pagination.page === 1"
          @click="issueStore.setPage(issueStore.pagination.page - 1)"
        >
          Previous
        </button>
        <div class="flex items-center gap-1">
          <button
            v-for="p in visiblePages"
            :key="p"
            class="flex h-8 w-8 items-center justify-center rounded-xl text-xs font-semibold transition-colors"
            :class="
              p === issueStore.pagination.page
                ? 'bg-[#2563EB] text-white'
                : 'text-slate-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700/50'
            "
            @click="issueStore.setPage(p)"
          >
            {{ p }}
          </button>
        </div>
        <button
          class="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-gray-50 disabled:opacity-60 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/50"
          :disabled="issueStore.pagination.page === issueStore.pagination.totalPages"
          @click="issueStore.setPage(issueStore.pagination.page + 1)"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Create / Update Modal -->
    <div
      v-if="formModal.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm transition-opacity"
    >
      <div
        class="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 dark:border-slate-700 dark:bg-slate-800"
      >
        <!-- Header -->
        <div class="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/80">
          <div>
            <h2 class="text-base font-bold text-slate-900 sm:text-lg dark:text-slate-100">
              {{ formModal.mode === 'create' ? 'New Issue' : 'Update Issue' }}
            </h2>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Fill in the issue details below to keep shared progress clear.
            </p>
          </div>
          <button
            type="button"
            class="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition-colors dark:hover:bg-slate-700 dark:hover:text-slate-300"
            @click="closeFormModal"
            aria-label="Close modal"
  >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Issue Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formModal.form.title"
              class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 hover:border-slate-300 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed shadow-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400 dark:hover:border-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
              :disabled="closedOnlyView(formModal.item!)"
              placeholder="Enter issue title"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="formModal.form.description"
              rows="3"
              class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 hover:border-slate-300 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed shadow-sm resize-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400 dark:hover:border-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
              :disabled="closedOnlyView(formModal.item!)"
              placeholder="What's the issue?"
            />
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Priority <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formModal.form.priority"
                class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 hover:border-slate-300 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed shadow-sm bg-white dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:border-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
                :disabled="formModal.mode === 'update' && closedOnlyView(formModal.item!)"
              >
                <option value="">Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Status <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formModal.form.status"
                class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 hover:border-slate-300 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed shadow-sm bg-white dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:border-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
                :disabled="
                  !['Open', 'In Progress', 'Resolved', 'Closed'].includes(
                    formModal.form.status || '',
                  ) ||
                  !canReopenIssues ||
                  (formModal.mode === 'update' && closedOnlyView(formModal.item!))
                "
              >
                <option value="">Select status</option>
                <option v-for="status in allowedEditableStatuses" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </div>
          </div>
          <!-- Student selector - shown for tutor and admin contexts -->
          <div v-if="context === 'tutor'">
            <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Assign To Student <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formModal.form.studentId"
              class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 hover:border-slate-300 shadow-sm bg-white dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:border-slate-500"
            >
              <option value="">Select student</option>
              <option
                v-for="student in tutorStudents"
                :key="student.id"
                :value="student.id"
              >
                {{ student.name }}
              </option>
            </select>
          </div>
          <div v-else-if="context === 'admin'">
            <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Student <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formModal.form.studentId"
              class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 hover:border-slate-300 shadow-sm bg-white dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:border-slate-500"
            >
              <option value="">Select student</option>
              <option
                v-for="student in allStudents"
                :key="student.id"
                :value="student.id"
              >
                {{ student.name }}
              </option>
            </select>
          </div>
          <div v-else>
            <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Assign To</label>
            <select
              v-model="formModal.form.assignedUserId"
              class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 hover:border-slate-300 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed shadow-sm bg-white dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:border-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
              :disabled="formModal.mode === 'update' && closedOnlyView(formModal.item!)"
            >
              <option value="">Assign an available contact</option>
              <option v-for="user in formUsers" :key="user.id" :value="user.id">
                {{ user.name }} · {{ user.role }}
              </option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Due Date</label>
            <input
              v-model="formModal.form.dueDate"
              type="date"
              class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 hover:border-slate-300 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed shadow-sm bg-white dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:border-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
              :disabled="formModal.mode === 'update' && closedOnlyView(formModal.item!)"
            />
          </div>
          <!-- Existing attachments display (tutor edit mode) -->
          <div v-if="context === 'tutor' && formModal.mode === 'update' && existingAttachments.length">
            <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Current Attachments</label>
            <ul class="rounded-xl border border-slate-200 divide-y divide-slate-100 bg-slate-50/50 dark:border-slate-600 dark:divide-slate-700 dark:bg-slate-800/50">
              <li
                v-for="att in existingAttachments"
                :key="att.id"
                class="flex items-center justify-between px-3.5 py-2"
              >
                <div class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <svg
                    class="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 000 2.828 2 2 0 002.828 0L18 10m0 0h-6m6 0v6"
                    />
                  </svg>
                  <a
                    :href="att.file_path"
                    target="_blank"
                    class="font-medium text-[#2563EB] hover:underline"
                  >
                    {{ att.filename }}
                  </a>
                  <span v-if="att.file_size" class="text-slate-400 dark:text-slate-500">
                    ({{ formatFileSize(att.file_size) }})
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Attachments</label>
            <button
              type="button"
              class="group flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-4 text-center transition-all duration-200 hover:border-[#2563EB] hover:bg-blue-50/40 disabled:cursor-not-allowed disabled:opacity-60 bg-slate-50/40 dark:border-slate-600 dark:hover:border-[#3B82F6] dark:hover:bg-blue-950/30 dark:bg-slate-800/40"
              :disabled="formModal.mode === 'update' && closedOnlyView(formModal.item!)"
              @click="fileInputRef?.click()"
            >
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-[#2563EB] transition-colors dark:bg-slate-700 dark:text-slate-500 dark:group-hover:bg-blue-950/40 dark:group-hover:text-[#3B82F6]">
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 000 2.828 2 2 0 002.828 0L18 10m0 0h-6m6 0v6"
                  />
                </svg>
              </div>
              <p class="mt-2 text-xs font-semibold text-slate-700 group-hover:text-[#2563EB] dark:text-slate-300 dark:group-hover:text-[#3B82F6]">
                Click or drag & drop files here
              </p>
              <p class="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">PDF, DOCX, PNG, ZIP</p>
            </button>
            <input
              ref="fileInputRef"
              type="file"
              multiple
              accept=".pdf,.docx,.png,.zip"
              class="hidden"
              @change="handleFiles"
            />
            <div v-if="formModal.form.files.length" class="mt-2 space-y-1.5">
              <p class="text-xs font-semibold text-slate-600 dark:text-slate-400">Attached Files:</p>
              <div
                v-for="(file, idx) in formModal.form.files"
                :key="file.name + idx"
                class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                <span class="truncate font-medium">{{ file.name }}</span>
                <button
                  type="button"
                  class="ml-2 text-slate-400 hover:text-red-600 transition-colors dark:text-slate-500 dark:hover:text-red-400"
                  @click="removeFile(idx)"
                  title="Remove file"
                >
                  &times;
                </button>
              </div>
            </div>
          </div>
          <!-- Validation errors display (only shown after submit attempt) -->
          <div
            v-if="showValidationErrors && validationErrors.length"
            class="rounded-xl border border-red-200 bg-red-50/80 p-3.5 dark:border-red-900/50 dark:bg-red-950/30"
          >
            <div class="flex items-center gap-2 text-xs font-semibold text-red-700 dark:text-red-400">
              <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Please fix the following errors:
            </div>
            <ul class="mt-1.5 list-inside list-disc text-xs text-red-600 space-y-0.5 dark:text-red-400">
              <li v-for="err in validationErrors" :key="err">{{ err }}</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex shrink-0 items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 px-6 py-3.5 dark:border-slate-700 dark:bg-slate-800/80">
          <button
            type="button"
            class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:border-slate-500"
            @click="closeFormModal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-[#2563EB]/25 transition-all hover:bg-[#1d4ed8] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="submitDisabled || issueStore.loading"
            @click="submitForm"
          >
            <svg v-if="issueStore.loading" class="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ formModal.mode === 'create' ? 'Save Issue' : 'Update Issue' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="detailModal.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm transition-opacity"
    >
      <div
        class="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 dark:border-slate-700 dark:bg-slate-800"
      >
        <!-- Header -->
        <div class="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-6 py-4 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/80">
          <div>
            <p class="text-xs font-semibold text-slate-400 dark:text-slate-500">{{ detailModal.item.id }}</p>
            <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">{{ detailModal.item.title }}</h2>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="statusBadgeClasses(detailModal.item.status)"
            >
              {{ detailModal.item.status }}
            </span>
            <span
              class="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold"
              :class="priorityBadgeClasses(detailModal.item.priority)"
            >
              {{ detailModal.item.priority }}
            </span>
            <button
              type="button"
              class="ml-2 rounded-xl p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition-colors dark:hover:bg-slate-700 dark:hover:text-slate-300"
              @click="detailModal.open = false"
              aria-label="Close detail modal"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{{ detailModal.item.description }}</p>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-600 dark:bg-slate-800/50">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Reporter</p>
              <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {{ detailModal.item.reporter }}
              </p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-600 dark:bg-slate-800/50">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Assigned To
              </p>
              <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {{ detailModal.item.assignedTo }}
              </p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-600 dark:bg-slate-800/50">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Created</p>
              <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {{ detailModal.item.createdAt }}
              </p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-600 dark:bg-slate-800/50">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Updated</p>
              <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {{ detailModal.item.updatedAt }}
              </p>
            </div>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Activity Timeline</h3>
            <ol class="mt-3 space-y-4">
              <li
                v-for="event in detailModal.item.history || []"
                :key="event.time + event.text"
                class="flex gap-3"
              >
                <div
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563EB]/10 dark:bg-[#2563EB]/20"
                >
                  <svg
                    class="h-4 w-4 text-[#2563EB] dark:text-[#3B82F6]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6l4 2"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ event.text }}</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">{{ event.time }} · {{ event.user }}</p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex shrink-0 items-center justify-end border-t border-slate-100 bg-slate-50/50 px-6 py-3.5 dark:border-slate-700 dark:bg-slate-800/80">
          <button
            type="button"
            class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:border-slate-500"
            @click="detailModal.open = false"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { useIssueStore } from '@/stores/issueStore'
import { useTutorStudentStore } from '@/stores/tutorStudent'
import { useStudentStore } from '@/stores/student'
import type { Issue, FormModalState, Attachment } from '@/types/issue'

const route = useRoute()
const issueStore = useIssueStore()
const toast = useToastStore()
const tutorStudentStore = useTutorStudentStore()
const studentStore = useStudentStore()

const context = computed<'admin' | 'company' | 'student' | 'tutor'>(() => {
  const raw = String(route.path || '')
  if (raw.includes('/admin')) return 'admin'
  if (raw.includes('/tutor')) return 'tutor'
  if (raw.includes('/student')) return 'student'
  return 'tutor'
})
const canCreateIssue = true
const canReopenIssues = computed(() => {
  return context.value !== 'company'
})
const allowedEditableStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'] as Issue['status'][]

const formUsers = [
  { id: 1, name: 'Tutor User', role: 'Tutor' },
  { id: 2, name: 'Student User', role: 'Student' },
  { id: 3, name: 'Company Rep', role: 'Company Representative' },
]

const tutorStudents = computed(() => {
  return tutorStudentStore.students.map((s) => ({
    id: Number(s.id),
    name: s.name,
  }))
})

const allStudents = computed(() => {
  return studentStore.students.map((s) => ({
    id: Number(s.id),
    name: s.name,
  }))
})

const validationErrors = computed(() => {
  const errs: string[] = []
  if (!formModal.form.title?.trim()) errs.push('Title is required.')
  if (!formModal.form.description?.trim()) errs.push('Description is required.')
  if (!formModal.form.priority) errs.push('Priority is required.')

  if (context.value === 'tutor') {
    if (!formModal.form.status) errs.push('Status is required.')
    if (!formModal.form.studentId) errs.push('Please select a student to assign the issue to.')
  } else if (context.value === 'admin') {
    if (!formModal.form.status) errs.push('Status is required.')
    if (!formModal.form.studentId) errs.push('Please select a student for the issue.')
  }
  return errs
})

const existingAttachments = computed<Attachment[]>(() => {
  if (formModal.mode === 'update' && formModal.item?.attachmentList) {
    return formModal.item.attachmentList
  }
  return []
})

const localSearch = ref('')
const localStatus = ref('')
const localPriority = ref('')
watch([localSearch, localStatus, localPriority], ([search, status, priority]) => {
  issueStore.setFilters({ search, status, priority })
})

onMounted(async () => {
  await issueStore.fetchIssues()
  await issueStore.fetchIssueStats()
  // Fetch students for the create/edit modal student dropdown
  if (context.value === 'tutor') {
    tutorStudentStore.fetchStudents({ per_page: 100 })
  } else if (context.value === 'admin') {
    studentStore.fetchStudents({ per_page: 200 })
  }
})

async function retry() {
  await issueStore.fetchIssues()
  await issueStore.fetchIssueStats()
}

const totalItems = computed(() => issueStore.pagination.totalItems)
const totalPages = computed(() => issueStore.pagination.totalPages)
const page = computed({
  get: () => issueStore.pagination.page,
  set: (p: number) => issueStore.setPage(p),
})
const displayRange = computed(() => {
  const start = totalItems.value === 0 ? 0 : (page.value - 1) * 6 + 1
  const end = Math.min(page.value * 6, totalItems.value)
  return `${start}–${end}`
})

const visiblePages = computed(() => {
  const tp = totalPages.value
  const current = page.value
  if (tp <= 7) return Array.from({ length: tp }, (_, i) => i + 1)
  const pages: number[] = []
  if (current > 3) pages.push(1, current - 1, current)
  else pages.push(1, 2, 3)

  if (current < tp - 2) pages.push(tp)
  else pages.push(tp - 2, tp)
  return Array.from(new Set(pages))
})

const formModal = reactive<FormModalState>({
  open: false,
  mode: 'create',
  item: undefined,
  form: {
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Open',
    studentId: '',
    assignedUserId: '',
    dueDate: '',
    files: [],
  },
})

const detailModal = reactive<{ open: boolean; item: Issue }>({
  open: false,
  item: {
    id: '',
    title: '',
    description: '',
    reporter: '',
    assignedTo: '',
    createdAt: '',
    updatedAt: '',
    status: 'Open',
    priority: 'Low',
    attachments: undefined,
    history: [],
  },
})

const fileInputRef = ref<HTMLInputElement | null>(null)
const showValidationErrors = ref(false)

const submitDisabled = computed(() => {
  const form = formModal.form
  const allowed = allowedEditableStatuses.includes((form.status as Issue['status']) || 'Open')
  return !allowed
})

function applyFilters() {
  issueStore.setFilters({})
}

function resetFilters() {
  localSearch.value = ''
  localStatus.value = ''
  localPriority.value = ''
  issueStore.resetFilters()
}

function removeFile(index: number) {
  formModal.form.files.splice(index, 1)
}

function openCreateModal() {
  showValidationErrors.value = false
  formModal.mode = 'create'
  formModal.item = undefined
  formModal.form = {
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Open',
    studentId: '',
    assignedUserId: '',
    dueDate: '',
    files: [],
  }
  formModal.open = true
}

async function openEditModal(issue: Issue) {
  showValidationErrors.value = false
  // Fetch full detail from tutor-specific endpoint
  const fullIssue = await issueStore.fetchTutorIssueById(issue.id)

  formModal.mode = 'update'
  formModal.item = fullIssue || issue
  formModal.form = {
    title: (fullIssue || issue).title,
    description: (fullIssue || issue).description,
    priority: (fullIssue || issue).priority,
    status: (fullIssue || issue).status,
    studentId: (fullIssue || issue).studentId ?? '',
    assignedUserId: (fullIssue || issue).assignedUserId ?? '',
    dueDate: (fullIssue || issue).due_date ?? '',
    files: [],
  }
  formModal.open = true
}

function openUpdateModal(issue: Issue) {
  showValidationErrors.value = false
  const assignee = formUsers.find((user) => issue.assignedTo.includes(user.name))
  formModal.mode = 'update'
  formModal.item = issue
  formModal.form = {
    title: issue.title,
    description: issue.description,
    priority: issue.priority,
    status: issue.status,
    studentId: '',
    assignedUserId: assignee ? assignee.id : '',
    dueDate: '',
    files: [],
  }
  formModal.open = true
}

function openAssignModal(issue: Issue) {
  openUpdateModal(issue)
}

async function submitForm() {
  showValidationErrors.value = true
  if (validationErrors.value.length > 0) {
    return
  }

  if (formModal.mode === 'create') {
    formModal.form.status = (formModal.form.status || 'Open') as Issue['status']
    const created = await issueStore.createIssue({ form: formModal.form })
    if (created) {
      toast.success('Issue created successfully.', 'Created')
      closeFormModal()
    }
  } else if (formModal.item) {
    if (context.value === 'tutor' && formModal.mode === 'update') {
      // Use tutor-specific update endpoint
      const updated = await issueStore.updateTutorIssue({
        id: formModal.item.id,
        title: formModal.form.title,
        description: formModal.form.description,
        priority: formModal.form.priority as string,
        status: formModal.form.status as string,
        student_id: formModal.form.studentId,
        assigned_user_id: formModal.form.assignedUserId || null,
        due_date: formModal.form.dueDate || null,
      })
      if (updated) {
        closeFormModal()
      }
    } else {
      const updated = await issueStore.updateIssue({ id: formModal.item.id, form: formModal.form })
      if (updated) {
        toast.success('Issue updated successfully.', 'Updated')
        closeFormModal()
      }
    }
  }
}

async function resolveIssue(issue: Issue) {
  const updated = await issueStore.resolveIssue(issue.id)
  if (updated) {
    toast.success('Issue updated successfully.', 'Resolved')
  }
}

function closeFormModal() {
  showValidationErrors.value = false
  formModal.open = false
}

async function openDetail(issue: Issue) {
  const found = issueStore.issues.find((x) => x.id === issue.id)
  if (!found?.history || found.history.length === 0) {
    await issueStore.fetchIssueById(issue.id)
  }
  detailModal.item = found || issue
  detailModal.open = true
}

function handleFiles(event: Event) {
  const files = (event.target as HTMLInputElement | null)?.files
  if (!files) return
  const newFiles = Array.from(files)
  formModal.form.files = [...formModal.form.files, ...newFiles]
}

function closedOnlyView(issue: Issue | undefined) {
  if (!issue) return false
  if (!canReopenIssues.value) return issue.status === 'Closed'
  return issue.status === 'Closed'
}

function format(value: string | undefined): string {
  if (!value) return '-'
  return value
}

function formatFileSize(bytes: number): string {
  if (!bytes) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

function statusBadgeClasses(status: string) {
  const map: Record<string, string> = {
    Open: 'bg-green-50 text-green-700',
    'In Progress': 'bg-[#2563EB]/10 text-[#2563EB]',
    Resolved: 'bg-emerald-50 text-emerald-700',
    Closed: 'bg-gray-100 text-gray-700',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

function priorityBadgeClasses(priority: string) {
  const map: Record<string, string> = {
    Critical: 'bg-red-50 text-red-700',
    High: 'bg-orange-50 text-orange-700',
    Medium: 'bg-yellow-50 text-yellow-700',
    Low: 'bg-green-50 text-green-700',
  }
  return map[priority] || 'bg-gray-100 text-gray-700'
}
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
