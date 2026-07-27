<template>
  <div class="space-y-6">
    <!-- ════════════════════════════════════════════
         Header
         ════════════════════════════════════════════ -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-[#111827]">Issue Management</h1>
        <p class="mt-1 text-sm text-[#6B7280]">
          Track and manage issues submitted by your assigned students.
        </p>
      </div>
      <button
        type="button"
        @click="refresh"
        :disabled="loading"
        class="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#6B7280] transition-all hover:border-[#2563EB]/20 hover:bg-[#2563EB]/5 hover:text-[#2563EB] disabled:opacity-50"
      >
        <svg
          class="h-4 w-4"
          :class="{ 'animate-spin': loading }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16.023 9.348c4.183.626 6.977 3.26 6.977 7.053A7.5 7.5 0 119.75 1.5c4.232 0 7.273 2.527 7.273 5.848z"
          />
        </svg>
        Refresh
      </button>
    </div>

    <!-- ════════════════════════════════════════════
         Statistics Cards
         ════════════════════════════════════════════ -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Issues -->
      <div
        class="group rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <p class="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Total Issues</p>
            <p class="text-3xl font-bold tracking-tight text-[#111827]">{{ stats.total }}</p>
          </div>
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB] transition-transform duration-200 group-hover:scale-110"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-xs text-[#9CA3AF]">All submitted issues</p>
      </div>

      <!-- Open Issues -->
      <div
        class="group rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <p class="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Open Issues</p>
            <p class="text-3xl font-bold tracking-tight text-[#111827]">{{ stats.open }}</p>
          </div>
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FEF3C7] text-[#D97706] transition-transform duration-200 group-hover:scale-110"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-xs text-[#9CA3AF]">Awaiting attention</p>
      </div>

      <!-- In Progress -->
      <div
        class="group rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <p class="text-xs font-medium uppercase tracking-wide text-[#6B7280]">In Progress</p>
            <p class="text-3xl font-bold tracking-tight text-[#111827]">{{ stats.inProgress }}</p>
          </div>
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3E8FF] text-[#7C3AED] transition-transform duration-200 group-hover:scale-110"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-xs text-[#9CA3AF]">Being worked on</p>
      </div>

      <!-- Resolved -->
      <div
        class="group rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <p class="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Resolved</p>
            <p class="text-3xl font-bold tracking-tight text-[#111827]">{{ stats.resolved }}</p>
          </div>
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#10B981] transition-transform duration-200 group-hover:scale-110"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-xs text-[#9CA3AF]">Successfully resolved</p>
      </div>
    </div>

    <!-- ════════════════════════════════════════════
         Search & Filters Bar
         ════════════════════════════════════════════ -->
    <div class="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <!-- Search -->
        <div class="lg:col-span-2">
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
            Search
          </label>
          <div class="relative">
            <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#9CA3AF]">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by title or student name..."
              class="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white py-2 pl-10 pr-10 text-sm text-[#111827] placeholder-[#9CA3AF] transition-all focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/10"
            />
            <button
              v-if="searchQuery.length > 0"
              type="button"
              @click="clearSearch"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-[#9CA3AF] transition-colors hover:text-[#6B7280]"
              aria-label="Clear search"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M18 6 6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
            Status
          </label>
          <select
            v-model="statusFilter"
            @change="onFilterChange"
            class="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 pr-8 text-sm text-[#111827] transition-all focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/10 appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div>
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
            Priority
          </label>
          <select
            v-model="priorityFilter"
            @change="onFilterChange"
            class="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 pr-8 text-sm text-[#111827] transition-all focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/10 appearance-none"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <!-- Reset + Search -->
        <div class="flex items-end gap-2">
          <button
            type="button"
            @click="resetFilters"
            class="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-[#6B7280] transition-all hover:border-[#EF4444]/30 hover:bg-[#FEF2F2] hover:text-[#EF4444] disabled:opacity-40"
            :disabled="!hasActiveFilters"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════════════════════
         Content Area
         ════════════════════════════════════════════ -->

    <!-- Error State -->
    <div
      v-if="error"
      class="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center"
    >
      <div class="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-[#EF4444]">
        <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 class="mt-4 text-base font-semibold text-[#111827]">Failed to load issues</h3>
      <p class="mt-1 max-w-md text-sm text-[#6B7280]">{{ error }}</p>
      <button
        type="button"
        @click="refresh"
        class="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#1D4ED8]"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16.023 9.348c4.183.626 6.977 3.26 6.977 7.053A7.5 7.5 0 119.75 1.5c4.232 0 7.273 2.527 7.273 5.848z"
          />
        </svg>
        Retry
      </button>
    </div>

    <!-- Loading State -->
    <div
      v-else-if="loading"
      class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <div
        v-for="i in 6"
        :key="i"
        class="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm"
      >
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 animate-pulse rounded-full bg-[#E5E7EB]" />
          <div class="flex-1 space-y-2">
            <div class="h-3.5 w-2/3 animate-pulse rounded bg-[#E5E7EB]" />
            <div class="h-3 w-1/3 animate-pulse rounded bg-[#F3F4F6]" />
          </div>
        </div>
        <div class="mt-4 h-5 w-3/4 animate-pulse rounded bg-[#E5E7EB]" />
        <div class="mt-3 space-y-2">
          <div class="h-3 w-full animate-pulse rounded bg-[#E5E7EB]" />
          <div class="h-3 w-5/6 animate-pulse rounded bg-[#F3F4F6]" />
        </div>
        <div class="mt-4 flex gap-3">
          <div class="h-6 w-16 animate-pulse rounded-full bg-[#E5E7EB]" />
          <div class="h-6 w-20 animate-pulse rounded-full bg-[#E5E7EB]" />
        </div>
      </div>
    </div>

    <!-- Issue Cards Grid -->
    <div
      v-else-if="paginatedIssues.length > 0"
      class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <div
        v-for="issue in paginatedIssues"
        :key="issue.id"
        class="group relative flex flex-col rounded-2xl border border-[#E5E7EB] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2563EB]/20 hover:shadow-md"
      >
        <!-- Student Info Header -->
        <div class="flex items-center gap-3 border-b border-[#F3F4F6] px-5 py-4">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-sm font-bold text-[#2563EB]"
          >
            {{ getInitials(issue.reporter || issue.studentName || 'Unknown') }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-[#111827] truncate">
              {{ issue.reporter || issue.studentName || 'Unknown Student' }}
            </p>
            <p class="text-xs text-[#2563EB] font-medium">
              {{ issue.studentId ? `ID: ${studentIdLabel(issue.studentId)}` : '—' }}
            </p>
          </div>
        </div>

        <!-- Issue Content -->
        <div class="flex-1 px-5 py-4">
          <!-- Title -->
          <h3 class="text-base font-bold leading-snug text-[#111827] line-clamp-1">
            {{ issue.title }}
          </h3>

          <!-- Description -->
          <p class="mt-2 text-sm leading-relaxed text-[#6B7280] line-clamp-3">
            {{ issue.description }}
          </p>

          <!-- Badges Row -->
          <div class="mt-4 flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
              :class="statusBadgeClass(issue.status)"
            >
              <span class="mr-1.5 h-1.5 w-1.5 rounded-full" :class="statusDotClass(issue.status)" />
              {{ issue.status }}
            </span>
            <span
              class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
              :class="priorityBadgeClass(issue.priority)"
            >
              {{ issue.priority }}
            </span>
          </div>

          <!-- Dates Row -->
          <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#9CA3AF]">
            <span class="flex items-center gap-1.5">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ formatDate(issue.createdAt) }}
            </span>
            <span class="flex items-center gap-1.5">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ formatDate(issue.updatedAt) }}
            </span>
          </div>

          <!-- Attachments indicator -->
          <div
            v-if="issue.attachments && issue.attachments > 0"
            class="mt-2 flex items-center gap-1.5 text-xs text-[#9CA3AF]"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 000 2.828 2 2 0 002.828 0L18 10m0 0h-6m6 0v6" />
            </svg>
            {{ issue.attachments }} attachment{{ issue.attachments === 1 ? '' : 's' }}
          </div>
        </div>

        <!-- Action Footer -->
        <div class="border-t border-[#F3F4F6] px-5 py-3">
          <button
            type="button"
            @click="openDetail(issue)"
            class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-[#374151] transition-all hover:border-[#2563EB]/30 hover:bg-[#EFF6FF] hover:text-[#2563EB]"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Details
          </button>
        </div>
      </div>
    </div>

    <!-- Empty / No Results State -->
    <div
      v-else-if="!loading"
      class="flex flex-col items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white px-6 py-20 text-center"
    >
      <div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F9FAFB]">
        <svg class="h-10 w-10 text-[#D1D5DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 class="mt-5 text-lg font-semibold text-[#111827]">
        {{ hasActiveFilters && allIssues.length > 0 ? 'No matching issues' : 'No issues reported' }}
      </h3>
      <p class="mt-2 max-w-sm text-sm text-[#6B7280]">
        {{ hasActiveFilters && allIssues.length > 0
          ? 'No issues match your current filters. Try adjusting your search or filter criteria.'
          : 'No issues have been submitted by your students yet. When students report issues, they will appear here.'
        }}
      </p>
    </div>

    <!-- ════════════════════════════════════════════
         Pagination
         ════════════════════════════════════════════ -->
    <div
      v-if="totalPages > 1"
      class="flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 shadow-sm sm:flex-row sm:px-6"
    >
      <p class="text-xs text-[#6B7280]">
        Showing
        <span class="font-semibold text-[#111827]">{{ displayRange }}</span>
        of
        <span class="font-semibold text-[#111827]">{{ allIssues.length }}</span>
        issues
      </p>
      <div class="flex items-center gap-2">
        <button
          class="rounded-xl border border-[#E5E7EB] px-3 py-1.5 text-xs font-semibold text-[#6B7280] transition-colors hover:bg-gray-50 disabled:opacity-60"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          Previous
        </button>
        <div class="flex items-center gap-1">
          <template v-for="(page, idx) in visiblePages" :key="idx">
            <span v-if="page === '...'" class="flex h-8 w-8 items-center justify-center text-xs text-[#9CA3AF] select-none">…</span>
            <button
              v-else
              @click="goToPage(page as number)"
              class="flex h-8 min-w-[2rem] items-center justify-center rounded-xl px-2 text-xs font-semibold transition-colors"
              :class="page === currentPage ? 'bg-[#2563EB] text-white' : 'text-[#6B7280] hover:bg-gray-100'"
            >
              {{ page }}
            </button>
          </template>
        </div>
        <button
          class="rounded-xl border border-[#E5E7EB] px-3 py-1.5 text-xs font-semibold text-[#6B7280] transition-colors hover:bg-gray-50 disabled:opacity-60"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Next
        </button>

        <!-- Rows per page -->
        <div class="ml-3 flex items-center gap-2">
          <label class="text-xs text-[#6B7280]">Rows</label>
          <select
            v-model="perPage"
            @change="onPerPageChange"
            class="h-8 rounded-xl border border-[#E5E7EB] bg-white px-2 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/10"
          >
            <option :value="6">6</option>
            <option :value="12">12</option>
            <option :value="24">24</option>
            <option :value="48">48</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <!-- ════════════════════════════════════════════
       Issue Detail Modal
       ════════════════════════════════════════════ -->
  <teleport to="body">
    <div
      v-if="detailOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm transition-opacity"
      @click.self="closeDetail"
    >
      <div
        class="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
      >
        <!-- Header -->
        <div class="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <span class="font-mono font-semibold">{{ detailIssue.id }}</span>
              <span class="text-slate-300">·</span>
              <span class="flex items-center gap-1">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatDate(detailIssue.createdAt) }}
              </span>
            </div>
            <h2 class="mt-1 text-lg font-bold text-slate-900 truncate">{{ detailIssue.title }}</h2>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <span
              class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="statusBadgeClass(detailIssue.status)"
            >
              {{ detailIssue.status }}
            </span>
            <span
              class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="priorityBadgeClass(detailIssue.priority)"
            >
              {{ detailIssue.priority }}
            </span>
            <button
              type="button"
              class="ml-1 rounded-xl p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition-colors"
              @click="closeDetail"
              aria-label="Close detail modal"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <!-- Student & Assignment Info -->
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <!-- Student Info -->
            <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-base font-bold text-[#2563EB]"
                >
                  {{ getInitials(detailIssue.reporter || detailIssue.studentName || '?') }}
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Student</p>
                  <p class="mt-0.5 text-sm font-semibold text-slate-900 truncate">
                    {{ detailIssue.reporter || detailIssue.studentName || '—' }}
                  </p>
                  <p v-if="detailIssue.studentId" class="text-xs text-[#2563EB] font-medium">
                    ID: {{ studentIdLabel(detailIssue.studentId) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Assigned To -->
            <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Assigned To</p>
              <p class="mt-1 text-sm font-semibold text-slate-900">
                {{ detailIssue.assignedTo || 'Unassigned' }}
              </p>
              <p v-if="detailIssue.assignedUserId" class="text-xs text-slate-400">
                User ID: {{ detailIssue.assignedUserId }}
              </p>
            </div>
          </div>

          <!-- Description -->
          <div>
            <h3 class="text-sm font-semibold text-slate-900 mb-2">Description</h3>
            <p class="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
              {{ detailIssue.description }}
            </p>
          </div>

          <!-- Due Date (if set) -->
          <div v-if="detailIssue.due_date" class="flex items-center gap-2 text-sm text-slate-600">
            <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="font-medium">Due:</span>
            {{ detailIssue.due_date }}
          </div>

          <!-- Attachments -->
          <div v-if="detailIssue.attachmentList && detailIssue.attachmentList.length > 0">
            <h3 class="text-sm font-semibold text-slate-900 mb-3">Attachments</h3>
            <div class="space-y-2">
              <a
                v-for="att in detailIssue.attachmentList"
                :key="att.id || att.filename"
                :href="att.url || att.file_path"
                target="_blank"
                class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all hover:border-[#2563EB]/30 hover:bg-[#EFF6FF] group"
              >
                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-400 group-hover:text-[#2563EB] transition-colors">
                  <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 000 2.828 2 2 0 002.828 0L18 10m0 0h-6m6 0v6" />
                  </svg>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="font-medium text-slate-700 group-hover:text-[#2563EB] truncate transition-colors">
                    {{ att.filename }}
                  </p>
                  <p v-if="att.file_size" class="text-xs text-slate-400">
                    {{ formatFileSize(att.file_size) }}
                  </p>
                </div>
                <svg class="h-4 w-4 shrink-0 text-slate-400 group-hover:text-[#2563EB] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Attachments count fallback -->
          <div
            v-else-if="detailIssue.attachments && detailIssue.attachments > 0"
            class="flex items-center gap-2 text-sm text-slate-500"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 000 2.828 2 2 0 002.828 0L18 10m0 0h-6m6 0v6" />
            </svg>
            {{ detailIssue.attachments }} attachment(s)
          </div>

          <!-- ════════════════════════════════════════════
               Tutor Comments Section (placeholder)
               ════════════════════════════════════════════ -->
          <div>
            <h3 class="text-sm font-semibold text-slate-900 mb-2">Tutor Comments</h3>
            <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p class="text-sm text-slate-400 italic">
                Comments from tutors will appear here once the backend adds support for this feature.
              </p>
            </div>
          </div>

          <!-- Activity Timeline -->
          <div v-if="detailIssue.history && detailIssue.history.length > 0">
            <h3 class="text-sm font-semibold text-slate-900 mb-3">Activity Timeline</h3>
            <div class="relative">
              <!-- Timeline line -->
              <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />

              <div class="space-y-5">
                <div
                  v-for="(event, idx) in detailIssue.history"
                  :key="idx"
                  class="relative flex gap-4 pl-10"
                >
                  <!-- Timeline dot -->
                  <div
                    class="absolute left-2.5 top-0.5 flex h-3 w-3 items-center justify-center"
                  >
                    <div
                      class="h-3 w-3 rounded-full border-2"
                      :class="idx === 0 ? 'border-[#2563EB] bg-[#2563EB]' : 'border-slate-300 bg-white'"
                    />
                  </div>

                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-slate-900">{{ event.text }}</p>
                    <p class="text-xs text-slate-500 mt-0.5">
                      {{ event.user }} · {{ formatDate(event.time) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No history message -->
          <div v-else>
            <h3 class="text-sm font-semibold text-slate-900 mb-3">Activity Timeline</h3>
            <p class="text-sm text-slate-400 italic">No activity recorded yet.</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex shrink-0 items-center justify-end border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
          <button
            type="button"
            @click="closeDetail"
            class="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { issueService } from '@/services/issueService'
import { useToastStore } from '@/stores/toast'
import type { Issue, IssueStats } from '@/types/issue'

const toast = useToastStore()

// ── State ──
const allIssues = ref<Issue[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Stats — represent unfiltered totals from the API
const stats = ref<IssueStats>({ total: 0, open: 0, inProgress: 0, resolved: 0 })

// Client-side Pagination
const currentPage = ref(1)
const perPage = ref(6)

// Filters
const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')

// Detail modal
const detailOpen = ref(false)
const detailIssue = ref<Issue>({
  id: '',
  title: '',
  description: '',
  reporter: '',
  studentName: '',
  assignedTo: '',
  createdAt: '',
  updatedAt: '',
  status: 'Open',
  priority: 'Low',
  attachments: undefined,
  attachmentList: [],
  history: [],
})

// ── Computed ──
const hasActiveFilters = computed(
  () => searchQuery.value.length > 0 || statusFilter.value !== '' || priorityFilter.value !== '',
)

/** Filter issues client-side based on active filters */
const filteredIssues = computed(() => {
  let list = allIssues.value

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        (i.reporter || '').toLowerCase().includes(q) ||
        (i.studentName || '').toLowerCase().includes(q),
    )
  }

  if (statusFilter.value) {
    list = list.filter((i) => i.status === statusFilter.value)
  }

  if (priorityFilter.value) {
    list = list.filter((i) => i.priority === priorityFilter.value)
  }

  return list
})

/** Paginate the filtered list */
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
    // Pass current filter values to the API so backend can search by student name as well
    const response = await issueService.getIssues({
      search: filters?.search ?? searchQuery.value,
      status: filters?.status ?? statusFilter.value,
      priority: filters?.priority ?? priorityFilter.value,
    })
    allIssues.value = response.data || []
    // Reset to page 1 when data changes
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
  } catch {
    // Stats endpoint unavailable; keep showing last known values
  }
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

function onPerPageChange(): void {
  currentPage.value = 1
}

function onFilterChange(): void {
  currentPage.value = 1
  fetchAllIssues({ search: searchQuery.value, status: statusFilter.value, priority: priorityFilter.value })
}

// ── Debounced search ──
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

// ── Detail Modal ──
function openDetail(issue: Issue): void {
  detailIssue.value = { ...issue }
  detailOpen.value = true
}

function closeDetail(): void {
  detailOpen.value = false
}

// ── Helpers ──
function getInitials(name: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function studentIdLabel(id: string | number): string {
  if (typeof id === 'number') return `STU-${String(id).padStart(3, '0')}`
  return id
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ── Badge Classes ──
function statusBadgeClass(status: string): string {
  switch (status) {
    case 'Open':
      return 'bg-[#EFF6FF] text-[#2563EB]'
    case 'In Progress':
      return 'bg-[#F3E8FF] text-[#7C3AED]'
    case 'Resolved':
      return 'bg-[#ECFDF5] text-[#10B981]'
    case 'Closed':
      return 'bg-[#F3F4F6] text-[#6B7280]'
    default:
      return 'bg-[#F3F4F6] text-[#6B7280]'
  }
}

function statusDotClass(status: string): string {
  switch (status) {
    case 'Open':
      return 'bg-[#2563EB]'
    case 'In Progress':
      return 'bg-[#7C3AED]'
    case 'Resolved':
      return 'bg-[#10B981]'
    case 'Closed':
      return 'bg-[#9CA3AF]'
    default:
      return 'bg-[#9CA3AF]'
  }
}

function priorityBadgeClass(priority: string): string {
  switch (priority) {
    case 'Low':
      return 'bg-[#F3F4F6] text-[#6B7280]'
    case 'Medium':
      return 'bg-[#EFF6FF] text-[#2563EB]'
    case 'High':
      return 'bg-[#FEF3C7] text-[#D97706]'
    case 'Critical':
      return 'bg-[#FEF2F2] text-[#EF4444]'
    default:
      return 'bg-[#F3F4F6] text-[#6B7280]'
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
  from {
    opacity: 0;
    transform: scale(0.95) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
