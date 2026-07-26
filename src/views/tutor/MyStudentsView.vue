<template>
  <div class="space-y-6">
    <!-- ════════════════════════════════════════════
         Header
         ════════════════════════════════════════════ -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-[#111827]">My Students</h1>
        <p class="mt-1 text-sm text-[#6B7280]">Manage and monitor your assigned students.</p>
      </div>
      <button
        type="button"
        @click="refresh"
        :disabled="store.loading"
        class="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#6B7280] transition-all hover:border-[#4F46E5]/20 hover:bg-[#4F46E5]/5 hover:text-[#4F46E5] disabled:opacity-50"
      >
        <svg
          class="h-4 w-4"
          :class="{ 'animate-spin': store.loading }"
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
         Summary Cards
         ════════════════════════════════════════════ -->
    <div
      v-if="!store.loading && !store.error"
      class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      <!-- Total Students -->
      <div class="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div class="flex items-start justify-between">
          <div class="space-y-1.5">
            <p class="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Total Students</p>
            <p class="text-3xl font-bold tracking-tight text-[#111827]">{{ store.summary.totalStudents }}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF2FF] text-[#4F46E5]">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
        <p class="mt-3 text-xs text-[#9CA3AF]">Assigned to you</p>
      </div>

      <!-- Active Students -->
      <div class="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div class="flex items-start justify-between">
          <div class="space-y-1.5">
            <p class="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Active Students</p>
            <p class="text-3xl font-bold tracking-tight text-[#111827]">{{ store.summary.activeStudents }}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#ECFDF5] text-[#10B981]">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="mt-3 text-xs text-[#9CA3AF]">Assigned / In Progress</p>
      </div>

      <!-- Open Issues -->
      <div class="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div class="flex items-start justify-between">
          <div class="space-y-1.5">
            <p class="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Open Issues</p>
            <p class="text-3xl font-bold tracking-tight text-[#111827]">{{ store.summary.studentsWithIssues }}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2] text-[#EF4444]">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        <p class="mt-3 text-xs text-[#9CA3AF]">Students with unresolved issues</p>
      </div>

      <!-- Pending Follow-ups -->
      <div class="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div class="flex items-start justify-between">
          <div class="space-y-1.5">
            <p class="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Pending Follow-ups</p>
            <p class="text-3xl font-bold tracking-tight text-[#111827]">{{ store.summary.pendingFollowups }}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFFBEB] text-[#F59E0B]">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <p class="mt-3 text-xs text-[#9CA3AF]">Scheduled follow-ups</p>
      </div>
    </div>

    <!-- ════════════════════════════════════════════
         Search & Filters Bar
         ════════════════════════════════════════════ -->
    <div class="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Search -->
        <div class="relative min-w-0 flex-1 basis-[260px]">
          <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#9CA3AF]">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            v-model="localSearch"
            type="text"
            placeholder="Search by name, email, or code..."
            class="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white py-2 pl-10 pr-10 text-sm text-[#111827] placeholder-[#9CA3AF] transition-all focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10"
          />
          <button
            v-if="localSearch.length > 0"
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

        <!-- Status Filter -->
        <select
          v-model="localStatus"
          @change="onFilterChange"
          class="h-10 min-w-[150px] rounded-xl border border-[#E5E7EB] bg-white px-3.5 pr-8 text-sm text-[#111827] transition-all focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 appearance-none"
        >
          <option value="">All Statuses</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Terminated">Terminated</option>
        </select>

        <!-- Company Filter -->
        <select
          v-model="localCompanyId"
          @change="onFilterChange"
          class="h-10 min-w-[170px] rounded-xl border border-[#E5E7EB] bg-white px-3.5 pr-8 text-sm text-[#111827] transition-all focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 appearance-none"
        >
          <option :value="undefined">All Companies</option>
          <option
            v-for="c in companyOptions"
            :key="c.id"
            :value="c.id"
          >
            {{ c.name }}
          </option>
        </select>

        <!-- Reset -->
        <button
          type="button"
          @click="resetAllFilters"
          class="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-[#6B7280] transition-all hover:border-[#EF4444]/30 hover:bg-[#FEF2F2] hover:text-[#EF4444] disabled:opacity-40"
          :disabled="!hasActiveFilters"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Reset
        </button>

        <!-- Export Dropdown -->
        <div class="relative ml-auto">
          <button
            type="button"
            @click.stop="toggleExport"
            class="inline-flex h-10 items-center gap-2 rounded-xl bg-[#4F46E5] px-5 text-sm font-medium text-white transition-all hover:bg-[#4338CA] hover:shadow-sm"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
            <svg class="h-3.5 w-3.5 transition-transform" :class="{ 'rotate-180': exportOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <transition name="menu-fade">
            <div
              v-if="exportOpen"
              class="absolute right-0 z-50 mt-1 w-40 origin-top-right rounded-xl border border-[#E5E7EB] bg-white py-1 shadow-lg ring-1 ring-black/5"
              @click.stop
            >
              <button
                @click="exportCSV"
                class="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-[#374151] transition-colors hover:bg-[#F9FAFB]"
              >
                <svg class="h-4 w-4 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
              <button
                @click="exportPDF"
                class="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-[#374151] transition-colors hover:bg-[#F9FAFB]"
              >
                <svg class="h-4 w-4 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Export PDF
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════════════════════
         Table Container
         ════════════════════════════════════════════ -->
    <div class="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
      <!-- Loading State — Skeleton Rows -->
      <div v-if="store.loading" class="divide-y divide-[#E5E7EB]/60">
        <div
          v-for="n in 8"
          :key="n"
          class="flex items-center gap-4 px-6 py-4 animate-pulse"
        >
          <div class="h-9 w-9 rounded-full bg-[#E5E7EB]" />
          <div class="flex-1 space-y-2">
            <div class="h-3.5 w-1/4 rounded bg-[#E5E7EB]" />
            <div class="h-3 w-1/6 rounded bg-[#F3F4F6]" />
          </div>
          <div class="h-3 w-24 rounded bg-[#E5E7EB]" />
          <div class="h-3 w-16 rounded bg-[#E5E7EB]" />
          <div class="h-3 w-12 rounded bg-[#E5E7EB]" />
          <div class="h-3 w-20 rounded bg-[#E5E7EB]" />
          <div class="h-6 w-16 rounded-lg bg-[#E5E7EB]" />
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="store.error"
        class="flex flex-col items-center justify-center px-6 py-16 text-center"
      >
        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-[#FEF2F2] text-[#EF4444]">
          <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="mt-4 text-base font-semibold text-[#111827]">Failed to load students</h3>
        <p class="mt-1 max-w-md text-sm text-[#6B7280]">{{ store.error }}</p>
        <button
          type="button"
          @click="refresh"
          class="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#4338CA]"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.023 9.348c4.183.626 6.977 3.26 6.977 7.053A7.5 7.5 0 119.75 1.5c4.232 0 7.273 2.527 7.273 5.848z" />
          </svg>
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!store.loading && store.isEmpty"
        class="flex flex-col items-center justify-center px-6 py-20 text-center"
      >
        <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F9FAFB]">
          <svg class="h-8 w-8 text-[#D1D5DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 class="mt-4 text-base font-semibold text-[#111827]">No students assigned yet</h3>
        <p class="mt-1 max-w-sm text-sm text-[#6B7280]">
          No students have been assigned to you yet. Once an admin assigns students to your account, they will appear here.
        </p>
      </div>

      <!-- ════════════════════════════════════════════
           Student Table
           ════════════════════════════════════════════ -->
      <template v-else>
        <!-- Table Header -->
        <div class="border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <div class="flex items-center px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
            <div class="w-[280px]">Student</div>
            <div class="w-[180px]">Company</div>
            <div class="w-[130px]">Status</div>
            <div class="w-[100px]">Worklogs</div>
            <div class="w-[110px]">Open Issues</div>
            <div class="w-[160px]">Next Follow-up</div>
            <div class="flex-1 text-right">Actions</div>
          </div>
        </div>

        <!-- Table Rows -->
        <div class="divide-y divide-[#E5E7EB]/60">
          <div
            v-for="student in store.students"
            :key="student.id"
            class="flex items-center px-6 py-4 transition-all hover:bg-[#F9FAFB]"
          >
            <!-- Student -->
            <div class="w-[280px] flex items-center gap-3 min-w-0">
              <UserAvatar :avatar="student.avatar || student.photo" :name="student.name" size="sm" />
              <div class="min-w-0">
                <p class="text-sm font-semibold text-[#111827] truncate">{{ student.name }}</p>
                <p class="text-xs text-[#4F46E5] font-medium">{{ student.student_code || '—' }}</p>
                <p class="text-xs text-[#9CA3AF] truncate">{{ student.email }}</p>
              </div>
            </div>

            <!-- Company -->
            <div class="w-[180px] flex items-center gap-2 min-w-0">
              <svg class="h-4 w-4 shrink-0 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div class="min-w-0">
                <p class="text-sm font-medium text-[#111827] truncate">{{ student.company_name || '—' }}</p>
                <p class="text-xs text-[#9CA3AF] truncate">{{ student.position || '' }}</p>
              </div>
            </div>

            <!-- Status -->
            <div class="w-[130px]">
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                :class="statusClass(student.assignment_status)"
              >
                <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(student.assignment_status)" />
                {{ formatStatus(student.assignment_status) }}
              </span>
            </div>

            <!-- Worklogs -->
            <div class="w-[100px] flex items-center gap-2">
              <svg class="h-4 w-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="text-sm font-medium text-[#6B7280]">{{ student.total_worklogs ?? 0 }}</span>
            </div>

            <!-- Open Issues -->
            <div class="w-[110px] flex items-center gap-2">
              <svg class="h-4 w-4 shrink-0" :class="(student.open_issues_count ?? 0) > 0 ? 'text-[#EF4444]' : 'text-[#D1D5DB]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span
                class="text-sm font-medium"
                :class="(student.open_issues_count ?? 0) > 0 ? 'text-[#EF4444]' : 'text-[#9CA3AF]'"
              >
                {{ student.open_issues_count ?? 0 }}
              </span>
            </div>

            <!-- Next Follow-up -->
            <div class="w-[160px] flex items-center gap-2">
              <svg class="h-4 w-4 shrink-0 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-sm text-[#6B7280]">
                {{ formatFollowupDate(student.next_followup) }}
              </span>
            </div>

            <!-- Actions -->
            <div class="flex-1 flex items-center justify-end gap-1">
              <button
                type="button"
                @click="navigateToProfile(student.id)"
                class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#9CA3AF] transition-all hover:bg-[#F3F4F6] hover:text-[#4F46E5]"
                title="View Profile"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <div class="relative">
                <button
                  type="button"
                  @click.stop="toggleMenu(student.id)"
                  class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#9CA3AF] transition-all hover:bg-[#F3F4F6] hover:text-[#6B7280]"
                  title="More actions"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <transition name="menu-fade">
                  <div
                    v-if="openMenuId === student.id"
                    class="absolute right-0 z-50 mt-1 w-44 origin-top-right rounded-xl border border-[#E5E7EB] bg-white py-1 shadow-lg ring-1 ring-black/5"
                    @click.stop
                  >
                    <button @click="navigateToWorklogs(student.id); openMenuId = null" class="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-[#374151] transition-colors hover:bg-[#F9FAFB]">
                      <svg class="h-4 w-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Worklogs
                    </button>
                    <button @click="navigateToFollowups(student.id); openMenuId = null" class="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-[#374151] transition-colors hover:bg-[#F9FAFB]">
                      <svg class="h-4 w-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      View Follow-ups
                    </button>
                    <button @click="navigateToIssues(student.id); openMenuId = null" class="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-[#374151] transition-colors hover:bg-[#F9FAFB]">
                      <svg class="h-4 w-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      View Issues
                    </button>
                    <button @click="navigateToEvaluation(student.id); openMenuId = null" class="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-[#374151] transition-colors hover:bg-[#F9FAFB]">
                      <svg class="h-4 w-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      View Evaluation
                    </button>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>

        <!-- ════════════════════════════════════════════
             Pagination
             ════════════════════════════════════════════ -->
        <div class="flex items-center justify-between border-t border-[#E5E7EB] px-6 py-3">
          <p class="text-sm text-[#6B7280]">
            Showing
            <span class="font-medium text-[#111827]">{{ store.pagination.from || 0 }}</span>
            –
            <span class="font-medium text-[#111827]">{{ store.pagination.to || 0 }}</span>
            of
            <span class="font-medium text-[#111827]">{{ store.pagination.total }}</span>
            students
          </p>

          <nav class="flex items-center gap-1" aria-label="Pagination">
            <button
              :disabled="store.pagination.current_page <= 1"
              @click="onPageChange(store.pagination.current_page - 1)"
              class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-all"
              :class="store.pagination.current_page <= 1 ? 'text-[#D1D5DB] cursor-not-allowed' : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <template v-for="(page, idx) in visiblePages" :key="idx">
              <span v-if="page === '...'" class="inline-flex h-8 w-8 items-center justify-center text-xs text-[#9CA3AF] select-none">…</span>
              <button
                v-else
                @click="onPageChange(page as number)"
                class="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-sm font-medium transition-all"
                :class="page === store.pagination.current_page ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'"
              >
                {{ page }}
              </button>
            </template>

            <button
              :disabled="store.pagination.current_page >= store.pagination.last_page"
              @click="onPageChange(store.pagination.current_page + 1)"
              class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-all"
              :class="store.pagination.current_page >= store.pagination.last_page ? 'text-[#D1D5DB] cursor-not-allowed' : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>

          <!-- Rows per page -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-[#6B7280]">Rows per page</label>
            <select
              v-model="perPage"
              @change="onPerPageChange"
              class="h-8 rounded-lg border border-[#E5E7EB] bg-white px-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="15">15</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
            </select>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import UserAvatar from '@/components/common/UserAvatar.vue'
import { useTutorMyStudentsStore } from '@/stores/tutorMyStudents'
import { exportStudentsCSV, exportStudentsPDF } from '@/utils/exportStudents'

const router = useRouter()
const store = useTutorMyStudentsStore()

// ── Local filter state ──
const localSearch = ref(store.searchQuery)
const localStatus = ref(store.statusFilter)
const localCompanyId = ref<number | undefined>(store.companyFilter)
const perPage = ref(store.pagination.per_page)
const openMenuId = ref<number | null>(null)
const exportOpen = ref(false)

/** Whether any filter is actively set */
const hasActiveFilters = computed(
  () => localSearch.value.length > 0 || localStatus.value !== '' || localCompanyId.value !== undefined,
)

/**
 * Derive unique company options from the student list.
 */
const companyOptions = computed(() => {
  const seen = new Set<number>()
  const options: { id: number; name: string }[] = []
  for (const s of store.students) {
    if (s.company_id && !seen.has(s.company_id)) {
      seen.add(s.company_id)
      options.push({ id: s.company_id, name: s.company_name || `Company #${s.company_id}` })
    }
  }
  return options.sort((a, b) => a.name.localeCompare(b.name))
})

/** Generate visible pagination pages */
const visiblePages = computed(() => {
  const { current_page, last_page } = store.pagination
  if (last_page <= 7) {
    return Array.from({ length: last_page }, (_, i) => i + 1)
  }
  const pages: (number | '...')[] = [1]
  if (current_page > 3) pages.push('...')
  const start = Math.max(2, current_page - 1)
  const end = Math.min(last_page - 1, current_page + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current_page < last_page - 2) pages.push('...')
  pages.push(last_page)
  return pages
})

// ── Debounced search ──
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(localSearch, (val) => {
  store.searchQuery = val
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    store.applyFilters()
  }, 350)
})

function onFilterChange(): void {
  store.statusFilter = localStatus.value
  store.companyFilter = localCompanyId.value
  store.applyFilters()
}

function clearSearch(): void {
  localSearch.value = ''
  store.searchQuery = ''
  store.applyFilters()
}

function resetAllFilters(): void {
  localSearch.value = ''
  localStatus.value = ''
  localCompanyId.value = undefined
  store.resetFilters()
}

function onPageChange(page: number): void {
  if (page < 1 || page > store.pagination.last_page) return
  store.goToPage(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onPerPageChange(): void {
  store.fetchStudents({ per_page: perPage.value, page: 1 })
}

function toggleMenu(id: number): void {
  openMenuId.value = openMenuId.value === id ? null : id
  exportOpen.value = false
}

function toggleExport(): void {
  openMenuId.value = null
  exportOpen.value = !exportOpen.value
}

function exportCSV(): void {
  exportOpen.value = false
  exportStudentsCSV(store.students)
}

function exportPDF(): void {
  exportOpen.value = false
  exportStudentsPDF(store.students)
}

/** Close dropdown menu on outside click */
function handleClickOutside(): void {
  if (openMenuId.value !== null) {
    openMenuId.value = null
  }
  if (exportOpen.value) {
    exportOpen.value = false
  }
}

async function refresh(): Promise<void> {
  await store.fetchStudents()
}

// ── Navigation ──
function navigateToProfile(id: number): void {
  openMenuId.value = null
  router.push(`/tutor/students/${id}`)
}
function navigateToWorklogs(id: number): void {
  openMenuId.value = null
  router.push(`/tutor/students/${id}?tab=worklogs`)
}
function navigateToFollowups(id: number): void {
  openMenuId.value = null
  router.push(`/tutor/students/${id}?tab=followups`)
}
function navigateToIssues(id: number): void {
  openMenuId.value = null
  router.push(`/tutor/students/${id}?tab=issues`)
}
function navigateToEvaluation(id: number): void {
  openMenuId.value = null
  router.push(`/tutor/students/${id}?tab=evaluation`)
}

// ── Helpers ──
function formatStatus(status?: string): string {
  if (!status) return 'Unknown'
  return status
}

function statusClass(status?: string): string {
  switch (status) {
    case 'Assigned': return 'bg-[#EEF2FF] text-[#4F46E5]'
    case 'In Progress': return 'bg-[#F3E8FF] text-[#9333EA]'
    case 'Completed': return 'bg-[#ECFDF5] text-[#10B981]'
    case 'Terminated': return 'bg-[#FEF3C7] text-[#D97706]'
    default: return 'bg-[#F3F4F6] text-[#6B7280]'
  }
}

function statusDotClass(status?: string): string {
  switch (status) {
    case 'Assigned': return 'bg-[#4F46E5]'
    case 'In Progress': return 'bg-[#9333EA]'
    case 'Completed': return 'bg-[#10B981]'
    case 'Terminated': return 'bg-[#D97706]'
    default: return 'bg-[#9CA3AF]'
  }
}

function formatFollowupDate(followup: { date_label?: string; time_label?: string } | null | undefined): string {
  if (!followup) return 'Not scheduled'
  const date = followup.date_label || ''
  if (!date) return 'Not scheduled'
  return `${date}${followup.time_label ? ` · ${followup.time_label}` : ''}`
}

// ── Lifecycle ──
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  store.fetchStudents()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<style scoped>
.menu-fade-enter-active {
  transition: all 0.15s ease-out;
}
.menu-fade-leave-active {
  transition: all 0.1s ease-in;
}
.menu-fade-enter-from {
  opacity: 0;
  transform: translateY(-4px) scale(0.96);
}
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-2px) scale(0.98);
}
</style>
