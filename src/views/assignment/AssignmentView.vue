<template>
  <div class="space-y-6">
    <!-- Student view: My Internship -->
    <template v-if="isStudent">
      <!-- Page Header -->
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">My Internship</h1>
        <p class="text-sm text-slate-500">View your current internship assignment and progress.</p>
      </div>

      <!-- Loading state -->
      <div v-if="internshipLoading" class="flex items-center justify-center py-24">
        <div class="flex flex-col items-center gap-4">
          <svg class="h-10 w-10 animate-spin text-[#21BAEA]" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p class="text-sm font-medium text-slate-500">Loading your internship details...</p>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="internshipError" class="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-16 px-4 text-center">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow mb-4">
          <svg class="h-7 w-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-base font-semibold text-slate-800">Could not load internship info</h3>
        <p class="mt-1 text-sm text-slate-500">{{ internshipError }}</p>
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
      <div v-else-if="!myInternship" class="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-20 px-4 text-center shadow-sm">
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-[#21BAEA]/10 mb-5">
          <svg class="h-10 w-10 text-[#21BAEA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13.255A23.893 23.893 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-slate-800">No internship assignment yet</h3>
        <p class="mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
          Your internship assignment details will appear here once your tutor or admin assigns you to a company. In the meantime, you can explore your dashboard and update your profile.
        </p>
      </div>

      <!-- Rich internship data -->
      <div v-else class="space-y-5">

        <!-- Hero Status Banner -->
        <div
          class="relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white shadow-lg"
          :class="{
            'bg-gradient-to-r from-[#21BAEA] to-[#00A3D9]': myInternship.status === 'In Progress',
            'bg-gradient-to-r from-indigo-500 to-indigo-600': myInternship.status === 'Assigned',
            'bg-gradient-to-r from-emerald-500 to-emerald-600': myInternship.status === 'Completed',
            'bg-gradient-to-r from-red-500 to-red-600': myInternship.status === 'Terminated',
          }"
        >
          <!-- Background decoration -->
          <div class="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
          <div class="absolute -bottom-12 -right-6 h-36 w-36 rounded-full bg-white/5" />

          <div class="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-2">
              <div class="flex items-center gap-2.5">
                <span class="flex h-2.5 w-2.5 rounded-full bg-white" :class="{ 'animate-pulse': myInternship.status === 'In Progress' }" />
                <span class="text-xs font-bold uppercase tracking-[0.15em] text-white/75">
                  <template v-if="myInternship.status === 'In Progress'">Currently Active</template>
                  <template v-else-if="myInternship.status === 'Assigned'">Waiting to Start</template>
                  <template v-else-if="myInternship.status === 'Completed'">Successfully Completed</template>
                  <template v-else>Internship Ended</template>
                </span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">{{ myInternship.position }}</h2>
              <p class="text-base sm:text-lg text-white/80 font-medium">
                <span class="opacity-60">at</span>
                <span class="font-bold"> {{ myInternship.company_name }}</span>
              </p>
            </div>

            <!-- Progress circle -->
            <div v-if="myInternship.status === 'In Progress' || myInternship.status === 'Completed'" class="flex flex-col items-center gap-1 shrink-0">
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
              <p class="text-[11px] font-semibold text-white/70 uppercase tracking-wider">Complete</p>
            </div>
          </div>

          <!-- Progress bar (for In Progress) -->
          <div v-if="myInternship.status === 'In Progress'" class="relative mt-5">
            <div class="flex justify-between text-xs text-white/70 mb-1.5">
              <span>{{ formatDate(myInternship.start_date) }}</span>
              <span>{{ formatDate(myInternship.end_date) }}</span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div
                class="h-full rounded-full bg-white transition-all duration-700"
                :style="{ width: internshipProgress + '%' }"
              />
            </div>
            <p class="mt-1.5 text-center text-xs text-white/60 font-medium">
              {{ daysElapsed }} of {{ totalDays }} days completed · {{ remainingDays }} days remaining
            </p>
          </div>

          <!-- Quick summary for Assigned/Completed/Terminated -->
          <div v-else class="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/70">
            <div class="flex items-center gap-1.5">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatDate(myInternship.start_date) }} – {{ formatDate(myInternship.end_date) }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ totalDays }} days total</span>
            </div>
            <div class="flex items-center gap-1.5">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Tutor: {{ myInternship.tutor_name }}</span>
            </div>
          </div>
        </div>

        <!-- Progress Metric Cards Row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="rounded-xl border border-slate-100 bg-white p-4 shadow-xs text-center">
            <p class="text-2xl font-black text-[#21BAEA]">{{ daysElapsed }}</p>
            <p class="text-xs font-medium text-slate-500 mt-0.5">Days Elapsed</p>
          </div>
          <div class="rounded-xl border border-slate-100 bg-white p-4 shadow-xs text-center">
            <p class="text-2xl font-black text-[#FF9933]">{{ remainingDays > 0 ? remainingDays : 0 }}</p>
            <p class="text-xs font-medium text-slate-500 mt-0.5">Days Remaining</p>
          </div>
          <div class="rounded-xl border border-slate-100 bg-white p-4 shadow-xs text-center">
            <p class="text-2xl font-black text-emerald-500">{{ Math.ceil(totalDays / 7) }}</p>
            <p class="text-xs font-medium text-slate-500 mt-0.5">Total Weeks</p>
          </div>
          <div class="rounded-xl border border-slate-100 bg-white p-4 shadow-xs text-center">
            <p class="text-2xl font-black text-indigo-500">{{ Math.ceil(totalDays / 30) }}</p>
            <p class="text-xs font-medium text-slate-500 mt-0.5">Est. Months</p>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <!-- Company Card -->
          <div class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div class="flex items-center gap-3 mb-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#21BAEA]/10 group-hover:scale-110 transition-transform duration-200">
                <svg class="h-5 w-5 text-[#21BAEA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Company</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#21BAEA]/20 to-blue-100 text-sm font-bold text-[#21BAEA]">
                {{ getInitials(myInternship.company_name) }}
              </div>
              <div class="min-w-0">
                <p class="text-base font-bold text-slate-900 truncate">{{ myInternship.company_name }}</p>
                <p class="text-xs text-slate-400">Host Company</p>
              </div>
            </div>
          </div>

          <!-- Position Card -->
          <div class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div class="flex items-center gap-3 mb-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF9933]/10 group-hover:scale-110 transition-transform duration-200">
                <svg class="h-5 w-5 text-[#FF9933]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13.255A23.893 23.893 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Position / Role</p>
              </div>
            </div>
            <p class="text-base font-bold text-slate-900">{{ myInternship.position }}</p>
            <p class="text-xs text-slate-400 mt-0.5">Internship Role</p>
          </div>

          <!-- Tutor Card -->
          <div class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div class="flex items-center gap-3 mb-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 group-hover:scale-110 transition-transform duration-200">
                <svg class="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Tutor</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-white">
                {{ getInitials(myInternship.tutor_name) }}
              </div>
              <div class="min-w-0">
                <p class="text-base font-bold text-slate-900 truncate">{{ myInternship.tutor_name }}</p>
                <p class="text-xs text-slate-400">PNC Tutor</p>
              </div>
            </div>
          </div>

          <!-- Start Date Card -->
          <div class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div class="flex items-center gap-3 mb-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                <svg class="h-5 w-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Start Date</p>
              </div>
            </div>
            <p class="text-base font-bold text-slate-900">{{ formatDate(myInternship.start_date) }}</p>
            <p class="text-xs text-slate-400 mt-0.5">{{ formatRelativeDate(myInternship.start_date) }}</p>
          </div>

          <!-- End Date Card -->
          <div class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div class="flex items-center gap-3 mb-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
                <svg class="h-5 w-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-slate-400">End Date</p>
              </div>
            </div>
            <p class="text-base font-bold text-slate-900">{{ formatDate(myInternship.end_date) }}</p>
            <p class="text-xs text-slate-400 mt-0.5">{{ myInternship.status === 'Completed' ? 'Completed' : formatRelativeDate(myInternship.end_date) }}</p>
          </div>

          <!-- Status Card -->
          <div class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div class="flex items-center gap-3 mb-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl" :class="statusIconBgClass(myInternship.status)">
                <svg class="h-5 w-5" :class="statusIconColorClass(myInternship.status)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Current Status</p>
              </div>
            </div>
            <span
              class="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold"
              :class="statusBadgeClass(myInternship.status)"
            >
              <span class="h-2 w-2 rounded-full" :class="statusDotClass(myInternship.status)" />
              {{ myInternship.status }}
            </span>
          </div>
        </div>

        <!-- Quick Actions Section -->
        <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Quick Actions</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <router-link
              to="/student/worklogs"
              class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 hover:bg-[#21BAEA]/5 hover:border-[#21BAEA]/30 transition-all duration-200 group"
            >
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#21BAEA]/10 group-hover:scale-110 transition-transform">
                <svg class="h-5 w-5 text-[#21BAEA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-800 group-hover:text-[#21BAEA] transition-colors">Submit Worklog</p>
                <p class="text-xs text-slate-500">Log your weekly hours & tasks</p>
              </div>
            </router-link>

            <router-link
              to="/student/followups"
              class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 hover:bg-[#FF9933]/5 hover:border-[#FF9933]/30 transition-all duration-200 group"
            >
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF9933]/10 group-hover:scale-110 transition-transform">
                <svg class="h-5 w-5 text-[#FF9933]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-800 group-hover:text-[#FF9933] transition-colors">View Follow-ups</p>
                <p class="text-xs text-slate-500">Check your meeting schedules</p>
              </div>
            </router-link>

            <router-link
              to="/student/messages"
              class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-200 group"
            >
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 group-hover:scale-110 transition-transform">
                <svg class="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Messages</p>
                <p class="text-xs text-slate-500">Chat with your tutor</p>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Timeline -->
        <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400">Internship Timeline</h3>
            <span class="text-xs text-slate-400">{{ totalDays }} days total</span>
          </div>
          <div class="relative pl-6">
            <!-- Vertical line -->
            <div class="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#21BAEA] via-slate-200 to-slate-100 rounded-full" />

            <!-- Start event -->
            <div class="relative mb-8 flex items-start gap-4">
              <div class="absolute -left-[14px] flex h-6 w-6 items-center justify-center rounded-full bg-[#21BAEA] ring-4 ring-white shadow">
                <svg class="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="pt-0.5">
                <p class="text-sm font-bold text-slate-800">Internship Started</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ formatDate(myInternship.start_date) }} · {{ formatRelativeDate(myInternship.start_date) }}</p>
              </div>
            </div>

            <!-- Today marker (only when in progress) -->
            <div v-if="myInternship.status === 'In Progress'" class="relative mb-8 flex items-start gap-4">
              <div class="absolute -left-[14px] flex h-6 w-6 items-center justify-center rounded-full bg-[#FF9933] ring-4 ring-white shadow animate-pulse">
                <svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>
              </div>
              <div>
                <p class="text-sm font-extrabold text-[#FF9933]">🔴  Today — Day {{ daysElapsed }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ formatDate(new Date().toISOString()) }} · {{ remainingDays }} days remaining until completion</p>
              </div>
            </div>

            <!-- End event -->
            <div class="relative flex items-start gap-4">
              <div class="absolute -left-[14px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white shadow"
                :class="myInternship.status === 'Completed' ? 'bg-emerald-500' : 'bg-slate-300'">
                <svg v-if="myInternship.status === 'Completed'" class="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>
              </div>
              <div class="pt-0.5">
                <p class="text-sm font-bold" :class="myInternship.status === 'Completed' ? 'text-emerald-600' : 'text-slate-500'">
                  {{ myInternship.status === 'Completed' ? 'Internship Completed 🎉' : 'Expected End Date' }}
                </p>
                <p class="text-xs text-slate-500 mt-0.5">{{ formatDate(myInternship.end_date) }} · {{ formatRelativeDate(myInternship.end_date) }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </template>


    <!-- Admin/Tutor view: Full assignment management -->
    <template v-else>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Internship Assignments
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Manage student internship assignments to companies.
          </p>
        </div>
        <div class="flex items-center gap-3">
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
          <select
            v-model="statusFilter"
            @change="onFilterChange"
            class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="">All Statuses</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Terminated">Terminated</option>
          </select>
          <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by student, company, or tutor..."
            class="h-10 w-60 rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
          />
        </div>
      </div>

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

      <div v-else>
        <div class="overflow-x-auto">
          <table class="hidden w-full border-collapse text-left text-sm md:table">
            <thead>
              <tr
                class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400 dark:border-slate-800 dark:bg-slate-800/50"
              >
                <th class="px-5 py-3.5">Student</th>
                <th class="px-5 py-3.5">Company</th>
                <th class="px-5 py-3.5">Tutor</th>
                <th class="px-5 py-3.5">Position</th>
                <th class="px-5 py-3.5">Duration</th>
                <th class="px-5 py-3.5">Status</th>
                <th class="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
              <tr
                v-for="a in filteredAssignments"
                :key="a.id"
                class="hover:bg-slate-50/30 transition-colors dark:hover:bg-slate-800/30"
              >
                <td class="whitespace-nowrap px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                    >
                      {{ getInitials(a.student_name) }}
                    </div>
                    <span class="font-semibold text-slate-900 dark:text-white">{{
                      a.student_name
                    }}</span>
                  </div>
                </td>
                <td
                  class="whitespace-nowrap px-5 py-4 font-medium text-slate-500 dark:text-slate-400"
                >
                  {{ a.company_name }}
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-500 dark:text-slate-400">
                  {{ a.tutor_name }}
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-500 dark:text-slate-400">
                  {{ a.position }}
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                  {{ formatDate(a.start_date) }} &ndash; {{ formatDate(a.end_date) }}
                </td>
                <td class="whitespace-nowrap px-5 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                    :class="statusBadgeClass(a.status)"
                  >
                    <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(a.status)"></span>
                    {{ a.status }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-right">
                  <button
                    @click="openEdit(a)"
                    class="rounded-lg px-2.5 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteAssignment(a)"
                    class="ml-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-all dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
          <div
            v-for="a in filteredAssignments"
            :key="a.id"
            class="px-4 py-4 hover:bg-slate-50/30 transition-colors dark:hover:bg-slate-800/30"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                >
                  {{ getInitials(a.student_name) }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-slate-900 truncate dark:text-white">
                    {{ a.student_name }}
                  </p>
                  <p class="text-xs text-slate-500 truncate dark:text-slate-400">
                    {{ a.company_name }} &middot; {{ a.position }}
                  </p>
                </div>
                <span class="shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold" :class="statusBadgeClass(a.status)">
                  <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(a.status)"></span>
                  {{ a.status === 'In Progress' ? 'Active' : a.status }}
                </span>
              </div>
              <div class="mt-2 flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                <span>Tutor: {{ a.tutor_name }}</span>
                <span>{{ formatDate(a.start_date) }} &ndash; {{ formatDate(a.end_date) }}</span>
              </div>
              <div class="mt-3 flex items-center gap-2">
                <button
                  @click="openEdit(a)"
                  class="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Edit
                </button>
                <button
                  @click="deleteAssignment(a)"
                  class="flex-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  Delete
                </button>
              </div>
              <span
                class="shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold"
                :class="statusBadgeClass(a.status)"
              >
                <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(a.status)"></span>
                {{ a.status === 'In Progress' ? 'Active' : a.status }}
              </span>
            </div>
            <div class="mt-2 flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
              <span>Tutor: {{ a.tutor_name }}</span>
              <span>{{ formatDate(a.start_date) }} &ndash; {{ formatDate(a.end_date) }}</span>
            </div>
            <div class="mt-3 flex items-center gap-2">
              <button
                @click="openEdit(a)"
                class="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Edit
              </button>
              <button
                @click="deleteAssignment(a)"
                class="flex-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20"
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAssignmentStore } from '@/stores/assignment'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { studentInternshipService } from '@/services/studentInternship'
import type { Assignment } from '@/types/assignment'
import AssignmentForm from '@/components/assignment/AssignmentForm.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

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

function getInitials(name: string | null | undefined): string {
  if (!name) return ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
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
      return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
    case 'In Progress':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'Completed':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'Terminated':
      return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
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
  const page = Number(route.query.page) || 1
  store.fetchAssignments({ page })
})
</script>
