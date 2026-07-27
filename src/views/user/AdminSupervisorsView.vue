<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight text-slate-900">Supervisors Management</h1>
        <p class="mt-1 text-sm font-medium text-slate-500">
          Manage company supervisors, assigned companies, and account statuses.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="refresh"
          :disabled="loading"
          class="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-amber-200 hover:bg-amber-50/50 disabled:opacity-60"
        >
          <svg
            class="h-4 w-4 text-slate-500"
            :class="{ 'animate-spin': loading }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
        <button
          @click="openCreateModal"
          class="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-4 text-sm font-semibold text-white shadow-md shadow-amber-500/20 transition-all hover:from-amber-700 hover:to-amber-600 hover:shadow-lg active:scale-95"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Supervisor
        </button>
      </div>
    </div>

    <!-- Stat Cards Grid -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Supervisors -->
      <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Total Supervisors</p>
            <p class="mt-1 text-2xl font-black text-slate-900">{{ totalSupervisors }}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Active Supervisors -->
      <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Active</p>
            <p class="mt-1 text-2xl font-black text-emerald-600">{{ activeCount }}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Deactivated Supervisors -->
      <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Deactivated</p>
            <p class="mt-1 text-2xl font-black text-rose-600">{{ deactivatedCount }}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Partner Companies -->
      <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Partner Companies</p>
            <p class="mt-1 text-2xl font-black text-indigo-600">{{ companies.length }}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m3 0h1m-1-4h.01M9 16h.01M9 12h.01M9 8h.01M15 16h.01M15 12h.01M15 8h.01" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <!-- Search Input -->
      <div class="relative min-w-[220px] flex-1">
        <svg class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search supervisor name or email..."
          class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-9 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          &times;
        </button>
      </div>

      <!-- Company Filter -->
      <div class="w-full sm:w-auto">
        <select
          v-model="companyFilter"
          class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium text-slate-700 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
        >
          <option value="">All Companies</option>
          <option v-for="c in companies" :key="c.id" :value="c.id">
            {{ c.company_name || c.name }}
          </option>
        </select>
      </div>

      <!-- Status Filter -->
      <div class="w-full sm:w-auto">
        <select
          v-model="statusFilter"
          class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium text-slate-700 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="deactivated">Deactivated Only</option>
        </select>
      </div>

      <!-- Sort Filter -->
      <div class="w-full sm:w-auto">
        <select
          v-model="sortOrder"
          class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium text-slate-700 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name_asc">Name (A - Z)</option>
          <option value="name_desc">Name (Z - A)</option>
        </select>
      </div>

      <!-- Reset button -->
      <button
        v-if="hasActiveFilters"
        @click="resetFilters"
        class="flex h-10 items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100"
      >
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Clear Filters
      </button>
    </div>

    <!-- Error Banner -->
    <div
      v-if="error"
      role="alert"
      class="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm font-medium text-rose-700 shadow-sm"
    >
      <svg class="h-5 w-5 shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="flex-1">{{ error }}</span>
      <button @click="error = ''" class="rounded-lg p-1 transition-colors hover:bg-rose-100">&times;</button>
    </div>

    <!-- Table & List View -->
    <div class="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      <!-- Loading Skeleton -->
      <div v-if="loading" class="divide-y divide-slate-100">
        <div v-for="n in 4" :key="n" class="flex items-center gap-4 px-6 py-4 animate-pulse">
          <div class="h-10 w-10 rounded-full bg-slate-200" />
          <div class="flex-1 space-y-2">
            <div class="h-4 w-1/3 rounded bg-slate-200" />
            <div class="h-3 w-1/4 rounded bg-slate-100" />
          </div>
          <div class="h-6 w-24 rounded-full bg-slate-200" />
          <div class="h-8 w-20 rounded-lg bg-slate-200" />
        </div>
      </div>

      <!-- Data Table -->
      <div v-else-if="supervisors.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th class="px-6 py-4 font-semibold">Photo</th>
                <th class="px-6 py-4 font-semibold">Supervisor</th>
                <th class="px-6 py-4 font-semibold">Email</th>
                <th class="px-6 py-4 font-semibold">Phone</th>
                <th class="px-6 py-4 font-semibold">Assigned Company</th>
                <th class="px-6 py-4 font-semibold">Status</th>
                <th class="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="(supervisor, index) in supervisors"
                :key="supervisor.id"
                @click="viewSupervisor(supervisor)"
                class="cursor-pointer transition-colors hover:bg-slate-50/70"
              >
                <!-- Photo -->
                <td class="whitespace-nowrap px-6 py-4">
                  <div class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-xs font-extrabold text-emerald-800 shadow-xs ring-2 ring-white">
                    <img
                      v-if="supervisor.avatar_url"
                      :src="supervisor.avatar_url"
                      :alt="getSupervisorName(supervisor)"
                      class="h-full w-full rounded-2xl object-cover"
                    />
                    <span v-else>{{ getInitials(getSupervisorName(supervisor)) }}</span>
                  </div>
                </td>

                <!-- Supervisor Name -->
                <td class="whitespace-nowrap px-6 py-4">
                  <div>
                    <div class="font-bold text-slate-900 flex items-center gap-1.5">
                      {{ getSupervisorName(supervisor) }}
                    </div>
                    <span class="text-xs text-slate-400 font-medium">Supervisor</span>
                  </div>
                </td>

                <!-- Email -->
                <td class="whitespace-nowrap px-6 py-4 text-slate-600">
                  <div class="flex items-center gap-1.5 group max-w-[220px]">
                    <span class="truncate" :title="supervisor.email">{{ supervisor.email }}</span>
                    <button
                      @click.stop="copyEmail(supervisor.email)"
                      title="Copy email address"
                      class="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-amber-600 p-0.5"
                    >
                      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </td>

                <!-- Phone -->
                <td class="whitespace-nowrap px-6 py-4 text-slate-600 font-medium">
                  <a
                    v-if="supervisor.phone"
                    :href="`tel:${supervisor.phone}`"
                    class="hover:text-amber-600 hover:underline inline-flex items-center gap-1"
                  >
                    {{ supervisor.phone }}
                  </a>
                  <span v-else class="text-slate-300 font-normal">—</span>
                </td>

                <!-- Company -->
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    v-if="getCompanyName(supervisor) !== '—'"
                    class="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200/50"
                  >
                    <svg class="h-3.5 w-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m3 0h1m-1-4h.01M9 16h.01M9 12h.01M9 8h.01M15 16h.01M15 12h.01M15 8h.01" />
                    </svg>
                    {{ getCompanyName(supervisor) }}
                  </span>
                  <span v-else class="text-slate-400 text-xs italic">Unassigned</span>
                </td>

                <!-- Status -->
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold"
                    :class="supervisor.deleted_at ? 'bg-rose-50 text-rose-700 border border-rose-200/60' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'"
                  >
                    <span class="relative flex h-2 w-2">
                      <span
                        v-if="!supervisor.deleted_at"
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                      />
                      <span
                        class="relative inline-flex rounded-full h-2 w-2"
                        :class="supervisor.deleted_at ? 'bg-rose-500' : 'bg-emerald-500'"
                      />
                    </span>
                    {{ supervisor.deleted_at ? 'Deactivated' : 'Active' }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="whitespace-nowrap px-6 py-4 text-center">
                  <div class="relative inline-block text-center">
                    <button
                      type="button"
                      @click.stop="toggleKebab(supervisor.id)"
                      title="Actions"
                      class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 active:scale-95 mx-auto"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>

                    <!-- Kebab Dropdown Menu -->
                    <transition name="fade">
                      <div
                        v-if="openKebabId === supervisor.id"
                        class="absolute right-0 z-30 w-48 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none text-left"
                        :class="index < (supervisors.length > 2 ? supervisors.length - 2 : 1) && supervisors.length > 1 ? 'top-full mt-1 origin-top-right' : 'bottom-full mb-1 origin-bottom-right'"
                      >
                        <button
                          type="button"
                          @click.stop="openKebabId = null; viewSupervisor(supervisor)"
                          class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-amber-600 transition-colors"
                        >
                          <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </button>

                        <button
                          type="button"
                          @click.stop="openKebabId = null; editSupervisor(supervisor)"
                          class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-amber-600 transition-colors"
                        >
                          <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Supervisor
                        </button>

                        <button
                          v-if="!supervisor.deleted_at"
                          type="button"
                          @click.stop="openKebabId = null; toggleStatus(supervisor)"
                          class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 transition-colors"
                        >
                          <svg class="h-4 w-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                          Deactivate
                        </button>

                        <button
                          v-else
                          type="button"
                          @click.stop="openKebabId = null; toggleStatus(supervisor)"
                          class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                          <svg class="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Activate
                        </button>

                        <div class="my-1 h-px bg-slate-100" />

                        <button
                          type="button"
                          @click.stop="openKebabId = null; deleteSupervisor(supervisor)"
                          class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <svg class="h-4 w-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete Supervisor
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
        <BasePagination
          :meta="pagination"
          @page-change="goToPage"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="mt-4 text-base font-bold text-slate-900">No supervisors found</h3>
        <p class="mt-1 text-sm text-slate-500 max-w-sm">
          {{ hasActiveFilters ? 'No supervisors matched your active filters. Try adjusting your search query or filters.' : 'No company supervisors have been added yet. Click below to add one.' }}
        </p>
        <div class="mt-5 flex items-center gap-3">
          <button
            v-if="hasActiveFilters"
            @click="resetFilters"
            class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Clear Filters
          </button>
          <button
            @click="openCreateModal"
            class="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700"
          >
            Add Supervisor
          </button>
        </div>
      </div>
    </div>

    <!-- Supervisor Form Modal -->
    <transition name="fade">
      <div
        v-if="showFormModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm overflow-y-auto py-8"
        @click.self="closeFormModal"
      >
        <div class="w-[92%] max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl my-8">
          <SupervisorForm
            :supervisor-id="editingSupervisorId"
            :initial-company-id="creatingCompanyId"
            @saved="onSupervisorSaved"
            @cancel="closeFormModal"
          />
        </div>
      </div>
    </transition>

    <!-- Supervisor Details Modal -->
    <SupervisorDetailsModal
      :show="showDetailsModal"
      :supervisor="selectedSupervisor"
      @close="closeDetailsModal"
      @edit="openEditFromDetails"
    />

    <!-- Confirm Action Dialog -->
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
import api from '@/services/api'
import { useToastStore } from '@/stores/toast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import SupervisorForm from '@/components/supervisor/SupervisorForm.vue'
import SupervisorDetailsModal from '@/components/supervisor/SupervisorDetailsModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import BasePagination, { type PaginationMeta } from '@/components/ui/BasePagination.vue'

interface Company {
  id: number
  company_name: string
  name?: string
  address?: string
  industry?: string
  website?: string
  email?: string
}

interface SupervisorProfile {
  company?: Company
}

interface Supervisor {
  id: number
  first_name: string
  last_name: string
  name: string
  email: string
  phone: string | null
  avatar_url?: string | null
  role?: { id: number; name: string }
  supervisor_profile?: SupervisorProfile
  company_name?: string
  created_at?: string
  deleted_at: string | null
}

const toast = useToastStore()
const {
  show: confirmShow,
  loading: confirmLoading,
  error: confirmError,
  open: confirmOpen,
  cancel: confirmCancel,
  confirmAsync: confirmAsyncFn,
} = useConfirmDialog()

const supervisors = ref<Supervisor[]>([])
const companies = ref<Company[]>([])
const loading = ref(false)
const error = ref('')

const searchQuery = ref('')
const companyFilter = ref<string | number>('')
const statusFilter = ref<'all' | 'active' | 'deactivated'>('all')
const sortOrder = ref<'newest' | 'oldest' | 'name_asc' | 'name_desc'>('newest')

const currentPage = ref(1)
const pagination = ref<PaginationMeta | null>(null)
const totalSupervisors = ref(0)
const activeCount = ref(0)
const deactivatedCount = ref(0)

const showFormModal = ref(false)
const showDetailsModal = ref(false)
const selectedSupervisor = ref<Supervisor | null>(null)

const editingSupervisorId = ref<number | undefined>(undefined)
const creatingCompanyId = ref<number | undefined>(undefined)

const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmButtonText = ref('Confirm')

type ActionType = 'delete' | 'activate' | 'deactivate'
const pendingAction = ref<{ type: ActionType; supervisor: Supervisor } | null>(null)

const hasActiveFilters = computed(() => {
  return !!searchQuery.value || !!companyFilter.value || statusFilter.value !== 'all' || sortOrder.value !== 'newest'
})

function getSupervisorName(supervisor: Supervisor): string {
  return supervisor.name || `${supervisor.first_name || ''} ${supervisor.last_name || ''}`.trim()
}

function getInitials(name: string): string {
  if (!name) return 'SV'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function getCompanyName(supervisor: Supervisor): string {
  return supervisor.supervisor_profile?.company?.company_name || supervisor.company_name || '—'
}

function copyEmail(email: string) {
  navigator.clipboard.writeText(email)
  toast.success('Email copied to clipboard')
}

function openCreateModal() {
  editingSupervisorId.value = undefined
  creatingCompanyId.value = undefined
  showFormModal.value = true
}

function editSupervisor(supervisor: Supervisor) {
  editingSupervisorId.value = supervisor.id
  creatingCompanyId.value = undefined
  showFormModal.value = true
}

function viewSupervisor(supervisor: Supervisor) {
  selectedSupervisor.value = supervisor
  showDetailsModal.value = true
}

function closeDetailsModal() {
  showDetailsModal.value = false
  selectedSupervisor.value = null
}

function openEditFromDetails(supervisor: Supervisor) {
  closeDetailsModal()
  editSupervisor(supervisor)
}

function closeFormModal() {
  showFormModal.value = false
  editingSupervisorId.value = undefined
  creatingCompanyId.value = undefined
}

function onSupervisorSaved() {
  closeFormModal()
  fetchSupervisors()
  toast.success('Supervisor saved successfully.')
}

function resetFilters() {
  searchQuery.value = ''
  companyFilter.value = ''
  statusFilter.value = 'all'
  sortOrder.value = 'newest'
  currentPage.value = 1
  fetchSupervisors()
}

async function confirmAction(type: ActionType, supervisor: Supervisor) {
  pendingAction.value = { type, supervisor }
  const name = getSupervisorName(supervisor)

  if (type === 'delete') {
    confirmTitle.value = 'Delete Supervisor'
    confirmMessage.value = `Are you sure you want to permanently delete supervisor "${name}"? This action cannot be undone.`
    confirmButtonText.value = 'Delete'
  } else if (type === 'deactivate') {
    confirmTitle.value = 'Deactivate Supervisor'
    confirmMessage.value = `Are you sure you want to deactivate supervisor "${name}"?`
    confirmButtonText.value = 'Deactivate'
  } else if (type === 'activate') {
    confirmTitle.value = 'Activate Supervisor'
    confirmMessage.value = `Are you sure you want to re-activate supervisor "${name}"?`
    confirmButtonText.value = 'Activate'
  }

  const confirmed = await confirmOpen({ title: confirmTitle.value, message: confirmMessage.value })
  if (!confirmed) return
  await handleConfirmAction()
}

async function handleConfirmAction() {
  if (!pendingAction.value) return
  const { type, supervisor } = pendingAction.value
  const name = getSupervisorName(supervisor)

  await confirmAsyncFn(async () => {
    if (type === 'delete') {
      await api.delete(`/admin/users/${supervisor.id}`)
      toast.success(`Supervisor "${name}" deleted successfully.`)
    } else if (type === 'deactivate') {
      await api.put(`/admin/users/${supervisor.id}/deactivate`)
      toast.success(`Supervisor "${name}" deactivated.`)
    } else if (type === 'activate') {
      await api.put(`/admin/users/${supervisor.id}/activate`)
      toast.success(`Supervisor "${name}" activated.`)
    }
    pendingAction.value = null
    fetchSupervisors()
  })
}

function deleteSupervisor(supervisor: Supervisor) {
  confirmAction('delete', supervisor)
}

function toggleStatus(supervisor: Supervisor) {
  if (supervisor.deleted_at) {
    confirmAction('activate', supervisor)
  } else {
    confirmAction('deactivate', supervisor)
  }
}

function goToPage(page: number) {
  if (page < 1 || (pagination.value && page > pagination.value.last_page)) return
  currentPage.value = page
  fetchSupervisors()
}

function refresh() {
  fetchSupervisors()
}

async function fetchSupervisors() {
  loading.value = true
  error.value = ''
  try {
    const params: Record<string, string | number> = {
      role: 'supervisor',
      per_page: 15,
      page: currentPage.value,
    }

    if (searchQuery.value) params.search = searchQuery.value
    if (companyFilter.value) params.company_id = companyFilter.value
    if (statusFilter.value !== 'all') params.status = statusFilter.value
    if (sortOrder.value) params.sort = sortOrder.value

    const res = await api.get('/admin/users', { params })
    supervisors.value = res.data.data ?? []
    pagination.value = res.data.meta ?? null
    totalSupervisors.value = res.data.counts?.supervisor ?? res.data.meta?.total ?? 0

    // Compute stats
    activeCount.value = supervisors.value.filter((s) => !s.deleted_at).length
    deactivatedCount.value = supervisors.value.filter((s) => !!s.deleted_at).length
  } catch (err: unknown) {
    error.value =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Failed to load supervisors.'
  } finally {
    loading.value = false
  }
}

let timeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    currentPage.value = 1
    fetchSupervisors()
  }, 300)
})

watch([companyFilter, statusFilter, sortOrder], () => {
  currentPage.value = 1
  fetchSupervisors()
})

const openKebabId = ref<number | null>(null)

function toggleKebab(id: number) {
  openKebabId.value = openKebabId.value === id ? null : id
}

function handleClickOutside() {
  openKebabId.value = null
}

onMounted(async () => {
  window.addEventListener('click', handleClickOutside)
  try {
    const res = await api.get('/admin/companies', { params: { per_page: 200 } })
    companies.value = res.data.data ?? res.data ?? []
  } catch {
    companies.value = []
  }
  fetchSupervisors()
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
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
