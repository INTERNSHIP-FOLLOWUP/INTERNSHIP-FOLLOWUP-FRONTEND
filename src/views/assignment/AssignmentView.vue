<template>
  <div class="space-y-6">
    <!-- Student view: My Internship -->
    <template v-if="isStudent">
      <!-- Page Header -->
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">My Internship</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">View your current internship assignment and progress.</p>
      </div>

      <!-- Loading state -->
      <div v-if="internshipLoading" class="flex items-center justify-center py-24">
        <div class="flex flex-col items-center gap-4">
          <svg class="h-10 w-10 animate-spin text-[#21BAEA]" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Loading your internship details...</p>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="internshipError" class="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-16 px-4 text-center dark:border-red-900/50 dark:bg-red-950/30">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow mb-4">
          <svg class="h-7 w-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200">Could not load internship info</h3>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ internshipError }}</p>
        <button
          @click="fetchMyInternship"
          class="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#21BAEA] px-4 py-2 text-xs font-bold text-white hover:bg-[#00A3D9] transition-all"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
      </div>

      <!-- No assignment yet -->
      <div v-else-if="!myInternship" class="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-20 px-4 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-[#21BAEA]/10 mb-5">
          <svg class="h-10 w-10 text-[#21BAEA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13.255A23.893 23.893 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-200">No internship assignment yet</h3>
        <p class="mt-2 max-w-md text-sm text-slate-500 leading-relaxed dark:text-slate-400">
          Your internship assignment details will appear here once your tutor or admin assigns you to a company. In the meantime, you can explore your dashboard and update your profile.
        </p>
      </div>

      <!-- Rich internship data -->
      <div v-else class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">

        <!-- Hero Header -->
        <div class="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-sky-400 px-8 py-10">
          <div class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div class="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

          <div class="relative flex flex-col items-center gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div class="flex flex-col items-center gap-5 sm:flex-row sm:items-end">
              <div class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white/50 bg-white shadow-xl dark:bg-slate-800">
                <img
                  v-if="getImageUrl(myInternship.company_logo_url)"
                  :src="getImageUrl(myInternship.company_logo_url)"
                  :alt="myInternship.company_name"
                  class="h-full w-full object-cover"
                  @error="onImageError($event)"
                />
                <span v-else class="text-3xl font-bold text-indigo-600">
                  {{ getInitials(myInternship.company_name) }}
                </span>
              </div>
              <div class="text-center sm:text-left">
                <p class="text-xs font-semibold uppercase tracking-wider text-white/80">
                  <template v-if="myInternship.status === 'In Progress'">Currently Active</template>
                  <template v-else-if="myInternship.status === 'Assigned'">Waiting to Start</template>
                  <template v-else-if="myInternship.status === 'Completed'">Successfully Completed</template>
                  <template v-else>Internship Ended</template>
                </p>
                <h2 class="text-2xl font-bold text-white drop-shadow-sm">{{ myInternship.position }}</h2>
                <div class="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span class="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    <span class="h-1.5 w-1.5 rounded-full bg-white" :class="{ 'animate-pulse': myInternship.status === 'In Progress' }" />
                    {{ myInternship.status }}
                  </span>
                  <span class="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {{ myInternship.company_name }}
                  </span>
                  <span class="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ formatDate(myInternship.start_date) }} – {{ formatDate(myInternship.end_date) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Progress circle -->
            <div v-if="myInternship.status === 'In Progress' || myInternship.status === 'Completed'" class="flex shrink-0 flex-col items-center gap-1 text-white">
              <div class="relative flex h-20 w-20 items-center justify-center">
                <svg class="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2.5" />
                  <circle
                    cx="18" cy="18" r="15.9"
                    fill="none" stroke="white" stroke-width="2.5"
                    stroke-dasharray="100"
                    :stroke-dashoffset="100 - internshipProgress"
                    stroke-linecap="round"
                    style="transition: stroke-dashoffset 0.8s ease"
                  />
                </svg>
                <span class="text-xl font-black">{{ internshipProgress }}%</span>
              </div>
              <p class="text-[11px] font-semibold uppercase tracking-wider text-white/70">Complete</p>
            </div>
          </div>

          <!-- Progress bar (for In Progress) -->
          <div v-if="myInternship.status === 'In Progress'" class="relative mt-6">
            <div class="mb-1.5 flex justify-between text-xs text-white/70">
              <span>{{ formatDate(myInternship.start_date) }}</span>
              <span>{{ formatDate(myInternship.end_date) }}</span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div
                class="h-full rounded-full bg-white transition-all duration-700"
                :style="{ width: internshipProgress + '%' }"
              />
            </div>
            <p class="mt-1.5 text-center text-xs font-medium text-white/60">
              {{ daysElapsed }} of {{ totalDays }} days completed · {{ remainingDays }} days remaining
            </p>
          </div>
        </div>

        <!-- Content Body -->
        <div class="px-8 py-8">
          <!-- Section: Progress Overview -->
          <div class="space-y-5">
            <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span class="h-1 w-1 rounded-full bg-indigo-500"></span>
              Progress Overview
            </h3>
            <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div class="rounded-xl bg-slate-50/60 p-4 text-center dark:bg-slate-700">
                <p class="text-2xl font-bold text-sky-500">{{ daysElapsed }}</p>
                <p class="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">Days Elapsed</p>
              </div>
              <div class="rounded-xl bg-slate-50/60 p-4 text-center dark:bg-slate-700">
                <p class="text-2xl font-bold text-amber-500">{{ remainingDays > 0 ? remainingDays : 0 }}</p>
                <p class="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">Days Remaining</p>
              </div>
              <div class="rounded-xl bg-slate-50/60 p-4 text-center dark:bg-slate-700">
                <p class="text-2xl font-bold text-emerald-500">{{ Math.ceil(totalDays / 7) }}</p>
                <p class="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">Total Weeks</p>
              </div>
              <div class="rounded-xl bg-slate-50/60 p-4 text-center dark:bg-slate-700">
                <p class="text-2xl font-bold text-indigo-500">{{ Math.ceil(totalDays / 30) }}</p>
                <p class="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">Est. Months</p>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="my-8 border-t border-slate-100 dark:border-slate-700" />

          <!-- Section: Your Team -->
          <div class="space-y-5">
            <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span class="h-1 w-1 rounded-full bg-sky-400"></span>
              Your Team
            </h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <!-- Company -->
              <div class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50 dark:hover:bg-slate-700">
                <div class="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700">
                  <img
                    v-if="getImageUrl(myInternship.company_logo_url)"
                    :src="getImageUrl(myInternship.company_logo_url)"
                    :alt="myInternship.company_name"
                    class="h-full w-full object-cover"
                    @error="onImageError($event)"
                  />
                  <div v-else class="flex h-full w-full items-center justify-center bg-sky-50 dark:bg-sky-900/30">
                    <svg class="h-6 w-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-medium text-slate-400 dark:text-slate-500">Host Company</p>
                  <p class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{{ myInternship.company_name }}</p>
                </div>
              </div>

              <!-- Tutor -->
              <div class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50 dark:hover:bg-slate-700">
                <div class="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-emerald-100 dark:border-emerald-800">
                  <img
                    v-if="getImageUrl(myInternship.tutor_photo_url)"
                    :src="getImageUrl(myInternship.tutor_photo_url)"
                    :alt="myInternship.tutor_name"
                    class="h-full w-full object-cover"
                    @error="onImageError($event)"
                  />
                  <div v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-white">
                    {{ getInitials(myInternship.tutor_name) }}
                  </div>
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-medium text-slate-400 dark:text-slate-500">PNC Tutor</p>
                  <p class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{{ myInternship.tutor_name }}</p>
                </div>
              </div>

              <!-- Supervisor -->
              <div class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50 dark:hover:bg-slate-700">
                <div class="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-amber-100 dark:border-amber-800">
                  <img
                    v-if="getImageUrl(myInternship.supervisor_photo_url)"
                    :src="getImageUrl(myInternship.supervisor_photo_url)"
                    :alt="myInternship.supervisor_name || 'Supervisor'"
                    class="h-full w-full object-cover"
                    @error="onImageError($event)"
                  />
                  <div v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-white">
                    {{ getInitials(myInternship.supervisor_name) }}
                  </div>
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-medium text-slate-400 dark:text-slate-500">Company Supervisor</p>
                  <p class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{{ myInternship.supervisor_name || 'Not assigned' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="my-8 border-t border-slate-100 dark:border-slate-700" />

          <!-- Section: Assignment Details -->
          <div class="space-y-5">
            <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span class="h-1 w-1 rounded-full bg-violet-400"></span>
              Assignment Details
            </h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div class="rounded-xl bg-slate-50/60 p-4 dark:bg-slate-700">
                <p class="text-xs font-medium text-slate-400 dark:text-slate-500">Position / Role</p>
                <p class="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{{ myInternship.position }}</p>
              </div>
              <div class="rounded-xl bg-slate-50/60 p-4 dark:bg-slate-700">
                <p class="text-xs font-medium text-slate-400 dark:text-slate-500">Start Date</p>
                <p class="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{{ formatDate(myInternship.start_date) }}</p>
                <p class="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{{ formatRelativeDate(myInternship.start_date) }}</p>
              </div>
              <div class="rounded-xl bg-slate-50/60 p-4 dark:bg-slate-700">
                <p class="text-xs font-medium text-slate-400 dark:text-slate-500">End Date</p>
                <p class="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{{ formatDate(myInternship.end_date) }}</p>
                <p class="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{{ myInternship.status === 'Completed' ? 'Completed' : formatRelativeDate(myInternship.end_date) }}</p>
              </div>
              <div class="rounded-xl bg-slate-50/60 p-4 dark:bg-slate-700">
                <p class="text-xs font-medium text-slate-400 dark:text-slate-500">Current Status</p>
                <span
                  class="mt-1.5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold"
                  :class="statusBadgeClass(myInternship.status)"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(myInternship.status)" />
                  {{ myInternship.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="my-8 border-t border-slate-100 dark:border-slate-700" />

          <!-- Section: Internship Timeline -->
          <div class="space-y-5">
            <div class="flex items-center justify-between">
              <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span class="h-1 w-1 rounded-full bg-emerald-400"></span>
                Internship Timeline
              </h3>
              <span class="text-xs text-slate-400 dark:text-slate-500">{{ totalDays }} days total</span>
            </div>
            <div class="relative pl-6">
              <!-- Vertical line -->
              <div class="absolute bottom-2 left-2.5 top-2 w-0.5 rounded-full bg-gradient-to-b from-indigo-500 via-slate-200 to-slate-100 dark:via-slate-600 dark:to-slate-700" />

              <!-- Start event -->
              <div class="relative mb-8 flex items-start gap-4">
                <div class="absolute -left-[14px] flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 shadow ring-4 ring-white dark:ring-slate-800">
                  <svg class="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="pt-0.5">
                  <p class="text-sm font-bold text-slate-800 dark:text-slate-200">Internship Started</p>
                  <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{{ formatDate(myInternship.start_date) }} · {{ formatRelativeDate(myInternship.start_date) }}</p>
                </div>
              </div>

              <!-- Today marker (only when in progress) -->
              <div v-if="myInternship.status === 'In Progress'" class="relative mb-8 flex items-start gap-4">
                <div class="absolute -left-[14px] flex h-6 w-6 animate-pulse items-center justify-center rounded-full bg-amber-500 shadow ring-4 ring-white dark:ring-slate-800">
                  <svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>
                </div>
                <div>
                  <p class="text-sm font-extrabold text-amber-600 dark:text-amber-400">Today — Day {{ daysElapsed }}</p>
                  <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{{ formatDate(new Date().toISOString()) }} · {{ remainingDays }} days remaining until completion</p>
                </div>
              </div>

              <!-- End event -->
              <div class="relative flex items-start gap-4">
                <div class="absolute -left-[14px] flex h-6 w-6 items-center justify-center rounded-full shadow ring-4 ring-white dark:ring-slate-800"
                  :class="myInternship.status === 'Completed' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'">
                  <svg v-if="myInternship.status === 'Completed'" class="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>
                </div>
                <div class="pt-0.5">
                  <p class="text-sm font-bold" :class="myInternship.status === 'Completed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'">
                    {{ myInternship.status === 'Completed' ? 'Internship Completed 🎉' : 'Expected End Date' }}
                  </p>
                  <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{{ formatDate(myInternship.end_date) }} · {{ formatRelativeDate(myInternship.end_date) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Footer -->
        <div class="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-8 py-5 sm:flex-row dark:border-slate-700 dark:bg-slate-700">
          <div class="flex items-center gap-2">
            <span class="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
            <span class="text-xs font-medium text-slate-400 dark:text-slate-400">{{ myInternship.status }} internship record</span>
          </div>
          <div class="flex flex-wrap items-center justify-end gap-2">
            <router-link
              to="/student/messages"
              class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Messages
            </router-link>
            <router-link
              to="/student/followups"
              class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Follow-ups
            </router-link>
            <router-link
              to="/student/worklogs"
              class="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Submit Worklog
            </router-link>
          </div>
        </div>

      </div>
    </template>


    <!-- Admin/Tutor view: Full assignment management -->
    <template v-else>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">
            Internship Assignments
          </h1>
          <p class="mt-1 text-sm text-slate-500">
            Manage student internship assignments to companies.
          </p>
        </div>
        <button
          @click="openCreate"
          class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/20 transition-all duration-200 hover:from-indigo-700 hover:to-indigo-600 hover:shadow-md active:scale-95"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Assignment
        </button>
      </div>

      <!-- Summary Stats Bar -->
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div class="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total</p>
              <p class="text-xl font-bold text-slate-900">{{ store.assignmentCount }}</p>
            </div>
          </div>
        </div>
        <div class="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg" :class="statusIconBgClass('Assigned')">
              <svg class="h-5 w-5" :class="statusIconColorClass('Assigned')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Assigned</p>
              <p class="text-xl font-bold text-slate-900">{{ assignedCount }}</p>
            </div>
          </div>
        </div>
        <div class="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg" :class="statusIconBgClass('In Progress')">
              <svg class="h-5 w-5" :class="statusIconColorClass('In Progress')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">In Progress</p>
              <p class="text-xl font-bold text-slate-900">{{ inProgressCount }}</p>
            </div>
          </div>
        </div>
        <div class="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg" :class="statusIconBgClass('Completed')">
              <svg class="h-5 w-5" :class="statusIconColorClass('Completed')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed</p>
              <p class="text-xl font-bold text-slate-900">{{ completedCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-3">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by student, company, or tutor..."
          class="h-10 w-full min-w-0 flex-1 basis-[220px] rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 placeholder-slate-400 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />

        <select
          v-model="statusFilter"
          @change="onFilterChange"
          class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">All Statuses</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Terminated">Terminated</option>
        </select>

        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Clear
        </button>
      </div>

      <ActiveFilters :filters="activeFilterList" @remove="removeFilter" @clear-all="clearFilters" />

      <div
        v-if="store.loading && store.assignments.length === 0"
        class="flex items-center justify-center py-16"
      >
        <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>

      <div
        v-else-if="store.error && store.assignments.length === 0"
        class="flex flex-col items-center justify-center py-16 text-center px-4"
      >
        <svg class="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <p class="mt-3 text-sm font-semibold text-red-500">{{ store.error }}</p>
        <button
          @click="fetchPage({ page: 1 })"
          class="mt-3 rounded-lg bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition-colors"
        >
          Try Again
        </button>
      </div>

      <div v-else-if="filteredAssignments.length === 0">
        <div
          v-if="searchQuery || statusFilter"
          class="flex flex-col items-center justify-center py-16 text-center px-4"
        >
          <svg
            class="h-10 w-10 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p class="mt-3 text-sm font-semibold text-slate-400">
            No assignments match your filters.
          </p>
          <button
            @click="clearFilters"
            class="mt-2 text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
          >
            Clear filters
          </button>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-16 text-center px-4">
          <svg
            class="h-12 w-12 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <p class="mt-4 text-sm font-semibold text-slate-400">No assignments created yet.</p>
          <p class="mt-1 text-xs text-slate-400">
            Get started by creating a new internship assignment.
          </p>
          <button
            @click="openCreate"
            class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Assignment
          </button>
        </div>
      </div>

      <div v-else class="rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="hidden w-full text-left text-sm md:table">
            <thead>
              <tr
                class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                <th class="px-6 py-3.5 font-medium">Photo</th>
                <th class="px-6 py-3.5 font-medium">Full Name</th>
                <th class="px-6 py-3.5 font-medium">Company</th>
                <th class="px-6 py-3.5 font-medium">Tutor</th>
                <th class="px-6 py-3.5 font-medium">Position</th>
                <th class="px-6 py-3.5 font-medium">Duration</th>
                <th class="px-6 py-3.5 font-medium">Status</th>
                <th class="px-6 py-3.5 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr
                v-for="(a, index) in filteredAssignments"
                :key="a.id"
                class="transition-colors hover:bg-slate-50/50"
              >
                <td class="whitespace-nowrap px-6 py-4">
                  <img
                    v-if="getStudentPhoto(a)"
                    :src="getStudentPhoto(a)"
                    :alt="a.student_name"
                    class="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-xs"
                  />
                  <div
                    v-else
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-100 to-blue-50 text-xs font-bold text-indigo-700 ring-2 ring-white shadow-xs"
                  >
                    {{ getInitials(a.student_name) }}
                  </div>
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span class="font-semibold text-slate-900">{{ a.student_name }}</span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 font-medium text-slate-500">
                  {{ a.company_name }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-slate-500">
                  {{ a.tutor_name }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-slate-500">
                  {{ a.position }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                  {{ formatDate(a.start_date) }} &ndash; {{ formatDate(a.end_date) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                    :class="statusBadgeClass(a.status)"
                  >
                    <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(a.status)"></span>
                    {{ a.status }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-center">
                  <div class="relative inline-block text-center">
                    <button
                      type="button"
                      @click.stop="toggleKebab(a.id)"
                      title="Actions"
                      class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 active:scale-95 mx-auto"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>

                    <transition name="fade">
                      <div
                        v-if="openKebabId === a.id"
                        class="absolute right-0 z-30 w-40 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none text-left"
                        :class="index < (filteredAssignments.length > 2 ? filteredAssignments.length - 2 : 1) && filteredAssignments.length > 1 ? 'top-full mt-1 origin-top-right' : 'bottom-full mb-1 origin-bottom-right'"
                      >
                        <button
                          type="button"
                          @click.stop="openKebabId = null; openEdit(a)"
                          class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                        >
                          <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          type="button"
                          @click.stop="openKebabId = null; deleteAssignment(a)"
                          class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <svg class="h-4 w-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </transition>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="divide-y divide-slate-100 md:hidden">
          <div
            v-for="a in filteredAssignments"
            :key="a.id"
            class="p-4 transition-colors hover:bg-slate-50/50 space-y-3"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3 min-w-0">
                <img
                  v-if="getStudentPhoto(a)"
                  :src="getStudentPhoto(a)"
                  :alt="a.student_name"
                  class="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white shadow-xs"
                />
                <div
                  v-else
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600"
                >
                  {{ getInitials(a.student_name) }}
                </div>
                <div class="min-w-0">
                  <p class="font-semibold text-slate-900 truncate">{{ a.student_name }}</p>
                  <p class="text-xs text-slate-500 truncate">{{ a.company_name }} &middot; {{ a.position }}</p>
                </div>
              </div>
              <span
                class="shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                :class="statusBadgeClass(a.status)"
              >
                <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(a.status)"></span>
                {{ a.status === 'In Progress' ? 'Active' : a.status }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600">
              <div>
                <span class="font-medium text-slate-500">Tutor:</span>
                {{ a.tutor_name }}
              </div>
              <div>
                <span class="font-medium text-slate-500">Duration:</span>
                {{ formatDate(a.start_date) }} &ndash; {{ formatDate(a.end_date) }}
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="openEdit(a)"
                class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Edit
              </button>
              <button
                @click="deleteAssignment(a)"
                class="flex-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <BasePagination :meta="store.pagination" @page-change="setPage" />
      </div>

      <AssignmentForm
        :show="showForm"
        :assignment-id="editingId"
        @close="closeForm"
        @saved="onSaved"
      />

      <ConfirmDialog
        :show="confirm.show.value"
        :title="confirm.title.value"
        :message="confirm.message.value"
        :confirm-text="confirm.confirmText.value"
        :cancel-text="confirm.cancelText.value"
        :loading="confirm.loading.value"
        :error="confirm.error.value"
        @confirm="handleConfirmDelete"
        @cancel="confirm.cancel()"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAssignmentStore } from '@/stores/assignment'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { studentInternshipService } from '@/services/studentInternship'
import type { Assignment } from '@/types/assignment'
import { normalizeImageUrl } from '@/utils/normalizeImageUrl'
import AssignmentForm from '@/components/assignment/AssignmentForm.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import ActiveFilters from '@/components/ui/ActiveFilters.vue'
import type { ActiveFilter } from '@/components/ui/ActiveFilters.vue'

const route = useRoute()
const router = useRouter()
const store = useAssignmentStore()
const auth = useAuthStore()
const toast = useToastStore()
const confirm = useConfirmDialog()

const isStudent = computed(() => auth.userRole === 'student')
const searchQuery = ref('')
const statusFilter = ref('')
const showForm = ref(false)
const editingId = ref<number | undefined>(undefined)
const openKebabId = ref<number | null>(null)

// Student internship state
const myInternship = ref<Assignment | null>(null)
const internshipLoading = ref(false)
const internshipError = ref<string | null>(null)

// ── Internship Computed Metrics ──

const totalDays = computed(() => {
  if (!myInternship.value?.start_date || !myInternship.value?.end_date) return 0
  const start = new Date(myInternship.value.start_date)
  const end = new Date(myInternship.value.end_date)
  const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
})

const daysElapsed = computed(() => {
  if (!myInternship.value?.start_date) return 0
  const start = new Date(myInternship.value.start_date)
  const now = new Date()
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, Math.min(diff, totalDays.value))
})

const remainingDays = computed(() => {
  return Math.max(0, totalDays.value - daysElapsed.value)
})

const internshipProgress = computed(() => {
  if (!totalDays.value) return 0
  if (myInternship.value?.status === 'Completed') return 100
  if (myInternship.value?.status === 'Assigned') return 0
  return Math.min(100, Math.round((daysElapsed.value / totalDays.value) * 100))
})

let deleteTarget: Assignment | null = null

const filteredAssignments = computed(() => {
  let list = store.assignments

  if (statusFilter.value) {
    list = list.filter((a) => a.status === statusFilter.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(
      (a) =>
        a.student_name.toLowerCase().includes(q) ||
        a.company_name.toLowerCase().includes(q) ||
        a.tutor_name.toLowerCase().includes(q) ||
        a.position.toLowerCase().includes(q),
    )
  }

  return list
})

const assignedCount = computed(() => store.assignments.filter((a) => a.status === 'Assigned').length)
const inProgressCount = computed(() => store.assignments.filter((a) => a.status === 'In Progress').length)
const completedCount = computed(() => store.assignments.filter((a) => a.status === 'Completed').length)

const hasActiveFilters = computed(() => !!searchQuery.value || !!statusFilter.value)
const activeFilterList = computed<ActiveFilter[]>(() => {
  const list: ActiveFilter[] = []
  if (searchQuery.value) list.push({ key: 'search', label: 'Search', value: searchQuery.value })
  if (statusFilter.value) list.push({ key: 'status', label: 'Status', value: statusFilter.value })
  return list
})

function removeFilter(key: string): void {
  if (key === 'search') searchQuery.value = ''
  if (key === 'status') statusFilter.value = ''
  setPage(1)
}

function toggleKebab(id: number): void {
  openKebabId.value = openKebabId.value === id ? null : id
}

function handleWindowClick(): void {
  openKebabId.value = null
}

function getInitials(name: string | null | undefined): string {
  if (!name) return ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  const normalized = normalizeImageUrl(url)
  if (!normalized) return undefined
  if (/^https?:\/\//.test(normalized)) return normalized
  const base = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/?api\/?$/, '')
  if (normalized.startsWith('/storage/')) {
    return `${base}${normalized}`
  }
  return `${base}/storage/${normalized.replace(/^\//, '')}`
}

function onImageError(event: Event) {
  const target = event.target as HTMLElement
  target.style.display = 'none'
}

function getStudentPhoto(assignment: Assignment): string | undefined {
  return assignment.student_photo_url || assignment.student?.photo_url || undefined
}

function formatDate(date?: string): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatRelativeDate(date?: string): string {
  if (!date) return ''
  const now = new Date()
  const target = new Date(date)
  const diffMs = target.getTime() - now.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  const absDays = Math.abs(diffDays)

  if (absDays === 0) return 'Today'
  if (absDays === 1) return diffDays > 0 ? 'Tomorrow' : 'Yesterday'
  if (absDays < 30) return diffDays > 0 ? `In ${absDays} days` : `${absDays} days ago`
  const months = Math.floor(absDays / 30)
  if (months < 12) return diffDays > 0 ? `In ${months} month${months > 1 ? 's' : ''}` : `${months} month${months > 1 ? 's' : ''} ago`
  const years = Math.floor(months / 12)
  return diffDays > 0 ? `In ${years} year${years > 1 ? 's' : ''}` : `${years} year${years > 1 ? 's' : ''} ago`
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'Assigned':
      return 'bg-indigo-50 text-indigo-700'
    case 'In Progress':
      return 'bg-amber-50 text-amber-700'
    case 'Completed':
      return 'bg-emerald-50 text-emerald-700'
    case 'Terminated':
      return 'bg-red-50 text-red-700'
    default:
      return 'bg-slate-50 text-slate-600'
  }
}

function statusDotClass(status: string): string {
  switch (status) {
    case 'Assigned':
      return 'bg-indigo-500'
    case 'In Progress':
      return 'bg-amber-500'
    case 'Completed':
      return 'bg-emerald-500'
    case 'Terminated':
      return 'bg-red-500'
    default:
      return 'bg-slate-400'
  }
}

function statusIconBgClass(status: string): string {
  switch (status) {
    case 'Assigned': return 'bg-indigo-50'
    case 'In Progress': return 'bg-amber-50'
    case 'Completed': return 'bg-emerald-50'
    case 'Terminated': return 'bg-red-50'
    default: return 'bg-slate-50'
  }
}

function statusIconColorClass(status: string): string {
  switch (status) {
    case 'Assigned': return 'text-indigo-500'
    case 'In Progress': return 'text-amber-500'
    case 'Completed': return 'text-emerald-500'
    case 'Terminated': return 'text-red-500'
    default: return 'text-slate-400'
  }
}

function fetchPage({ page }: { page: number }) {
  store.fetchAssignments({ page, status: statusFilter.value || undefined })
}

function setPage(page: number) {
  fetchPage({ page })
  router.replace({ query: { page: page > 1 ? String(page) : undefined } })
}

function onFilterChange() {
  setPage(1)
}

function clearFilters() {
  searchQuery.value = ''
  statusFilter.value = ''
  setPage(1)
}

function openCreate() {
  editingId.value = undefined
  showForm.value = true
}

function openEdit(assignment: Assignment) {
  editingId.value = assignment.id
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingId.value = undefined
}

async function onSaved() {
  closeForm()
  await fetchPage({ page: store.pagination?.current_page ?? 1 })
  toast.success('Assignment saved successfully.')
}

async function deleteAssignment(assignment: Assignment) {
  deleteTarget = assignment
  const confirmed = await confirm.open({
    title: 'Delete Assignment',
    message: `Are you sure you want to delete the assignment for "${assignment.student_name}"? This action cannot be undone.`,
  })
  if (!confirmed) return
  await handleConfirmDelete()
}

async function handleConfirmDelete() {
  if (!deleteTarget) return
  await confirm.confirmAsync(async () => {
    await store.deleteAssignment(deleteTarget!.id)
    if (!store.error) {
      toast.success(`Assignment for "${deleteTarget!.student_name}" deleted successfully.`)
    }
  })
}

async function fetchMyInternship() {
  internshipLoading.value = true
  internshipError.value = null
  try {
    myInternship.value = await studentInternshipService.getMyInternship()
  } catch (err: unknown) {
    const axiosErr = err as { response?: { status?: number; data?: { message?: string } } }
    if (axiosErr.response?.status === 404) {
      // No internship assigned yet — this is normal
      myInternship.value = null
    } else {
      internshipError.value = axiosErr.response?.data?.message || 'Failed to load internship information.'
    }
  } finally {
    internshipLoading.value = false
  }
}

onMounted(() => {
  if (isStudent.value) {
    fetchMyInternship()
    return
  }
  window.addEventListener('click', handleWindowClick)
  const page = Number(route.query.page) || 1
  store.fetchAssignments({ page })
})

onUnmounted(() => {
  window.removeEventListener('click', handleWindowClick)
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
</style>
