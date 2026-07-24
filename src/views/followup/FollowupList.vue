<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Follow-up Records</h1>
        <p class="text-sm text-slate-500">
          {{ isStudent ? 'Your follow-up meetings, notes, and next actions.' : 'Tutor follow-up meetings, notes, and next actions for your students.' }}
        </p>
      </div>
      <button
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
            class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-700 transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <!-- Clear filter button -->
          <button
            v-if="selectedStudentFilter"
            type="button"
            @click="clearFilterStudent"
            title="Clear student filter"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p v-if="selectedStudentFilter" class="text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5">
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
          class="absolute z-50 mt-1 w-full max-w-xs rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-200/50 max-h-60 overflow-y-auto"
        >
          <button
            v-for="(s, idx) in filterResults"
            :key="s.id"
            type="button"
            @mousedown.prevent="selectFilterStudent(s)"
            class="flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-indigo-50"
            :class="idx < filterResults.length - 1 ? 'border-b border-slate-50' : ''"
          >
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 text-xs font-bold text-indigo-600">
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
          class="absolute z-50 mt-1 w-full max-w-xs rounded-xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/50 text-center"
        >
          <p class="text-sm text-slate-500">No students found matching "{{ filterSearch }}"</p>
        </div>
      </transition>
    </div>

    <!-- Error Alert -->
    <ErrorAlert :message="followupStore.error" />

    <!-- Search -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <input
        v-model="search"
        class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20 sm:flex-1"
        placeholder="Search follow-ups..."
        @input="onSearchInput"
      />
      <div class="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-2">
        <button
          class="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 sm:w-auto"
          @click="applySearch"
        >
          Search
        </button>
        <button
          class="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto"
          @click="resetSearch"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="followupStore.loading"
      class="flex items-center justify-center rounded-2xl border border-slate-100 bg-white py-16 shadow-sm"
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
    <div v-if="!followupStore.loading && followupStore.followups.length" class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <!-- Card view on small screens -->
      <div class="grid gap-3 p-3 sm:hidden">
        <div v-for="f in followupStore.followups" :key="f.id" class="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <div class="text-sm font-semibold text-slate-900">{{ studentLabel(f) }}</div>
              <div class="mt-1 text-xs text-slate-500">{{ f.meeting_type }}</div>
            </div>
            <div class="flex items-center gap-1">
              <button @click="openEditForm(f)" class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm active:scale-95">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
                <span>Edit</span>
              </button>
              <button @click="deleteFollowup(f)" class="inline-flex items-center gap-1 rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow-sm active:scale-95">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916"/></svg>
                <span>Delete</span>
              </button>
            </div>
          </div>
          <div class="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div><span class="font-medium text-slate-500">Date:</span> {{ formatDate(f.meeting_date) }}</div>
            <div><span class="font-medium text-slate-500">Next:</span> {{ f.next_followup ? formatDate(f.next_followup) : '—' }}</div>
          </div>
        </div>
      </div>
      <div class="-mx-4 hidden sm:mx-0 sm:block overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <table class="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400">
                <th class="px-4 py-3 sm:px-5 sm:py-3.5">Student</th>
                <th class="px-4 py-3 sm:px-5 sm:py-3.5">Meeting Type</th>
                <th class="px-4 py-3 sm:px-5 sm:py-3.5">Meeting Date</th>
                <th class="hidden px-4 py-3 sm:px-5 sm:py-3.5 md:table-cell">Next Follow-up</th>
                <th class="px-4 py-3 sm:px-5 sm:py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr
                v-for="f in followupStore.followups"
                :key="f.id"
                class="hover:bg-slate-50/30 transition-colors"
              >
                <td class="whitespace-nowrap px-4 py-3 text-slate-700 sm:px-5 sm:py-4">
                  {{ studentLabel(f) }}
                </td>
                <td class="whitespace-nowrap px-4 py-3 text-slate-600 sm:px-5 sm:py-4">
                  {{ f.meeting_type }}
                </td>
                <td class="whitespace-nowrap px-4 py-3 text-slate-600 sm:px-5 sm:py-4">
                  {{ formatDate(f.meeting_date) }}
                </td>
                <td class="hidden whitespace-nowrap px-4 py-3 text-slate-600 md:table-cell md:px-5 md:py-4">
                  {{ f.next_followup ? formatDate(f.next_followup) : '—' }}
                </td>
                <td class="whitespace-nowrap px-4 py-3 text-right sm:px-5 sm:py-4">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="openEditForm(f)"
                      class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
                    >
                      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                      <span class="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      @click="deleteFollowup(f)"
                      class="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
                    >
                      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916"
                        />
                      </svg>
                      <span class="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="followupStore.followups.length === 0">
                <td colspan="5" class="px-4 py-10 text-center text-sm text-slate-500 sm:px-5">
                  No follow-up records found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!followupStore.loading" class="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-14 text-center">
      <svg class="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3 class="mt-4 text-lg font-semibold text-gray-900">No Follow-up Records Found</h3>
      <p class="mt-2 max-w-md text-sm text-slate-500">
        There are currently no follow-up records. Click the button below to create the first follow-up.
      </p>
      <button
        class="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600"
        @click="openCreateForm"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        New Follow-up
      </button>
    </div>

    <!-- View Detail Modal -->
    <transition name="modal-scale">
      <div
        v-if="viewingFollowup"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click.self="viewingFollowup = null"
      >
        <div class="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-2xl">
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
              <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Student
                </div>
                <p class="text-sm font-medium text-slate-800">{{ studentLabel(viewingFollowup) }}</p>
              </div>
              <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Meeting Date
                </div>
                <p class="text-sm font-medium text-slate-800">{{ formatDate(viewingFollowup.meeting_date) }}</p>
              </div>
              <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Next Follow-up
                </div>
                <p class="text-sm font-medium" :class="viewingFollowup.next_followup ? 'text-slate-800' : 'text-slate-400'">
                  {{ viewingFollowup.next_followup ? formatDate(viewingFollowup.next_followup) : 'Not scheduled' }}
                </p>
              </div>
            </div>

            <!-- Notes card -->
            <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
              <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Notes
              </div>
              <p class="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {{ viewingFollowup.notes || '—' }}
              </p>
            </div>

            <!-- Action Items card -->
            <div v-if="viewingFollowup.action_items" class="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
              <div class="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
                <svg class="h-4 w-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Action Items
              </div>
              <p class="text-sm text-amber-800 whitespace-pre-wrap leading-relaxed">
                {{ viewingFollowup.action_items }}
              </p>
            </div>

            <!-- Footer: timestamps + actions -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div class="flex gap-4 text-xs text-slate-400">
                <span>Created {{ formatDateTime(viewingFollowup.created_at) }}</span>
                <span class="text-slate-300">·</span>
                <span>Updated {{ formatDateTime(viewingFollowup.updated_at) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <button
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
                  class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
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
import { useToastStore } from '@/stores/toast'
import type { Followup } from '@/types/followup'
import api from '@/services/api'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import FollowupForm from './FollowupForm.vue'

const followupStore = useFollowupStore()
const auth = useAuthStore()
const toast = useToastStore()

const search = ref('')
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

function meetingTypeBadge(type: string): string {
  switch (type) {
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
  } catch (err) {
    deleteError.value = followupStore.error || 'Failed to delete follow-up.'
  } finally {
    deleting.value = false
  }
}

function onSaved() {
  showForm.value = false
  followupStore.fetchFollowups(fetchParams.value).catch(() => {})
}

function onSearchInput() {
  // optional debounce could be added here
}

function applySearch() {
  followupStore.fetchFollowups({ search: search.value }).catch(() => {})
}

function resetSearch() {
  search.value = ''
  followupStore.fetchFollowups({ search: '' }).catch(() => {})
}

async function deleteFollowup(followup: Followup) {
  if (!confirm(`Delete follow-up #${followup.id}? This action cannot be undone.`)) return
  try {
    await followupStore.deleteFollowup(followup.id)
    toast.success('Follow-up deleted successfully.', 'Deleted')
  } catch {
    // error already in store
  }
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
