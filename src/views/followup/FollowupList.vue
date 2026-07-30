<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Follow-up Records</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          {{ isStudent ? 'Your follow-up meetings, notes, and next actions.' : 'Tutor follow-up meetings, notes, and next actions for your students.' }}
        </p>
      </div>
      <button
        v-if="isTutor"
        type="button"
        @click="openCreateForm"
        class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        New Follow-up
      </button>
    </div>

    <!-- Student filter (tutor only) -->
    <div v-if="isTutor" class="relative">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative flex-1 max-w-xs">
          <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref="filterSearchInput"
            v-model="filterSearch"
            type="text"
            placeholder="Filter by student name..."
            autocomplete="off"
            @input="onFilterSearchInput"
            @focus="showFilterDropdown = filterResults.length > 0"
            @blur="onFilterSearchBlur"
            class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-700 transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
          />
          <!-- Clear filter button -->
          <button
            v-if="selectedStudentFilter"
            type="button"
            @click="clearFilterStudent"
            title="Clear student filter"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors dark:text-slate-500 dark:hover:bg-slate-600 dark:hover:text-slate-300"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p v-if="selectedStudentFilter" class="text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5 dark:text-indigo-400 dark:bg-indigo-950/40">
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          Showing follow-ups for <strong>{{ selectedStudentFilter.name }}</strong>
        </p>
      </div>

      <!-- Search results dropdown -->
      <transition name="dropdown">
        <div
          v-if="showFilterDropdown && filterResults.length > 0"
          class="absolute z-50 mt-1 w-full max-w-xs rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-200/50 max-h-60 overflow-y-auto dark:border-slate-600 dark:bg-slate-700 dark:shadow-black/20"
        >
          <button
            v-for="(s, idx) in filterResults"
            :key="s.id"
            type="button"
            @mousedown.prevent="selectFilterStudent(s)"
            class="flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
            :class="idx < filterResults.length - 1 ? 'border-b border-slate-50 dark:border-slate-600' : ''"
          >
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 text-xs font-bold text-indigo-600 dark:from-indigo-800 dark:to-indigo-900 dark:text-indigo-300">
              {{ s.name?.charAt(0)?.toUpperCase() || '?' }}
            </div>
            <div class="min-w-0">
              <p class="font-medium text-slate-800 truncate">{{ s.name }}</p>
              <p class="text-xs text-slate-400 truncate">
                {{ s.student_code ? `#${s.student_code}` : '' }}
                {{ s.student_code && s.email ? '·' : '' }}
                {{ s.email || '' }}
              </p>
            </div>
          </button>
        </div>
      </transition>

      <!-- No results message -->
      <transition name="dropdown">
        <div
          v-if="showFilterDropdown && filterSearch.length >= 2 && filterResults.length === 0 && !searchingFilter"
          class="absolute z-50 mt-1 w-full max-w-xs rounded-xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/50 text-center dark:border-slate-600 dark:bg-slate-700 dark:shadow-black/20"
        >
          <p class="text-sm text-slate-500 dark:text-slate-400">No students found matching "{{ filterSearch }}"</p>
        </div>
      </transition>
    </div>

    <!-- Error Alert -->
    <ErrorAlert :message="followupStore.error" />

    <!-- Loading -->
    <div
      v-if="followupStore.loading"
      class="flex items-center justify-center rounded-2xl border border-slate-100 bg-white py-16 shadow-sm dark:border-slate-700 dark:bg-slate-800"
    >
      <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>

    <!-- Data Table -->
    <div v-else class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-left text-sm">
          <thead>
            <tr
              class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-500"
            >
              <th class="px-5 py-3.5">Student</th>
              <th class="px-5 py-3.5">Meeting Type</th>
              <th class="px-5 py-3.5">Meeting Date</th>
              <th class="px-5 py-3.5">Next Follow-up</th>
              <th class="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-700">
            <tr
              v-for="f in followupStore.followups"
              :key="f.id"
              @click="openViewDetail(f)"
              class="cursor-pointer hover:bg-slate-50/70 transition-colors dark:hover:bg-slate-700/50"
            >
              <td class="whitespace-nowrap px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                    <img
                      v-if="rowStudentPhotoUrl(f)"
                      :src="rowStudentPhotoUrl(f) || undefined"
                      alt="Student photo"
                      class="h-full w-full object-cover"
                      @error="onRowPhotoError(f)"
                    />
                    <div
                      v-else
                      class="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-50 text-xs font-bold text-indigo-600 dark:from-indigo-800 dark:to-indigo-900 dark:text-indigo-300"
                    >
                      {{ studentLabel(f).charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  <span class="font-semibold text-slate-700 dark:text-slate-200">{{ studentLabel(f) }}</span>
                </div>
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-400">
                {{ f.meeting_type }}
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-400">
                {{ formatDate(f.meeting_date) }}
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-400">
                {{ f.next_followup ? formatDate(f.next_followup) : '—' }}
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-right" @click.stop>
                <div class="flex items-center justify-end gap-1.5">
                  <!-- View Detail -->
                  <button
                    @click.stop="openViewDetail(f)"
                    class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-slate-200"
                    title="View details"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View
                  </button>

                  <!-- Edit -->
                  <button
                    v-if="isTutor"
                    @click.stop="openEditForm(f)"
                    class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-slate-100"
                    title="Edit"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                    Edit
                  </button>

                  <!-- Delete -->
                  <button
                    v-if="isTutor"
                    @click="confirmDelete(f)"
                    class="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50 hover:border-red-300 dark:border-red-900 dark:bg-slate-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:border-red-700"
                    title="Delete"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="followupStore.followups.length === 0">
              <td colspan="5" class="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                No follow-up records found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- View Detail Modal -->
    <transition name="modal-scale">
      <div
        v-if="viewingFollowup"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click.self="viewingFollowup = null"
      >
        <div class="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
          <!-- Header with gradient -->
          <div class="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-4 rounded-t-2xl">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-white">Follow-up Details</h2>
                <p class="text-xs text-indigo-200">Record #{{ viewingFollowup.id }}</p>
              </div>
            </div>
            <button
              @click="viewingFollowup = null"
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 space-y-5">
            <!-- Row: Student & Meeting Type -->
            <div class="grid grid-cols-2 gap-5">
              <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:bg-slate-700/50">
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 dark:text-slate-500">
                  <svg class="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Student
                </div>
                <p class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ studentLabel(viewingFollowup) }}</p>
              </div>
              <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:bg-slate-700/50">
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 dark:text-slate-500">
                  <svg class="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Meeting Type
                </div>
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                  :class="meetingTypeBadge(viewingFollowup.meeting_type)"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="meetingTypeDot(viewingFollowup.meeting_type)"></span>
                  {{ viewingFollowup.meeting_type }}
                </span>
              </div>
            </div>

            <!-- Row: Meeting Date & Next Follow-up -->
            <div class="grid grid-cols-2 gap-5">
              <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:bg-slate-700/50">
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 dark:text-slate-500">
                  <svg class="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Meeting Date
                </div>
                <p class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ formatDate(viewingFollowup.meeting_date) }}</p>
              </div>
              <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:bg-slate-700/50">
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 dark:text-slate-500">
                  <svg class="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Next Follow-up
                </div>
                <p class="text-sm font-medium" :class="viewingFollowup.next_followup ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'">
                  {{ viewingFollowup.next_followup ? formatDate(viewingFollowup.next_followup) : 'Not scheduled' }}
                </p>
              </div>
            </div>

            <!-- Notes card -->
            <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:bg-slate-700/50">
              <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 dark:text-slate-500">
                <svg class="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Notes
              </div>
              <p class="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed dark:text-slate-200">
                {{ viewingFollowup.notes || '—' }}
              </p>
            </div>

            <!-- Action Items card -->
            <div v-if="viewingFollowup.action_items" class="rounded-xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
              <div class="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2 dark:text-amber-400">
                <svg class="h-4 w-4 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Action Items
              </div>
              <p class="text-sm text-amber-800 whitespace-pre-wrap leading-relaxed dark:text-amber-200">
                {{ viewingFollowup.action_items }}
              </p>
            </div>

            <!-- Footer: timestamps + actions -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div class="flex gap-4 text-xs text-slate-400 dark:text-slate-500">
                <span>Created {{ formatDateTime(viewingFollowup.created_at) }}</span>
                <span class="text-slate-300 dark:text-slate-600">·</span>
                <span>Updated {{ formatDateTime(viewingFollowup.updated_at) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  v-if="isTutor"
                  @click="quickEdit(viewingFollowup)"
                  class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Edit Record
                </button>
                <button
                  @click="viewingFollowup = null"
                  class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Edit/Create Modal -->
    <FollowupForm
      v-if="showForm"
      :followup="editingFollowup"
      @saved="onSaved"
      @cancelled="showForm = false"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog
      :show="showDeleteConfirm"
      title="Delete Follow-up"
      :message="`Are you sure you want to delete this follow-up record? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      :loading="deleting"
      :error="deleteError"
      @confirm="handleDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useFollowupStore } from '@/stores/followupStore'
import { useAuthStore } from '@/stores/auth'
import type { Followup } from '@/types/followup'
import api from '@/services/api'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useToastStore } from '@/stores/toast'
import FollowupForm from './FollowupForm.vue'

const followupStore = useFollowupStore()
const auth = useAuthStore()
const toast = useToastStore()

const showForm = ref(false)
const editingFollowup = ref<Followup | null>(null)
const viewingFollowup = ref<Followup | null>(null)

// Delete state
const showDeleteConfirm = ref(false)
const deletingFollowup = ref<Followup | null>(null)
const deleting = ref(false)
const deleteError = ref<string | null>(null)

const isStudent = computed(() => auth.userRole === 'student')
const isTutor = computed(() => auth.userRole === 'tutor' || auth.userRole === 'admin')

// ── Student filter state ──
const filterSearchInput = ref<HTMLInputElement | null>(null)
const filterSearch = ref('')
const filterResults = ref<Array<{ id: number; name: string; student_code?: string; email?: string }>>([])
const showFilterDropdown = ref(false)
const searchingFilter = ref(false)
let filterSearchTimeout: ReturnType<typeof setTimeout> | null = null

const selectedStudentFilter = ref<{ id: number; name: string } | null>(null)

const fetchParams = computed(() => {
  // Backend auto-scopes students — no params needed for student role
  const params: Record<string, unknown> = {}
  // For tutor: send students.id when filtering by a specific student
  if (selectedStudentFilter.value) {
    params.student_id = selectedStudentFilter.value.id
  }
  return params
})

async function onFilterSearchInput() {
  if (filterSearchTimeout) clearTimeout(filterSearchTimeout)

  if (filterSearch.value.length < 2) {
    filterResults.value = []
    showFilterDropdown.value = false
    return
  }

  searchingFilter.value = true
  filterSearchTimeout = setTimeout(async () => {
    try {
      const role = auth.userRole === 'admin' ? 'admin' : 'tutor'
      const res = await api.get(`/${role}/students`, {
        params: { search: filterSearch.value, per_page: 10 },
      })
      filterResults.value = Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
      showFilterDropdown.value = filterResults.value.length > 0
    } catch {
      filterResults.value = []
      showFilterDropdown.value = false
    } finally {
      searchingFilter.value = false
    }
  }, 350)
}

function selectFilterStudent(s: { id: number; name: string }) {
  selectedStudentFilter.value = { id: s.id, name: s.name }
  filterSearch.value = s.name
  showFilterDropdown.value = false
  // Refetch with the filter
  followupStore.fetchFollowups(fetchParams.value).catch(() => {})
}

function onFilterSearchBlur() {
  setTimeout(() => {
    showFilterDropdown.value = false
  }, 200)
}

function clearFilterStudent() {
  selectedStudentFilter.value = null
  filterSearch.value = ''
  filterResults.value = []
  showFilterDropdown.value = false
  // Refetch without filter
  followupStore.fetchFollowups(fetchParams.value).catch(() => {})
  nextTick(() => filterSearchInput.value?.focus())
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function formatDateTime(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

function studentLabel(f: Followup): string {
  if (!f.student_id) return '—'
  // For students: backend scopes to the authenticated student, so all follow-ups are theirs
  if (isStudent.value) return 'Me'
  if (f.student?.name) return f.student.name
  return `Student #${f.student_id}`
}

const failedRowPhotos = ref<Set<string>>(new Set())

function rowStudentPhotoUrl(f: Followup): string | null {
  const url = f.student?.photo_url
  if (!url || failedRowPhotos.value.has(url)) return null
  if (/^https?:\/\//.test(url)) return url
  const base = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/?api\/?$/, '')
  if (url.startsWith('/storage/')) return `${base}${url}`
  return `${base}/storage/${url.replace(/^\//, '')}`
}

function onRowPhotoError(f: Followup) {
  const url = f.student?.photo_url
  if (url) {
    const next = new Set(failedRowPhotos.value)
    next.add(url)
    failedRowPhotos.value = next
  }
}

function meetingTypeBadge(type: string): string {
  switch (type) {
    case 'Weekly':
      return 'bg-emerald-50 text-emerald-700'
    case 'Monthly':
      return 'bg-blue-50 text-blue-700'
    case 'Quarterly':
      return 'bg-purple-50 text-purple-700'
    case 'Annual':
      return 'bg-amber-50 text-amber-700'
    default:
      return 'bg-slate-50 text-slate-700'
  }
}

function meetingTypeDot(type: string): string {
  switch (type) {
    case 'Weekly':
      return 'bg-emerald-500'
    case 'Monthly':
      return 'bg-blue-500'
    case 'Quarterly':
      return 'bg-purple-500'
    case 'Annual':
      return 'bg-amber-500'
    default:
      return 'bg-slate-400'
  }
}

function openCreateForm() {
  editingFollowup.value = null
  showForm.value = true
}

function openEditForm(followup: Followup) {
  viewingFollowup.value = null
  editingFollowup.value = followup
  showForm.value = true
}

function openViewDetail(followup: Followup) {
  viewingFollowup.value = followup
}

function quickEdit(followup: Followup) {
  viewingFollowup.value = null
  nextTick(() => {
    editingFollowup.value = followup
    showForm.value = true
  })
}

function confirmDelete(followup: Followup) {
  deletingFollowup.value = followup
  deleteError.value = null
  showDeleteConfirm.value = true
}

async function handleDelete() {
  if (!deletingFollowup.value) return
  deleting.value = true
  deleteError.value = null
  try {
    await followupStore.deleteFollowup(deletingFollowup.value.id)
    toast.success('Follow-up record deleted successfully.', 'Deleted')
    showDeleteConfirm.value = false
    deletingFollowup.value = null
  } catch {
    deleteError.value = followupStore.error || 'Failed to delete follow-up.'
  } finally {
    deleting.value = false
  }
}

function onSaved() {
  showForm.value = false
  followupStore.fetchFollowups(fetchParams.value).catch(() => {})
}

onMounted(() => {
  followupStore.fetchFollowups(fetchParams.value).catch(() => {})
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition: opacity 0.25s ease-out;
}
.modal-scale-enter-active > div {
  transition: transform 0.25s ease-out, opacity 0.25s ease-out;
}
.modal-scale-leave-active {
  transition: opacity 0.15s ease-in;
}
.modal-scale-leave-active > div {
  transition: transform 0.15s ease-in, opacity 0.15s ease-in;
}
.modal-scale-enter-from {
  opacity: 0;
}
.modal-scale-enter-from > div {
  transform: scale(0.95) translateY(12px);
  opacity: 0;
}
.modal-scale-leave-to {
  opacity: 0;
}
.modal-scale-leave-to > div {
  transform: scale(0.97) translateY(8px);
  opacity: 0;
}

.dropdown-enter-active {
  transition: all 0.2s ease-out;
}
.dropdown-leave-active {
  transition: all 0.15s ease-in;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
