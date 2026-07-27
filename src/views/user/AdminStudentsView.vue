<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Students</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ totalStudents }} registered student{{ totalStudents !== 1 ? 's' : '' }}</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="showImportModal = true"
          class="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 hover:border-primary-200 hover:bg-primary-50">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import Excel
        </button>
        <button @click="exportPdf"
          class="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 hover:border-primary-200 hover:bg-primary-50">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Export PDF
        </button>
        <button @click="exportExcel"
          class="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 hover:border-primary-200 hover:bg-primary-50">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Excel
        </button>
        <button @click="selectMode ? clearSelection() : enterSelectMode()"
          class="flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold shadow-sm transition-all"
          :class="selectMode
            ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-rose-200 hover:bg-rose-50'">
          <svg v-if="selectMode" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {{ selectMode ? 'Cancel' : 'Select All' }}
        </button>
        <button @click="openCreateModal"
          class="flex h-10 items-center gap-2 rounded-xl bg-primary-600 px-4 text-sm font-semibold text-white shadow-md shadow-primary-200 transition-all hover:bg-primary-700">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Student
        </button>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <div class="relative min-w-0 flex-1 basis-[200px]">
        <svg class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Search students..."
          class="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100" />
      </div>

      <!-- Batch Filter -->
      <select v-model="batchFilter" @change="onFilterChange"
        class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100">
        <option value="">All Batches</option>
        <option v-for="b in batches" :key="b.id" :value="b.id">
          {{ b.batch_name || b.name }}
        </option>
      </select>

      <!-- Tutor Filter -->
      <select v-model="tutorFilter" @change="onFilterChange"
        class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100">
        <option value="">All Tutors</option>
        <option v-for="t in tutors" :key="t.id" :value="t.id">
          {{ t.name || ((t.first_name || '') + ' ' + (t.last_name || '')).trim() }}
        </option>
      </select>

      <!-- Status Filter -->
      <select v-model="statusFilter" @change="onFilterChange"
        class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="deactivated">Deactivated</option>
      </select>

      <!-- Gender Filter -->
      <select v-model="genderFilter" @change="onFilterChange"
        class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100">
        <option value="">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <select v-model="sortOrder"
        class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100">
        <option value="">Newest</option>
        <option value="name_asc">Name A-Z</option>
        <option value="name_desc">Name Z-A</option>
        <option value="oldest">Oldest</option>
      </select>

      <button v-if="hasActiveFilters" @click="clearFilters"
        class="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-200">
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Clear
      </button>
    </div>

    <div class="rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <!-- Loading skeleton -->
      <div v-if="loading" class="space-y-0 divide-y divide-slate-50">
        <div v-for="n in 3" :key="n" class="flex items-center gap-4 px-6 py-4 animate-pulse">
          <div class="h-4 w-4 rounded bg-slate-200" />
          <div class="flex-1 space-y-2">
            <div class="h-3 w-1/3 rounded bg-slate-200" />
            <div class="h-3 w-1/4 rounded bg-slate-100" />
          </div>
          <div class="h-5 w-16 rounded-full bg-slate-200" />
          <div class="flex gap-2">
            <div class="h-8 w-20 rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>

      <div v-else-if="students.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-500">
                <th v-if="selectMode" class="px-4 py-3.5 w-10">
                  <input type="checkbox" :checked="isAllSelected" :indeterminate="isIndeterminate"
                    @change="toggleSelectAll"
                    class="h-4 w-4 rounded border-slate-300 cursor-pointer accent-rose-600" />
                </th>
                <th class="px-6 py-3.5 font-medium">Photo</th>
                <th class="px-6 py-3.5 font-medium">First Name</th>
                <th class="px-6 py-3.5 font-medium">Last Name</th>
                <th class="px-6 py-3.5 font-medium">Student ID</th>
                <th class="px-6 py-3.5 font-medium">Email</th>
                <th class="px-6 py-3.5 font-medium">Batch</th>
                <th class="px-6 py-3.5 font-medium">Tutor Assigned</th>
                <th class="px-6 py-3.5 font-medium">Gender</th>
                <th class="px-6 py-3.5 font-medium">Status</th>
                <th class="px-6 py-3.5 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-700">
              <tr v-for="(student, index) in students" :key="student.id"
                @click="goToStudent(student)"
                class="cursor-pointer transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-700/30"
                :class="{ 'bg-rose-50/40': selectedIds.has(student.id) }">
                <td v-if="selectMode" class="px-4 py-4 w-10" @click.stop>
                  <input type="checkbox" :checked="selectedIds.has(student.id)"
                    @change="toggleSelect(student.id)"
                    class="h-4 w-4 rounded border-slate-300 cursor-pointer accent-rose-600" />
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <img
                    v-if="getStudentPhoto(student) && !failedStudentPhotos.has(student.id)"
                    :src="getStudentPhoto(student)!"
                    :alt="student.first_name + ' ' + student.last_name"
                    @error="failedStudentPhotos.add(student.id)"
                    class="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-xs"
                  />
                  <div
                    v-else
                    class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-100 to-teal-50 text-xs font-bold text-emerald-700 ring-2 ring-white shadow-xs"
                  >
                    {{ getInitials((student.first_name || '') + ' ' + (student.last_name || '')) }}
                  </div>
                </td>
                <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{{ student.first_name }}</td>
                <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{{ student.last_name }}</td>
                <td class="whitespace-nowrap px-6 py-4 font-mono text-xs font-medium text-slate-500">{{ formatStudentId(student.student_profile?.student_code || student.student_code, getBatchName(student)) }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">{{ student.email }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-slate-500 dark:text-slate-400">
                  <span v-if="getBatchName(student) !== '—'" class="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {{ getBatchName(student) }}
                  </span>
                  <span v-else class="text-slate-300">—</span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-slate-600 font-medium dark:text-slate-400">
                  {{ getTutorName(student) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-slate-500 dark:text-slate-400 capitalize">
                  {{ getGender(student) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                    :class="getStatusBadgeClass(student)">
                    <span class="h-1.5 w-1.5 rounded-full" :class="getStatusDotClass(student)" />
                    {{ getStatusText(student) }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-center">
                  <div class="relative inline-block text-center">
                    <button type="button" @click.stop="toggleKebab(student.id)" title="Actions"
                      class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 active:scale-95 mx-auto">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>

                    <!-- Kebab Dropdown Menu (Smart positioning: Top rows pop DOWN, Bottom rows pop UP) -->
                    <transition name="fade">
                      <div v-if="openKebabId === student.id"
                        class="absolute right-0 z-30 w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none text-left"
                        :class="index < (students.length > 2 ? students.length - 2 : 1) && students.length > 1 ? 'top-full mt-1 origin-top-right' : 'bottom-full mb-1 origin-bottom-right'">
                        <button type="button" @click.stop="openKebabId = null; goToProfile(student.id)"
                          class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors">
                          <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Profile
                        </button>

                        <button type="button" @click.stop="openKebabId = null; editStudent(student.id)"
                          class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors">
                          <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Student
                        </button>

                        <button v-if="!student.deleted_at" type="button" @click.stop="openKebabId = null; confirmAction('deactivate', student)"
                          class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 transition-colors">
                          <svg class="h-4 w-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                          Deactivate
                        </button>

                        <button v-else type="button" @click.stop="openKebabId = null; confirmAction('activate', student)"
                          class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors">
                          <svg class="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Activate
                        </button>

                        <div class="my-1 h-px bg-slate-100" />

                        <button type="button" @click.stop="openKebabId = null; confirmAction('delete', student)"
                          class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
                          <svg class="h-4 w-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete Student
                        </button>
                      </div>
                    </transition>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.last_page > 1" class="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-xs font-medium text-slate-500">
            Showing <span class="font-semibold text-slate-700">{{ pagination.from }}</span> – <span class="font-semibold text-slate-700">{{ pagination.to }}</span> of <span class="font-semibold text-slate-700">{{ pagination.total }}</span>
          </p>
          <div class="flex items-center gap-1">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage <= 1"
              class="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-slate-600 transition-all hover:bg-slate-100 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-30">&lsaquo;</button>
            <template v-for="p in visiblePages" :key="p">
              <span v-if="p === '...'" class="px-1 text-xs font-bold text-slate-400">...</span>
              <button v-else @click="goToPage(Number(p))"
                class="flex h-9 min-w-[36px] items-center justify-center rounded-lg px-3 text-xs font-bold transition-all"
                :class="p === currentPage ? 'bg-primary-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-primary-600'">{{ p }}</button>
            </template>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage >= (pagination?.last_page || 1)"
              class="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-slate-600 transition-all hover:bg-slate-100 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-30">&rsaquo;</button>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center px-6 py-16 text-center">
        <h3 class="text-base font-bold text-slate-900">No students found</h3>
        <p class="mt-1 text-sm text-slate-500">No registered students yet.</p>
      </div>
    </div>

    <!-- ── Floating Bulk Action Bar ── -->
    <transition name="slide-up">
      <div v-if="selectedIds.size > 0"
        class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <div class="flex items-center gap-3 rounded-2xl border border-rose-200 bg-white px-5 py-3 shadow-2xl shadow-rose-100 ring-1 ring-rose-100">
          <span class="flex h-7 min-w-[28px] items-center justify-center rounded-full bg-rose-600 px-2 text-xs font-bold text-white">
            {{ selectedIds.size }}
          </span>
          <span class="text-sm font-semibold text-slate-700">
            student{{ selectedIds.size !== 1 ? 's' : '' }} selected
          </span>
          <div class="mx-1 h-5 w-px bg-slate-200" />
          <button @click="bulkDelete" :disabled="bulkDeleting"
            class="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-rose-700 disabled:opacity-60 active:scale-95">
            <svg v-if="bulkDeleting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {{ bulkDeleting ? 'Deleting...' : 'Delete Selected' }}
          </button>
          <button @click="clearSelection"
            class="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-95">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
        </div>
      </div>
    </transition>

    <!-- ── Bulk Confirm Modal ── -->
    <transition name="fade">
      <div v-if="showBulkConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="showBulkConfirm = false">
        <div class="w-[92%] max-w-md rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50">
              <svg class="h-5 w-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-semibold text-slate-900">Delete {{ selectedIds.size }} Student{{ selectedIds.size !== 1 ? 's' : '' }}</h3>
              <p class="mt-0.5 text-sm text-slate-500">This action is permanent and cannot be undone.</p>
            </div>
          </div>
          <div v-if="bulkError" class="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{{ bulkError }}</div>
          <div class="mt-5 flex items-center justify-end gap-3">
            <button @click="showBulkConfirm = false" :disabled="bulkDeleting"
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
              Cancel
            </button>
            <button @click="confirmBulkDelete" :disabled="bulkDeleting"
              class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-60">
              <svg v-if="bulkDeleting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {{ bulkDeleting ? 'Deleting...' : `Delete ${selectedIds.size}` }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Import Modal -->
    <ImportStudentsModal :show="showImportModal" @close="handleImportModalClose" />

    <!-- Add/Edit Student Modal -->
    <transition name="fade">
      <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8" @click.self="closeFormModal">
        <div class="w-[92%] max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl my-8">
          <StudentForm :student-id="editingStudentId" @saved="onStudentSaved" @cancel="closeFormModal" />
        </div>
      </div>
    </transition>

    <ConfirmDialog
      :show="confirmShow"
      :title="confirmTitle"
      :message="confirmMessage"
      :confirm-text="confirmButtonText"
      cancel-text="Cancel"
      :loading="confirmLoading"
      :error="confirmError"
      @confirm="handleConfirmAction"
      @cancel="confirmCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { studentService } from '@/services/student'
import api from '@/services/api'
import StudentForm from '@/components/student/StudentForm.vue'
import ImportStudentsModal from '@/components/admin/ImportStudentsModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { formatStudentId } from '@/utils/studentUtils'

interface Role { id: number; name: string }
interface Batch { id: number; batch_name: string; name?: string; year?: string }
interface StudentProfile {
  id: number
  student_code: string | null
  batch_id: number | null
  gender?: string | null
  status?: string | null
  batch?: Batch | null
  tutor?: Tutor | { name?: string; first_name?: string; last_name?: string } | string | null
}
interface Student {
  id: number                    // This is the user ID
  user_id: number
  first_name: string
  last_name: string
  name: string
  email: string
  student_code: string | null
  gender?: string | null
  status?: string | null
  role: Role | null
  batch: Batch | null
  tutor?: Tutor | { name?: string; first_name?: string; last_name?: string } | string | null
  student_profile?: StudentProfile
  user?: {
    id?: number
    first_name?: string
    last_name?: string
    name?: string
    email?: string
    phone?: string
    gender?: string
    status?: string
    avatar?: string | null
    deleted_at?: string | null
  } | null
  deleted_at: string | null
}
interface PaginationMeta { current_page: number; last_page: number; per_page: number; total: number; from: number; to: number }

interface Tutor { id: number; user_id?: number | null; first_name?: string; last_name?: string; name?: string }

const students = ref<Student[]>([])
const loading = ref(false)
const searchQuery = ref('')
const sortOrder = ref('')
const batchFilter = ref('')
const statusFilter = ref('')
const genderFilter = ref('')
const tutorFilter = ref('')
const batches = ref<Batch[]>([])
const tutors = ref<Tutor[]>([])
const totalStudents = ref(0)
const currentPage = ref(1)
const pagination = ref<PaginationMeta | null>(null)
const showImportModal = ref(false)
const showFormModal = ref(false)
const editingStudentId = ref<number | undefined>(undefined)
const openKebabId = ref<number | null>(null)
const router = useRouter()
const toast = useToastStore()
const { show: confirmShow, loading: confirmLoading, error: confirmError, open: confirmOpen, cancel: confirmCancel, confirmAsync: confirmAsyncFn } = useConfirmDialog()
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmButtonText = ref('Confirm')
type ActionType = 'delete' | 'deactivate' | 'activate'
const pendingAction = ref<{ type: ActionType; student: Student } | null>(null)

function toggleKebab(id: number) {
  openKebabId.value = openKebabId.value === id ? null : id
}

function handleWindowClick() {
  openKebabId.value = null
}

// ── Bulk select state ──
const selectMode = ref(false)
const selectedIds = ref<Set<number>>(new Set())
const showBulkConfirm = ref(false)
const bulkDeleting = ref(false)
const bulkError = ref('')

const hasActiveFilters = computed(() =>
  !!searchQuery.value || !!sortOrder.value || !!batchFilter.value || !!statusFilter.value || !!genderFilter.value || !!tutorFilter.value
)

function clearFilters() {
  searchQuery.value = ''
  sortOrder.value = ''
  batchFilter.value = ''
  statusFilter.value = ''
  genderFilter.value = ''
  tutorFilter.value = ''
  currentPage.value = 1
  fetchStudents()
}

function onFilterChange() {
  currentPage.value = 1
  fetchStudents()
}

async function fetchBatches() {
  try {
    const res = await api.get('/admin/batches')
    batches.value = res.data.data ?? res.data ?? []
  } catch { /* ignore */ }
}

async function fetchTutors() {
  try {
    const res = await api.get('/admin/tutors', { params: { per_page: 100 } })
    tutors.value = res.data.data ?? res.data ?? []
  } catch { /* ignore */ }
}

const failedStudentPhotos = ref<Set<number>>(new Set())

function getStudentPhoto(student: any): string | null {
  if (!student) return null
  return student.photo_url || student.photo || student.avatar_url || student.avatar || student.user?.photo_url || student.user?.avatar_url || student.user?.avatar || student.student_profile?.photo || null
}

function getInitials(name?: string): string {
  if (!name || typeof name !== 'string') return 'ST'
  return (
    name
      .trim()
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'ST'
  )
}

function getBatchName(student: Student): string {
  if (student.batch?.batch_name) return student.batch.batch_name
  if (student.batch?.name) return student.batch.name
  if (student.student_profile?.batch?.batch_name) return student.student_profile.batch.batch_name
  if (student.student_profile?.batch?.name) return student.student_profile.batch.name
  return '—'
}

function getTutorName(student: Student): string {
  const t = student.tutor || student.student_profile?.tutor
  if (!t) return '—'
  if (typeof t === 'string') return t
  if (t.name) return t.name
  const fname = t.first_name || ''
  const lname = t.last_name || ''
  const full = `${fname} ${lname}`.trim()
  return full || '—'
}

function getGender(student: Student): string {
  const g = student.user?.gender || student.gender || student.student_profile?.gender
  return g ? g : '—'
}

function getStatusText(student: Student): string {
  if (student.deleted_at || student.user?.deleted_at) return 'Deactivated'
  const st = student.user?.status || student.status || student.student_profile?.status || 'active'
  if (st.toLowerCase() === 'inactive' || st.toLowerCase() === 'deactivated') return 'Deactivated'
  return st.charAt(0).toUpperCase() + st.slice(1)
}

function getStatusBadgeClass(student: Student): string {
  if (student.deleted_at || student.user?.deleted_at) return 'bg-rose-50 text-rose-700'
  const st = (student.user?.status || student.status || student.student_profile?.status || 'active').toLowerCase()
  switch (st) {
    case 'active': return 'bg-emerald-50 text-emerald-700'
    case 'inactive': return 'bg-slate-100 text-slate-600'
    case 'graduated': return 'bg-blue-50 text-blue-700'
    case 'suspended': return 'bg-rose-50 text-rose-700'
    default: return 'bg-emerald-50 text-emerald-700'
  }
}

function getStatusDotClass(student: Student): string {
  if (student.deleted_at) return 'bg-rose-500'
  const st = (student.status || student.student_profile?.status || 'active').toLowerCase()
  switch (st) {
    case 'active': return 'bg-emerald-500'
    case 'inactive': return 'bg-slate-400'
    case 'graduated': return 'bg-blue-500'
    case 'suspended': return 'bg-rose-500'
    default: return 'bg-emerald-500'
  }
}

function enterSelectMode() {
  selectMode.value = true
}

const isAllSelected = computed(() =>
  students.value.length > 0 && students.value.every(s => selectedIds.value.has(s.id))
)
const isIndeterminate = computed(() =>
  students.value.some(s => selectedIds.value.has(s.id)) && !isAllSelected.value
)

function toggleSelect(id: number) {
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedIds.value = next
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    const next = new Set(selectedIds.value)
    students.value.forEach(s => next.delete(s.id))
    selectedIds.value = next
  } else {
    const next = new Set(selectedIds.value)
    students.value.forEach(s => next.add(s.id))
    selectedIds.value = next
  }
}

function clearSelection() {
  selectedIds.value = new Set()
  selectMode.value = false
}

function bulkDelete() {
  bulkError.value = ''
  showBulkConfirm.value = true
}

async function confirmBulkDelete() {
  bulkDeleting.value = true
  bulkError.value = ''
  try {
    const ids = Array.from(selectedIds.value)
    const response = await api.delete('/admin/users/bulk-delete', { data: { ids } })
    toast.success(`Deleted ${ids.length} student${ids.length !== 1 ? 's' : ''} successfully.`)
    showBulkConfirm.value = false
    clearSelection()
    fetchStudents()
  } catch (err: unknown) {
    const errorData = (err as { response?: { data?: { message?: string; errors?: string[] } } })?.response?.data
    if (errorData?.errors && errorData.errors.length > 0) {
      bulkError.value = errorData.errors.join('; ')
    } else {
      bulkError.value = errorData?.message || 'Bulk delete failed.'
    }
  } finally {
    bulkDeleting.value = false
  }
}

const visiblePages = computed(() => {
  const total = pagination.value?.last_page || 1
  const current = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | string)[] = []
  if (current > 3) pages.push(1, '...')
  const start = Math.max(1, current - 1)
  const end = Math.min(total, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push('...', total)
  return pages
})

function goToStudent(student: Student) {
  const id = student.user_id || student.id
  router.push(`/admin/student-profile/${id}`)
}

function openCreateModal() {
  editingStudentId.value = undefined
  showFormModal.value = true
}
function editStudent(studentId: number) {
  editingStudentId.value = studentId
  showFormModal.value = true
}
function closeFormModal() {
  showFormModal.value = false
  editingStudentId.value = undefined
}
function onStudentSaved() {
  closeFormModal()
  fetchStudents()
  toast.success('Student saved successfully.')
}
function handleImportModalClose() {
  showImportModal.value = false
  fetchStudents()
}
function goToProfile(userId: number) {
  router.push(`/admin/student-profile/${userId}`)
}

async function confirmAction(type: ActionType, student: Student) {
  pendingAction.value = { type, student }
  if (type === 'delete') {
    confirmTitle.value = 'Delete Student'
    confirmMessage.value = `Are you sure you want to permanently delete ${student.first_name} ${student.last_name}?`
    confirmButtonText.value = 'Delete'
  } else if (type === 'deactivate') {
    confirmTitle.value = 'Deactivate Student'
    confirmMessage.value = `Are you sure you want to deactivate ${student.first_name} ${student.last_name}?`
    confirmButtonText.value = 'Deactivate'
  } else if (type === 'activate') {
    confirmTitle.value = 'Activate Student'
    confirmMessage.value = `Are you sure you want to activate ${student.first_name} ${student.last_name}?`
    confirmButtonText.value = 'Activate'
  }
  const confirmed = await confirmOpen({ title: confirmTitle.value, message: confirmMessage.value })
  if (!confirmed) return
  await handleConfirmAction()
}

async function handleConfirmAction() {
  if (!pendingAction.value) return
  const { type, student } = pendingAction.value
  const targetId = student.user_id ?? student.id
  await confirmAsyncFn(async () => {
    if (type === 'delete') {
      await api.delete(`/admin/users/${targetId}`)
      toast.success(`Student "${student.first_name} ${student.last_name}" deleted.`)
    } else if (type === 'deactivate') {
      await api.put(`/admin/users/${targetId}/deactivate`)
      toast.success(`Student "${student.first_name} ${student.last_name}" deactivated successfully.`)
    } else if (type === 'activate') {
      await api.put(`/admin/users/${targetId}/activate`)
      toast.success(`Student "${student.first_name} ${student.last_name}" activated successfully.`)
    }
    pendingAction.value = null
    fetchStudents()
  })
}

function deleteStudent(student: Student) { confirmAction('delete', student) }
function goToPage(page: number) {
  if (page < 1 || (pagination.value && page > pagination.value.last_page)) return
  currentPage.value = page
  fetchStudents()
}

async function exportPdf() {
  try {
    const params: Record<string, string | number> = {}
    if (searchQuery.value) params.search = searchQuery.value
    if (batchFilter.value) params.batch_id = batchFilter.value
    if (statusFilter.value) params.status = statusFilter.value
    if (tutorFilter.value) params.tutor_id = tutorFilter.value
    const blob = await studentService.exportPdf(params)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `students-${new Date().toISOString().slice(0, 10)}.pdf`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('PDF exported successfully.')
  } catch {
    toast.error('Failed to export PDF.')
  }
}

async function exportExcel() {
  try {
    const params: Record<string, string | number> = {}
    if (searchQuery.value) params.search = searchQuery.value
    if (batchFilter.value) params.batch_id = batchFilter.value
    if (statusFilter.value) params.status = statusFilter.value
    if (tutorFilter.value) params.tutor_id = tutorFilter.value
    const blob = await studentService.exportExcel(params)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `students-${new Date().toISOString().slice(0, 10)}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Excel exported successfully.')
  } catch {
    toast.error('Failed to export Excel.')
  }
}

async function fetchStudents() {
  loading.value = true
  try {
    const params: Record<string, string | number> = { role: 'student', per_page: 10, page: currentPage.value }
    if (searchQuery.value) params.search = searchQuery.value
    if (sortOrder.value) params.sort = sortOrder.value
    if (batchFilter.value) params.batch_id = batchFilter.value
    if (tutorFilter.value) params.tutor_id = tutorFilter.value
    if (genderFilter.value) params.gender = genderFilter.value
    if (statusFilter.value) {
      if (statusFilter.value === 'deactivated') {
        params.student_status = 'deactivated'
      } else {
        params.student_status = statusFilter.value
      }
    }
    const res = await api.get('/admin/users', { params })
    let list: Student[] = res.data.data ?? []

    if (batchFilter.value) {
      list = list.filter(s => String(s.batch?.id || s.student_profile?.batch_id || '') === String(batchFilter.value))
    }
    if (genderFilter.value) {
      list = list.filter(s => (s.user?.gender || s.gender || s.student_profile?.gender || '').toLowerCase() === genderFilter.value.toLowerCase())
    }
    if (statusFilter.value) {
      if (statusFilter.value === 'deactivated') {
        list = list.filter(s => !!s.deleted_at || !!s.user?.deleted_at)
      } else {
        list = list.filter(s => (s.user?.status || s.status || s.student_profile?.status || 'active').toLowerCase() === statusFilter.value.toLowerCase())
      }
    }

    students.value = list
    pagination.value = res.data.meta ?? null
    totalStudents.value = res.data.meta?.total ?? list.length
  } catch { /* ignore */ }
  finally { loading.value = false }
}

let timeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => { currentPage.value = 1; fetchStudents() }, 300)
})
watch([sortOrder, batchFilter, tutorFilter, statusFilter, genderFilter], () => { currentPage.value = 1; fetchStudents() })

onMounted(() => {
  fetchBatches()
  fetchTutors()
  fetchStudents()
  window.addEventListener('click', handleWindowClick)
})

onUnmounted(() => {
  window.removeEventListener('click', handleWindowClick)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.slide-up-leave-active { transition: all 0.2s ease-in; }
.slide-up-enter-from  { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95); }
.slide-up-leave-to    { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95); }
</style>
