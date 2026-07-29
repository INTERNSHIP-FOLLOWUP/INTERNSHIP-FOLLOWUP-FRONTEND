<template>
  <div class="space-y-6">
    <!-- ════════════════════════════════════════════
         Header
         ════════════════════════════════════════════ -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-[#111827]">My Internship Issues</h1>
        <p class="mt-1 text-sm text-[#6B7280]">
          Report challenges or issues during your internship and track tutor resolution.
        </p>
      </div>
      <button
        type="button"
        @click="openCreateModal"
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#2563EB]/20 transition-all duration-200 hover:bg-[#1D4ED8] hover:shadow-md active:scale-[0.97]"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Report New Issue
      </button>
    </div>

    <!-- ════════════════════════════════════════════
         Statistics Cards
         ════════════════════════════════════════════ -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total -->
      <div class="group rounded-xl border border-[#E5E7EB] dark:bg-slate-800 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Total Issues</p>
            <p class="mt-1 text-2xl font-bold text-[#111827]">{{ stats.total }}</p>
          </div>
          <div class="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] dark:bg-slate-800 bg-white text-[#2563EB]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-[11px] text-[#9CA3AF]">All reported issues</p>
      </div>

      <!-- Open -->
      <div class="group rounded-xl border border-[#E5E7EB] dark:bg-slate-800 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Open</p>
            <p class="mt-1 text-2xl font-bold text-[#111827]">{{ stats.open }}</p>
          </div>
          <div class="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] dark:bg-slate-800 bg-white text-[#D97706]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-[11px] text-[#9CA3AF]">Awaiting response</p>
      </div>

      <!-- In Progress -->
      <div class="group rounded-xl border border-[#E5E7EB] dark:bg-slate-800 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-[#6B7280]">In Progress</p>
            <p class="mt-1 text-2xl font-bold text-[#111827]">{{ stats.inProgress }}</p>
          </div>
          <div class="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] dark:bg-slate-800 bg-white text-[#2563EB]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-[11px] text-[#9CA3AF]">Being reviewed</p>
      </div>

      <!-- Resolved -->
      <div class="group rounded-xl border border-[#E5E7EB] dark:bg-slate-800 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Resolved</p>
            <p class="mt-1 text-2xl font-bold text-[#111827]">{{ stats.resolved }}</p>
          </div>
          <div class="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] dark:bg-slate-800 bg-white text-[#10B981]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-[11px] text-[#9CA3AF]">Successfully resolved</p>
      </div>
    </div>

    <!-- ════════════════════════════════════════════
         Search & Filters Bar
         ════════════════════════════════════════════ -->
    <div class="rounded-xl border border-[#E5E7EB] dark:bg-slate-800 bg-white p-4 shadow-sm">
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative min-w-0 flex-1 basis-[220px]">
          <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#9CA3AF]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search issues..."
            class="h-9 w-full rounded-lg border border-[#E5E7EB] dark:bg-slate-800 bg-white py-2 pl-9 pr-8 text-sm text-[#111827] placeholder-[#9CA3AF] transition-all focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/10"
          />
          <button
            v-if="searchQuery.length > 0"
            type="button"
            @click="clearSearch"
            class="absolute inset-y-0 right-0 flex items-center pr-2.5 text-[#9CA3AF] hover:text-[#6B7280]"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M18 6 6 18" /><path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <select
          v-model="statusFilter"
          @change="onFilterChange"
          class="h-9 min-w-[130px] rounded-lg border border-[#E5E7EB] dark:bg-slate-800 bg-white px-3 text-sm text-[#111827] transition-all focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/10 appearance-none"
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          v-model="priorityFilter"
          @change="onFilterChange"
          class="h-9 min-w-[130px] rounded-lg border border-[#E5E7EB] dark:bg-slate-800 bg-white px-3 text-sm text-[#111827] transition-all focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/10 appearance-none"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button
          type="button"
          @click="resetFilters"
          class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E7EB] dark:bg-slate-800 bg-white px-3.5 text-sm font-medium text-[#6B7280] transition-all hover:border-[#EF4444]/30 hover:bg-[#FEF2F2] hover:text-[#EF4444] disabled:opacity-40"
          :disabled="!hasActiveFilters"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Reset
        </button>

        <button
          type="button"
          @click="refresh"
          :disabled="loading"
          class="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E7EB] dark:bg-slate-800 bg-white px-3.5 text-sm font-medium text-[#6B7280] transition-all hover:border-[#2563EB]/20 hover:bg-[#EFF6FF] hover:text-[#2563EB] disabled:opacity-50"
        >
          <svg class="h-3.5 w-3.5" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.023 9.348c4.183.626 6.977 3.26 6.977 7.053A7.5 7.5 0 119.75 1.5c4.232 0 7.273 2.527 7.273 5.848z" />
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- ════════════════════════════════════════════
         Content Area
         ════════════════════════════════════════════ -->

    <!-- Error State -->
    <div
      v-if="error"
      class="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center"
    >
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-[#EF4444]">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 class="mt-4 text-base font-semibold text-[#111827]">Failed to load issues</h3>
      <p class="mt-1 max-w-md text-sm text-[#6B7280]">{{ error }}</p>
      <button type="button" @click="refresh" class="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#1D4ED8]">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.023 9.348c4.183.626 6.977 3.26 6.977 7.053A7.5 7.5 0 119.75 1.5c4.232 0 7.273 2.527 7.273 5.848z" />
        </svg>
        Retry
      </button>
    </div>

    <!-- Loading Skeletons -->
    <div v-else-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="rounded-xl border border-[#E5E7EB] dark:bg-slate-800 bg-white p-5 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="h-8 w-8 animate-pulse rounded-full bg-[#E5E7EB]" />
          <div class="flex-1 space-y-2">
            <div class="h-3.5 w-1/3 animate-pulse rounded bg-[#E5E7EB]" />
            <div class="h-3 w-1/4 animate-pulse rounded bg-[#F3F4F6]" />
          </div>
        </div>
        <div class="mt-4 h-5 w-3/4 animate-pulse rounded bg-[#E5E7EB]" />
        <div class="mt-3 space-y-2">
          <div class="h-3 w-full animate-pulse rounded bg-[#E5E7EB]" />
          <div class="h-3 w-2/3 animate-pulse rounded bg-[#F3F4F6]" />
        </div>
        <div class="mt-4 flex gap-2">
          <div class="h-6 w-16 animate-pulse rounded-full bg-[#E5E7EB]" />
          <div class="h-6 w-20 animate-pulse rounded-full bg-[#E5E7EB]" />
        </div>
      </div>
    </div>

    <!-- Issue Cards -->
    <div v-else-if="paginatedIssues.length > 0" class="space-y-3">
      <div
        v-for="issue in paginatedIssues"
        :key="issue.id"
        class="group rounded-xl border border-[#E5E7EB] dark:bg-slate-800 bg-white shadow-sm transition-all duration-200 hover:border-[#2563EB]/20 hover:shadow-md"
      >
        <div class="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-start gap-3">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-bold text-[#2563EB]">
                {{ getInitials(issue.reporter || issue.studentName || 'You') }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-sm font-semibold text-[#111827]">{{ issue.title }}</h3>
                  <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="statusBadgeClass(issue.status)">
                    {{ issue.status }}
                  </span>
                  <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="priorityBadgeClass(issue.priority)">
                    {{ issue.priority }}
                  </span>
                </div>
                <p class="mt-1.5 text-sm leading-relaxed text-[#6B7280] line-clamp-2">{{ issue.description }}</p>
                <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#9CA3AF]">
                  <span class="flex items-center gap-1">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ formatDate(issue.createdAt) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {{ formatDate(issue.updatedAt) }}
                  </span>
                  <span v-if="issue.assignedTo && issue.assignedTo !== 'Unassigned'" class="flex items-center gap-1">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {{ issue.assignedTo }}
                  </span>
                  <span v-if="issue.attachments && issue.attachments > 0" class="flex items-center gap-1">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 000 2.828 2 2 0 002.828 0L18 10m0 0h-6m6 0v6" />
                    </svg>
                    {{ issue.attachments }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex shrink-0 items-center gap-2 sm:flex-col">
            <button
              type="button"
              @click="openDetail(issue)"
              class="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] dark:bg-slate-800 bg-white px-3 py-1.5 text-xs font-semibold text-[#6B7280] transition-all hover:border-[#2563EB]/30 hover:bg-[#EFF6FF] hover:text-[#2563EB]"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </button>
            <button
              v-if="issue.status === 'Open'"
              type="button"
              @click="openEditModal(issue)"
              class="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#1D4ED8]"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!loading"
      class="flex flex-col items-center justify-center rounded-xl border border-[#E5E7EB] dark:bg-slate-800 bg-white px-6 py-20 text-center"
    >
      <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F9FAFB]">
        <svg class="h-8 w-8 text-[#D1D5DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 class="mt-4 text-base font-semibold text-[#111827]">
        {{ hasActiveFilters ? 'No matching issues' : 'No issues reported' }}
      </h3>
      <p class="mt-1 max-w-sm text-sm text-[#6B7280]">
        {{ hasActiveFilters
          ? 'No issues match your current filters. Try adjusting your search or filter criteria.'
          : 'You haven\'t reported any issues yet. Click "Report New Issue" to get started.'
        }}
      </p>
      <button
        v-if="!hasActiveFilters"
        type="button"
        @click="openCreateModal"
        class="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#1D4ED8]"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Report New Issue
      </button>
    </div>

    <!-- ════════════════════════════════════════════
         Pagination
         ════════════════════════════════════════════ -->
    <div
      v-if="totalPages > 1"
      class="flex flex-col items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] dark:bg-slate-800 bg-white px-4 py-3 shadow-sm sm:flex-row"
    >
      <p class="text-xs text-[#6B7280]">
        Showing <span class="font-semibold text-[#111827]">{{ displayRange }}</span> of <span class="font-semibold text-[#111827]">{{ filteredIssues.length }}</span> issues
      </p>
      <div class="flex items-center gap-2">
        <button class="rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-xs font-semibold text-[#6B7280] transition-colors hover:dark:bg-slate-700 bg-gray-50 disabled:opacity-60" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">Previous</button>
        <template v-for="(page, idx) in visiblePages" :key="idx">
          <span v-if="page === '...'" class="flex h-7 w-7 items-center justify-center text-xs text-[#9CA3AF] select-none">…</span>
          <button
            v-else
            @click="goToPage(page as number)"
            class="flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg px-1.5 text-xs font-semibold transition-colors"
            :class="page === currentPage ? 'bg-[#2563EB] text-white' : 'text-[#6B7280] hover:dark:bg-slate-600 bg-gray-100'"
          >{{ page }}</button>
        </template>
        <button class="rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-xs font-semibold text-[#6B7280] transition-colors hover:dark:bg-slate-700 bg-gray-50 disabled:opacity-60" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">Next</button>
        <div class="ml-2 flex items-center gap-1.5">
          <label class="text-xs text-[#6B7280]">Rows</label>
          <select v-model="perPage" @change="onPerPageChange" class="h-7 rounded-lg border border-[#E5E7EB] dark:bg-slate-800 bg-white px-1.5 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/10">
            <option :value="6">6</option>
            <option :value="12">12</option>
            <option :value="24">24</option>
          </select>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════════════════════
         Create Issue Modal
         ════════════════════════════════════════════ -->
    <teleport to="body">
      <div
        v-if="createModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
        @click.self="closeCreateModal"
      >
        <div class="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl dark:bg-slate-800 bg-white shadow-2xl overflow-hidden border dark:border-slate-700 border-slate-100 animate-in">
          <!-- Header -->
          <div class="flex shrink-0 items-center justify-between border-b dark:border-slate-700 border-slate-100 px-5 py-4">
            <div>
              <h2 class="text-base font-semibold dark:text-slate-100 text-slate-900">{{ editingIssueId ? 'Edit Issue' : 'Report New Issue' }}</h2>
              <p class="mt-0.5 text-xs dark:dark:text-slate-500 text-slate-400 text-slate-500">{{ editingIssueId ? 'Update the details of your reported issue.' : 'Describe the challenge you\'re facing during your internship.' }}</p>
            </div>
            <button type="button" class="rounded-lg p-1.5 dark:text-slate-500 text-slate-400 hover:dark:bg-slate-600 bg-slate-100 hover:dark:text-slate-400 text-slate-600 transition-colors" @click="closeCreateModal">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            <!-- Title -->
            <div>
              <label class="mb-1 block text-xs font-semibold dark:text-slate-200 text-slate-700">Issue Title <span class="text-red-500">*</span></label>
              <input
                v-model="form.title"
                class="w-full rounded-lg border dark:border-slate-600 border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
                placeholder="What's the issue about?"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="mb-1 block text-xs font-semibold dark:text-slate-200 text-slate-700">Description <span class="text-red-500">*</span></label>
              <textarea
                v-model="form.description"
                rows="4"
                class="w-full rounded-lg border dark:border-slate-600 border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 resize-none"
                placeholder="Describe the issue in detail..."
              />
            </div>

            <!-- Priority -->
            <div>
              <label class="mb-1 block text-xs font-semibold dark:text-slate-200 text-slate-700">Priority <span class="text-red-500">*</span></label>
              <select
                v-model="form.priority"
                class="w-full rounded-lg border dark:border-slate-600 border-slate-200 dark:bg-slate-800 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <!-- Attachments -->
            <div>
              <label class="mb-1 block text-xs font-semibold dark:text-slate-200 text-slate-700">Attachments</label>
              <button
                type="button"
                class="group flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed dark:border-slate-600 border-slate-200 p-4 text-center transition-all hover:border-[#2563EB] hover:bg-blue-50/40 dark:bg-slate-700 bg-slate-50/40"
                @click="fileInputRef?.click()"
              >
                <div class="flex h-8 w-8 items-center justify-center rounded-full dark:bg-slate-600 bg-slate-100 dark:text-slate-500 text-slate-400 group-hover:bg-blue-100 group-hover:text-[#2563EB] transition-colors">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 000 2.828 2 2 0 002.828 0L18 10m0 0h-6m6 0v6" />
                  </svg>
                </div>
                <p class="mt-1.5 text-xs font-semibold dark:text-slate-400 text-slate-600 group-hover:text-[#2563EB]">Click to upload files</p>
                <p class="text-[11px] dark:text-slate-500 text-slate-400">PDF, DOCX, PNG, ZIP</p>
              </button>
              <input ref="fileInputRef" type="file" multiple accept=".pdf,.docx,.png,.zip" class="hidden" @change="handleFiles" />
              <div v-if="form.files.length > 0" class="mt-2 space-y-1">
                <div v-for="(file, idx) in form.files" :key="file.name + idx" class="flex items-center justify-between rounded-lg border dark:border-slate-600 border-slate-200 dark:bg-slate-700 bg-slate-50 px-3 py-1.5 text-xs dark:text-slate-200 text-slate-700">
                  <span class="truncate font-medium">{{ file.name }}</span>
                  <button type="button" class="ml-2 dark:text-slate-500 text-slate-400 hover:text-red-500" @click="removeFile(idx)">&times;</button>
                </div>
              </div>
            </div>

            <!-- Validation errors -->
            <div v-if="formErrors.length > 0" class="rounded-lg border border-red-200 bg-red-50 p-3">
              <ul class="space-y-0.5">
                <li v-for="err in formErrors" :key="err" class="text-xs text-red-600 flex items-center gap-1.5">
                  <svg class="h-3 w-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  {{ err }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex shrink-0 items-center justify-end gap-2.5 border-t dark:border-slate-700 border-slate-100 dark:bg-slate-700 bg-slate-50/50 px-5 py-3.5">
            <button type="button" class="rounded-lg border dark:border-slate-600 border-slate-200 dark:bg-slate-800 bg-white px-4 py-2 text-sm font-semibold dark:text-slate-200 text-slate-700 transition-all hover:dark:bg-slate-700 bg-slate-50" @click="closeCreateModal">Cancel</button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1D4ED8] active:scale-[0.97] disabled:opacity-60"
              :disabled="submitting"
              @click="submitIssue"
            >
              <svg v-if="submitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {{ submitting ? 'Submitting...' : (editingIssueId ? 'Update Issue' : 'Submit Issue') }}
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- ════════════════════════════════════════════
         Detail Modal
         ════════════════════════════════════════════ -->
    <teleport to="body">
      <div
        v-if="detailOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
        @click.self="closeDetail"
      >
        <div class="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl dark:bg-slate-800 bg-white shadow-2xl overflow-hidden border dark:border-slate-700 border-slate-100 animate-in">
          <!-- Header -->
          <div class="flex shrink-0 items-start justify-between gap-3 border-b dark:border-slate-700 border-slate-100 px-5 py-4">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 text-xs dark:text-slate-500 text-slate-400">
                <span class="font-mono font-semibold">{{ detailIssue.id }}</span>
                <span class="text-slate-300">·</span>
                <span>{{ formatDate(detailIssue.createdAt) }}</span>
              </div>
              <h2 class="mt-1 text-base font-semibold dark:text-slate-100 text-slate-900 truncate">{{ detailIssue.title }}</h2>
            </div>
            <div class="flex shrink-0 items-center gap-1.5">
              <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="statusBadgeClass(detailIssue.status)">{{ detailIssue.status }}</span>
              <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="priorityBadgeClass(detailIssue.priority)">{{ detailIssue.priority }}</span>
              <button type="button" class="ml-1 rounded-lg p-1 dark:text-slate-500 text-slate-400 hover:dark:bg-slate-600 bg-slate-100 hover:dark:text-slate-400 text-slate-600" @click="closeDetail">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            <p class="text-sm leading-relaxed dark:text-slate-400 text-slate-600 whitespace-pre-wrap">{{ detailIssue.description }}</p>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div class="rounded-lg border dark:border-slate-700 border-slate-100 dark:bg-slate-700 bg-slate-50/50 p-3.5">
                <p class="text-[11px] font-semibold uppercase tracking-wide dark:text-slate-500 text-slate-400">Reporter</p>
                <p class="mt-0.5 text-sm font-semibold dark:text-slate-100 text-slate-900">{{ detailIssue.reporter }}</p>
              </div>
              <div class="rounded-lg border dark:border-slate-700 border-slate-100 dark:bg-slate-700 bg-slate-50/50 p-3.5">
                <p class="text-[11px] font-semibold uppercase tracking-wide dark:text-slate-500 text-slate-400">Assigned To</p>
                <p class="mt-0.5 text-sm font-semibold dark:text-slate-100 text-slate-900">{{ detailIssue.assignedTo || 'Unassigned' }}</p>
              </div>
            </div>

            <!-- Attachments -->
            <div v-if="detailIssue.attachmentList && detailIssue.attachmentList.length > 0">
              <h3 class="text-xs font-semibold dark:text-slate-200 text-slate-700 mb-2">Attachments</h3>
              <div class="space-y-1.5">
                <a
                  v-for="att in detailIssue.attachmentList"
                  :key="att.id || att.filename"
                  :href="att.url || att.file_path"
                  target="_blank"
                  class="flex items-center gap-2.5 rounded-lg border dark:border-slate-600 border-slate-200 dark:bg-slate-700 bg-slate-50/50 px-3.5 py-2.5 text-sm transition-all hover:border-[#2563EB]/30 hover:bg-[#EFF6FF] group"
                >
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg dark:bg-slate-800 bg-white dark:text-slate-500 text-slate-400 group-hover:text-[#2563EB]">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 000 2.828 2 2 0 002.828 0L18 10m0 0h-6m6 0v6" />
                    </svg>
                  </div>
                  <span class="flex-1 font-medium dark:text-slate-200 text-slate-700 group-hover:text-[#2563EB] truncate">{{ att.filename }}</span>
                  <svg class="h-4 w-4 shrink-0 dark:text-slate-500 text-slate-400 group-hover:text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            <!-- Timeline -->
            <div>
              <h3 class="text-xs font-semibold dark:text-slate-200 text-slate-700 mb-3">Activity Timeline</h3>
              <div v-if="detailIssue.history && detailIssue.history.length > 0" class="relative">
                <div class="absolute left-3.5 top-0 bottom-0 w-px dark:bg-slate-600 bg-slate-200" />
                <div class="space-y-4">
                  <div v-for="(event, idx) in detailIssue.history" :key="idx" class="relative flex gap-3 pl-9">
                    <div class="absolute left-2.5 top-1 h-2.5 w-2.5 rounded-full border-2" :class="idx === 0 ? 'border-[#2563EB] bg-[#2563EB]' : 'border-slate-300 dark:bg-slate-800 bg-white'" />
                    <div>
                      <p class="text-sm font-medium dark:text-slate-100 text-slate-900">{{ event.text }}</p>
                      <p class="text-xs dark:dark:text-slate-500 text-slate-400 text-slate-500 mt-0.5">{{ event.user }} · {{ formatDate(event.time) }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else class="text-sm dark:text-slate-500 text-slate-400 italic">No activity recorded yet.</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex shrink-0 items-center justify-end border-t dark:border-slate-700 border-slate-100 dark:bg-slate-700 bg-slate-50/50 px-5 py-3">
            <button type="button" class="rounded-lg border dark:border-slate-600 border-slate-200 dark:bg-slate-800 bg-white px-4 py-2 text-sm font-semibold dark:text-slate-200 text-slate-700 transition-all hover:dark:bg-slate-700 bg-slate-50" @click="closeDetail">Close</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { issueService } from '@/services/issueService'
import { useIssueStore } from '@/stores/issueStore'
import { useToastStore } from '@/stores/toast'
import type { Issue, IssueStats } from '@/types/issue'

const issueStore = useIssueStore()
const toast = useToastStore()

// ── State ──
const allIssues = ref<Issue[]>([])
const loading = ref(false)
const submitting = ref(false)
const error = ref<string | null>(null)
const stats = ref<IssueStats>({ total: 0, open: 0, inProgress: 0, resolved: 0 })

// Filters
const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')

// Pagination
const currentPage = ref(1)
const perPage = ref(6)

// Create/Edit Modal
const createModalOpen = ref(false)
const editingIssueId = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const form = ref({
  title: '',
  description: '',
  priority: 'Medium',
  files: [] as File[],
})
const formErrors = ref<string[]>([])

// Detail Modal
const detailOpen = ref(false)
const detailIssue = ref<Issue>({
  id: '', title: '', description: '', reporter: '', studentName: '',
  assignedTo: '', createdAt: '', updatedAt: '', status: 'Open', priority: 'Low',
  attachments: undefined, attachmentList: [], history: [],
})

// ── Computed ──
const hasActiveFilters = computed(() => searchQuery.value.length > 0 || statusFilter.value !== '' || priorityFilter.value !== '')

const filteredIssues = computed(() => {
  let list = allIssues.value
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(i => i.title.toLowerCase().includes(q) || (i.reporter || '').toLowerCase().includes(q))
  }
  if (statusFilter.value) list = list.filter(i => i.status === statusFilter.value)
  if (priorityFilter.value) list = list.filter(i => i.priority === priorityFilter.value)
  return list
})

const paginatedIssues = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredIssues.value.slice(start, start + perPage.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredIssues.value.length / perPage.value)))

const visiblePages = computed(() => {
  const tp = totalPages.value
  const cur = currentPage.value
  if (tp <= 7) return Array.from({ length: tp }, (_, i) => i + 1)
  const pages: (number | string)[] = [1]
  if (cur > 3) pages.push('...')
  const start = Math.max(2, cur - 1)
  const end = Math.min(tp - 1, cur + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (cur < tp - 2) pages.push('...')
  pages.push(tp)
  return pages
})

const displayRange = computed(() => {
  const total = filteredIssues.value.length
  if (total === 0) return '0–0'
  const start = (currentPage.value - 1) * perPage.value + 1
  const end = Math.min(currentPage.value * perPage.value, total)
  return `${start}–${end}`
})

// ── Data Fetching ──
let debounceTimer: ReturnType<typeof setTimeout> | null = null

async function fetchAllIssues(filters?: { search?: string; status?: string; priority?: string }): Promise<void> {
  loading.value = true
  error.value = null
  try {
    const response = await issueService.getIssues({
      search: filters?.search ?? searchQuery.value,
      status: filters?.status ?? statusFilter.value,
      priority: filters?.priority ?? priorityFilter.value,
    })
    allIssues.value = response.data || []
    currentPage.value = 1
  } catch (err: unknown) {
    const parsed = err as { message?: string }
    error.value = parsed?.message || 'Failed to load issues.'
    toast.error(error.value, 'Load Failed')
  } finally {
    loading.value = false
  }
}

async function fetchStats(): Promise<void> {
  try {
    const data = await issueService.getIssueStats()
    stats.value = data
  } catch { /* keep last known values */ }
}

async function refresh(): Promise<void> {
  await fetchAllIssues()
  await fetchStats()
}

function goToPage(page: number): void {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onPerPageChange(): void { currentPage.value = 1 }
function onFilterChange(): void {
  currentPage.value = 1
  fetchAllIssues({ search: searchQuery.value, status: statusFilter.value, priority: priorityFilter.value })
}

watch(searchQuery, () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    currentPage.value = 1
    fetchAllIssues({ search: searchQuery.value, status: statusFilter.value, priority: priorityFilter.value })
  }, 350)
})

function clearSearch(): void {
  searchQuery.value = ''
  currentPage.value = 1
  fetchAllIssues()
}

function resetFilters(): void {
  searchQuery.value = ''
  statusFilter.value = ''
  priorityFilter.value = ''
  currentPage.value = 1
  fetchAllIssues()
}

// ── Create Modal ──
function openCreateModal(): void {
  editingIssueId.value = null
  form.value = { title: '', description: '', priority: 'Medium', files: [] }
  formErrors.value = []
  createModalOpen.value = true
}

function closeCreateModal(): void {
  editingIssueId.value = null
  createModalOpen.value = false
  formErrors.value = []
}

function handleFiles(event: Event): void {
  const files = (event.target as HTMLInputElement)?.files
  if (!files) return
  form.value.files = [...form.value.files, ...Array.from(files)]
}

function removeFile(index: number): void {
  form.value.files.splice(index, 1)
}

async function submitIssue(): Promise<void> {
  formErrors.value = []
  if (!form.value.title.trim()) formErrors.value.push('Title is required.')
  if (!form.value.description.trim()) formErrors.value.push('Description is required.')
  if (formErrors.value.length > 0) return

  submitting.value = true
  try {
    if (editingIssueId.value) {
      // Update existing issue — preserve original status
      const current = allIssues.value.find(i => i.id === editingIssueId.value)
      const result = await issueService.updateIssue(editingIssueId.value, {
        title: form.value.title,
        description: form.value.description,
        priority: form.value.priority as Issue['priority'],
        status: current?.status || 'Open',
        studentId: '',
        assignedUserId: '',
        dueDate: '',
        files: form.value.files,
      })
      if (result) {
        toast.success('Issue updated successfully.', 'Updated')
        closeCreateModal()
        await refresh()
      }
    } else {
      // Create new issue
      const result = await issueService.createIssue({
        title: form.value.title,
        description: form.value.description,
        priority: form.value.priority as Issue['priority'],
        status: 'Open',
        studentId: '',
        assignedUserId: '',
        dueDate: '',
        files: form.value.files,
      })
      if (result) {
        toast.success('Issue reported successfully! Your tutor will review it.', 'Submitted')
        closeCreateModal()
        await refresh()
      }
    }
  } catch (err: unknown) {
    const parsed = err as { message?: string }
    toast.error(parsed?.message || 'Failed to submit issue. Please try again.', 'Error')
  } finally {
    submitting.value = false
  }
}

// ── Detail Modal ──
async function openDetail(issue: Issue): Promise<void> {
  const found = issueStore.issues.find(x => x.id === issue.id)
  if (!found?.history || found.history.length === 0) {
    await issueStore.fetchIssueById(issue.id)
  }
  const full = issueStore.issues.find(x => x.id === issue.id)
  detailIssue.value = { ...(full || issue) }
  detailOpen.value = true
}

function closeDetail(): void { detailOpen.value = false }

// ── Edit Modal (reuses create modal) ──
async function openEditModal(issue: Issue): Promise<void> {
  editingIssueId.value = issue.id
  form.value = { title: issue.title, description: issue.description, priority: issue.priority, files: [] }
  formErrors.value = []
  createModalOpen.value = true
}

// ── Helpers ──
function getInitials(name: string): string {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return dateStr }
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'Open': return 'bg-[#FEF3C7] text-[#D97706]'
    case 'In Progress': return 'bg-[#EFF6FF] text-[#2563EB]'
    case 'Resolved': return 'bg-[#ECFDF5] text-[#10B981]'
    case 'Closed': return 'bg-[#F3F4F6] text-[#6B7280]'
    default: return 'bg-[#F3F4F6] text-[#6B7280]'
  }
}

function priorityBadgeClass(priority: string): string {
  switch (priority) {
    case 'High': return 'bg-[#FEF2F2] text-[#EF4444]'
    case 'Medium': return 'bg-[#FFFBEB] text-[#D97706]'
    case 'Low': return 'bg-[#ECFDF5] text-[#10B981]'
    default: return 'bg-[#F3F4F6] text-[#6B7280]'
  }
}

// ── Lifecycle ──
onMounted(async () => {
  await fetchAllIssues()
  await fetchStats()
})
</script>

<style scoped>
.animate-in {
  animation: animateIn 0.2s ease-out;
}
@keyframes animateIn {
  from { opacity: 0; transform: scale(0.95) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
