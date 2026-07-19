<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Issue Management</h1>
        <p class="mt-1 text-sm text-slate-500">
          Track, assign, update, and resolve internship project issues.
        </p>
      </div>
      <button
        v-if="canCreateIssue"
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:translate-y-0.5 hover:shadow"
        @click="openCreateModal"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Report New Issue
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in issueStore.statsItems"
        :key="stat.label"
        class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500">{{ stat.label }}</p>
            <p class="mt-1 text-2xl font-bold text-gray-900">{{ stat.value }}</p>
          </div>
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl text-white transition-transform duration-200 group-hover:scale-110"
            :class="stat.color"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-if="issueStore.error" class="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
      <p class="text-sm font-medium text-red-700">{{ issueStore.error }}</p>
      <button class="self-start rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100" @click="retry">
        Retry
      </button>
    </div>

    <!-- Filters -->
    <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div class="lg:col-span-2">
          <label class="mb-1 block text-xs font-semibold text-slate-500">Search</label>
          <input
            v-model="localSearch"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            placeholder="Search by title..."
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-slate-500">Status</label>
          <select
            v-model="localStatus"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
          >
            <option value="">All</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-slate-500">Priority</label>
          <select
            v-model="localPriority"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
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
            class="rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-gray-50"
            @click="resetFilters"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="issueStore.loading" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div v-for="i in 6" :key="i" class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="h-4 w-24 animate-pulse rounded bg-gray-100" />
        <div class="mt-4 h-5 w-3/4 animate-pulse rounded bg-gray-100" />
        <div class="mt-3 h-3 w-full animate-pulse rounded bg-gray-100" />
        <div class="mt-3 h-3 w-5/6 animate-pulse rounded bg-gray-100" />
        <div class="mt-5 h-9 w-full animate-pulse rounded-xl bg-gray-100" />
      </div>
    </div>

    <!-- Issue cards -->
    <div v-else-if="issueStore.paginatedIssues.length" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="issue in issueStore.paginatedIssues"
        :key="issue.id"
        class="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="flex items-start justify-between">
          <span class="inline-flex items-center rounded-lg bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
            {{ issue.id }}
          </span>
          <span
            class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
            :class="statusBadgeClasses(issue.status)"
          >
            {{ issue.status }}
          </span>
        </div>

        <h3 class="mt-3 text-base font-bold leading-snug text-gray-900">
          {{ issue.title }}
        </h3>
        <p class="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-2">
          {{ issue.description }}
        </p>

        <div class="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <div class="flex items-center gap-1.5">
            <svg class="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span class="font-medium text-gray-700">{{ issue.reporter }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <svg class="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="text-gray-700">{{ issue.assignedTo }}</span>
          </div>
        </div>

        <div class="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span class="flex items-center gap-1.5">
            <svg class="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {{ format(issue.createdAt) }}
          </span>
          <span class="flex items-center gap-1.5">
            <svg class="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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

        <div v-if="issue.attachments && issue.attachments > 0" class="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <svg class="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 000 2.828 2 2 0 002.828 0L18 10m0 0h-6m6 0v6" />
          </svg>
          {{ issue.attachments }} attachment{{ issue.attachments === 1 ? '' : 's' }}
        </div>

        <div class="mt-5 grid grid-cols-5 gap-2">
          <button
            class="rounded-xl border border-gray-200 px-2 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-gray-50"
            @click="openDetail(issue)"
          >
            View
          </button>
          <button
            class="rounded-xl bg-[#2563EB] px-2 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#2258e0] disabled:opacity-70"
            :disabled="closedOnlyView(issue)"
            @click="openUpdateModal(issue)"
          >
            Update
          </button>
          <button
            class="rounded-xl bg-[#7C3AED] px-2 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#6a2fd9] disabled:opacity-70"
            :disabled="closedOnlyView(issue)"
            @click="openAssignModal(issue)"
          >
            Assign
          </button>
          <button
            class="rounded-xl bg-[#22C55E] px-2 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#16a34a] disabled:opacity-70"
            :disabled="closedOnlyView(issue)"
            @click="resolveIssue(issue)"
          >
            Resolve
          </button>
          <button
            class="rounded-xl bg-red-600 px-2 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-70"
            :disabled="closedOnlyView(issue)"
            @click="deleteIssue(issue)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!issueStore.loading && issueStore.isEmpty" class="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-14 text-center">
      <svg class="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3 class="mt-4 text-lg font-semibold text-gray-900">No Issues Found</h3>
      <p class="mt-2 max-w-md text-sm text-slate-500">
        There are currently no reported issues. Click the button below to create the first issue.
      </p>
      <button
        v-if="canCreateIssue"
        class="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2258e0]"
        @click="openCreateModal"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Report New Issue
      </button>
    </div>

    <!-- Pagination -->
    <div
      v-if="issueStore.pagination.totalPages > 1"
      class="flex flex-col items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 sm:flex-row sm:px-6"
    >
      <p class="text-xs text-slate-500">
        Showing
        <span class="font-semibold text-gray-700">{{ displayRange }}</span>
        of
        <span class="font-semibold text-gray-700">{{ issueStore.pagination.totalItems }}</span>
        issues
      </p>
      <div class="flex items-center gap-2">
        <button
          class="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
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
            :class="p === issueStore.pagination.page ? 'bg-[#2563EB] text-white' : 'text-slate-700 hover:bg-gray-100'"
            @click="issueStore.setPage(p)"
          >
            {{ p }}
          </button>
        </div>
        <button
          class="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
          :disabled="issueStore.pagination.page === issueStore.pagination.totalPages"
          @click="issueStore.setPage(issueStore.pagination.page + 1)"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Create / Update Modal -->
    <div v-if="formModal.open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="w-[92%] max-w-[700px] rounded-2xl bg-white shadow-2xl">
        <div class="border-b border-gray-100 px-5 py-4">
          <h2 class="text-lg font-bold text-gray-900">{{ formModal.mode === 'create' ? 'New Issue' : 'Update Issue' }}</h2>
          <p class="mt-0.5 text-xs text-slate-500">Fill in the issue details below to keep shared progress clear.</p>
        </div>
        <div class="max-h-[calc(100dvh-96px)] space-y-5 overflow-y-auto px-5 py-5">
          <div>
            <label class="mb-1 block text-xs font-semibold text-slate-500">Issue Title <span class="text-red-500">*</span></label>
            <input
              v-model="formModal.form.title"
              class="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="closedOnlyView(formModal.item!)"
              placeholder="Enter issue title"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold text-slate-500">Description <span class="text-red-500">*</span></label>
            <textarea
              v-model="formModal.form.description"
              class="h-32 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="closedOnlyView(formModal.item!)"
              placeholder="What's the issue?"
            />
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs font-semibold text-slate-500">Priority <span class="text-red-500">*</span></label>
              <select
                v-model="formModal.form.priority"
                class="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="closedOnlyView(formModal.item!)"
              >
                <option value="">Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold text-slate-500">Status <span class="text-red-500">*</span></label>
              <select
                v-model="formModal.form.status"
                class="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="!allowedEditableStatuses.includes('Select status') || !canReopenIssues || (formModal.mode === 'update' && closedOnlyView(formModal.item!))"
              >
                <option v-for="status in allowedEditableStatuses" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </div>
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold text-slate-500">Assign To <span class="text-red-500">*</span></label>
            <select
              v-model="formModal.form.assignedUserId"
              class="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="formModal.mode === 'update' && closedOnlyView(formModal.item!)"
            >
              <option value="">Assign an available contact</option>
              <option v-for="user in formUsers" :key="user.id" :value="user.id">
                {{ user.name }} · {{ user.role }}
              </option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold text-slate-500">Due Date</label>
            <input
              v-model="formModal.form.dueDate"
              type="date"
              class="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="formModal.mode === 'update' && closedOnlyView(formModal.item!)"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold text-slate-500">Attachments</label>
            <button
              type="button"
              class="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 px-5 py-8 text-center text-xs text-slate-500 transition-colors hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-70"
              :disabled="formModal.mode === 'update' && closedOnlyView(formModal.item!)"
              @click="fileInputRef?.click()"
            >
              <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 000 2.828 2 2 0 002.828 0L18 10m0 0h-6m6 0v6" />
              </svg>
              <p class="mt-2 font-semibold">Drag & drop files here</p>
              <p class="mt-1">PDF, DOCX, PNG, ZIP</p>
            </button>
            <input
              ref="fileInputRef"
              type="file"
              multiple
              accept=".pdf,.docx,.png,.zip"
              class="hidden"
              @change="handleFiles"
            />
            <div v-if="formModal.form.files.length" class="mt-2 text-left text-xs text-slate-600">
              <span class="font-semibold">Attached:</span> {{ formModal.form.files.map((file: File) => file.name).join(', ') }}
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-4">
          <button
            class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-gray-50"
            @click="closeFormModal"
          >
            Cancel
          </button>
          <button
            class="rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2258e0] disabled:opacity-70"
            :disabled="submitDisabled || issueStore.loading"
            @click="submitForm"
          >
            {{ formModal.mode === 'create' ? 'Save Issue' : 'Update Issue' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="detailModal.open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="w-[92%] max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div class="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <div>
            <p class="text-xs font-semibold text-slate-500">{{ detailModal.item.id }}</p>
            <h2 class="text-lg font-bold text-gray-900">{{ detailModal.item.title }}</h2>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="statusBadgeClasses(detailModal.item.status)"
            >
              {{ detailModal.item.status }}
            </span>
            <span
              class="inline-flex items-center rounded-lg px-2 py-1 text-xs font-semibold"
              :class="priorityBadgeClasses(detailModal.item.priority)"
            >
              {{ detailModal.item.priority }}
            </span>
          </div>
        </div>
        <div class="max-h-[calc(100dvh-96px)] space-y-5 overflow-y-auto px-5 py-5">
          <p class="text-sm leading-relaxed text-slate-600">{{ detailModal.item.description }}</p>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Reporter</p>
              <p class="mt-1 text-sm font-semibold text-gray-900">{{ detailModal.item.reporter }}</p>
            </div>
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Assigned To</p>
              <p class="mt-1 text-sm font-semibold text-gray-900">{{ detailModal.item.assignedTo }}</p>
            </div>
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Created</p>
              <p class="mt-1 text-sm font-semibold text-gray-900">{{ detailModal.item.createdAt }}</p>
            </div>
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Updated</p>
              <p class="mt-1 text-sm font-semibold text-gray-900">{{ detailModal.item.updatedAt }}</p>
            </div>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-900">Activity Timeline</h3>
            <ol class="mt-3 space-y-4">
              <li v-for="event in detailModal.item.history || []" :key="event.time + event.text" class="flex gap-3">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563EB]/10">
                  <svg class="h-4 w-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ event.text }}</p>
                  <p class="text-xs text-slate-500">{{ event.time }} · {{ event.user }}</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
        <div class="border-t border-gray-100 px-5 py-4 text-right">
          <button
            class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-gray-50"
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
import api from '@/services/api'
import { useToastStore } from '@/stores/toast'
import { useIssueStore } from '@/stores/issueStore'
import type { Issue, FormModalState } from '@/types/issue'

const route = useRoute()
const issueStore = useIssueStore()
const toast = useToastStore()

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

const formUsers = ref<Array<{ id: number; name: string; role: string }>>([])

const localSearch = ref('')
const localStatus = ref('')
const localPriority = ref('')
watch([localSearch, localStatus, localPriority], ([search, status, priority]) => {
  issueStore.setFilters({ search, status, priority })
})

onMounted(async () => {
  await issueStore.fetchIssues()
  await issueStore.fetchIssueStats()
  await loadStudents()
})

async function retry() {
  await issueStore.fetchIssues()
  await issueStore.fetchIssueStats()
}

async function loadStudents() {
  try {
    const res = await api.get('/tutor/students')
    formUsers.value = (res.data.data || []).map((s: any) => ({ id: s.id, name: s.name, role: 'Student' }))
  } catch {
    // silently fail; form will show empty assignee list
  }
}

const totalItems = computed(() => issueStore.pagination.totalItems)
const totalPages = computed(() => issueStore.pagination.totalPages)
const page = computed({ get: () => issueStore.pagination.page, set: (p: number) => issueStore.setPage(p) })
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

const submitDisabled = computed(() => {
  const form = formModal.form
  const status = (form.status as Issue['status']) || 'Open'
  const allowed = allowedEditableStatuses.includes(status)
  return !form.title || !form.description || !form.priority || !form.assignedUserId || !allowed
})

function applyFilters() {
  issueStore.setFilters({
    search: localSearch.value,
    status: localStatus.value,
    priority: localPriority.value,
  })
}

function resetFilters() {
  localSearch.value = ''
  localStatus.value = ''
  localPriority.value = ''
  issueStore.resetFilters()
}

function openCreateModal() {
  formModal.mode = 'create'
  formModal.item = undefined
  formModal.form = {
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Open',
    assignedUserId: '',
    dueDate: '',
    files: [],
  }
  formModal.open = true
}

function openUpdateModal(issue: Issue) {
  const assignee = formUsers.value.find((user) => issue.assignedTo.includes(user.name))
  formModal.mode = 'update'
  formModal.item = issue
  formModal.form = {
    title: issue.title,
    description: issue.description,
    priority: issue.priority,
    status: issue.status,
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
  if (formModal.mode === 'create') {
    formModal.form.status = (formModal.form.status || 'Open') as Issue['status']
    const created = await issueStore.createIssue({ form: formModal.form })
    if (created) {
      toast.success('Issue created successfully.', 'Created')
      closeFormModal()
    }
  } else if (formModal.item) {
    const updated = await issueStore.updateIssue({ id: formModal.item.id, form: formModal.form })
    if (updated) {
      toast.success('Issue updated successfully.', 'Updated')
      closeFormModal()
    }
  }
}

async function resolveIssue(issue: Issue) {
  const updated = await issueStore.resolveIssue(issue.id)
  if (updated) {
    toast.success('Issue resolved successfully.', 'Resolved')
  }
}

async function deleteIssue(issue: Issue) {
  if (!confirm(`Delete issue #${issue.id}? This action cannot be undone.`)) return
  const deleted = await issueStore.deleteIssue(issue.id)
  if (deleted) {
    toast.success('Issue deleted successfully.', 'Deleted')
  }
}

function closeFormModal() {
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
  formModal.form.files = Array.from(files)
}

function closedOnlyView(issue: Issue | undefined) {
  if (!issue) return false
  return issue.status === 'Closed'
}

function format(value: string | undefined): string {
  if (!value) return '-'
  return value
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
