<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Supervisors</h1>
        <p class="mt-1 text-sm text-slate-500">{{ totalSupervisors }} registered supervisor{{ totalSupervisors !== 1 ? 's' : '' }}</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="selectMode ? clearSelection() : enterSelectMode()"
          class="flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-all"
          :class="selectMode
            ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50'">
          <svg v-if="selectMode" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {{ selectMode ? 'Cancel' : 'Select All' }}
        </button>
        <button @click="openCreateModal"
          class="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700">
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
      <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total Supervisors</p>
            <p class="mt-1 text-2xl font-black text-slate-900 dark:text-slate-100">{{ totalSupervisors }}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Active Supervisors -->
      <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Active</p>
            <p class="mt-1 text-2xl font-black text-emerald-600">{{ activeCount }}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Inactive Supervisors -->
      <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Inactive</p>
            <p class="mt-1 text-2xl font-black text-amber-600">{{ inactiveCount }}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Deactivated Supervisors -->
      <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Deactivated</p>
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
      <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Partner Companies</p>
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
    <div class="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <!-- Search Input -->
      <div class="relative min-w-[220px] flex-1">
        <svg class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Search supervisors..."
          class="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
      </div>

      <!-- Company Filter -->
      <div class="w-full sm:w-auto">
        <select
          v-model="companyFilter"
          class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
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
          class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
          <option value="deactivated">Deactivated Only</option>
        </select>
      </div>

      <!-- Sort Filter -->
      <div class="w-full sm:w-auto">
        <select
          v-model="sortOrder"
          class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
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
      class="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm font-medium text-rose-700 shadow-sm"
    >
      <svg class="h-5 w-5 shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="flex-1">{{ error }}</span>
      <button @click="error = ''" class="rounded-lg p-1 transition-colors hover:bg-rose-100">&times;</button>
    </div>

    <div class="rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <div v-if="loading" class="space-y-0 divide-y divide-slate-50">
        <div v-for="n in 3" :key="n" class="flex items-center gap-4 px-6 py-4 animate-pulse">
          <div class="h-8 w-8 rounded-full bg-slate-200" />
          <div class="flex-1 space-y-2">
            <div class="h-3 w-1/3 rounded bg-slate-200" />
            <div class="h-3 w-1/4 rounded bg-slate-100" />
          </div>
          <div class="flex gap-2">
            <div class="h-8 w-20 rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>

      <div v-else-if="supervisors.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th v-if="selectMode" class="px-4 py-3.5 w-10">
                  <input type="checkbox" :checked="isAllSelected" :indeterminate="isIndeterminate"
                    @change="toggleSelectAll"
                    class="h-4 w-4 rounded border-slate-300 cursor-pointer accent-rose-600" />
                </th>
                <th class="px-6 py-3.5 font-medium">Photo</th>
                <th class="px-6 py-3.5 font-medium">Supervisor</th>
                <th class="px-6 py-3.5 font-medium">Email</th>
                <th class="px-6 py-3.5 font-medium">Phone</th>
                <th class="px-6 py-3.5 font-medium">Assigned Company</th>
                <th class="px-6 py-3.5 font-medium">Status</th>
                <th class="px-6 py-3.5 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr
                v-for="(supervisor, index) in supervisors"
                :key="supervisor.id"
                @click="viewSupervisor(supervisor)"
                class="cursor-pointer transition-colors hover:bg-slate-50/50"
                :class="{ 'bg-rose-50/40': selectedIds.has(supervisor.id) }"
              >
                <td v-if="selectMode" class="px-4 py-4 w-10" @click.stop>
                  <input type="checkbox" :checked="selectedIds.has(supervisor.id)"
                    @change="toggleSelect(supervisor.id)"
                    class="h-4 w-4 rounded border-slate-300 cursor-pointer accent-rose-600" />
                </td>

                <!-- Photo -->
                <td class="whitespace-nowrap px-6 py-4">
                  <div class="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-600 ring-2 ring-white shadow-xs">
                    <img
                      v-if="supervisor.avatar_url"
                      :src="supervisor.avatar_url"
                      :alt="getSupervisorName(supervisor)"
                      class="h-full w-full rounded-full object-cover"
                    />
                    <span v-else>{{ getInitials(getSupervisorName(supervisor)) }}</span>
                  </div>
                </td>

                <!-- Supervisor Name -->
                <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                  {{ getSupervisorName(supervisor) }}
                </td>

                <!-- Email -->
                <td class="whitespace-nowrap px-6 py-4 text-slate-500 max-w-[200px]">
                  <div class="flex items-center gap-1.5 group">
                    <span class="truncate" :title="supervisor.email">{{ supervisor.email }}</span>
                    <button
                      @click.stop="copyEmail(supervisor.email)"
                      title="Copy email address"
                      class="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-indigo-600 p-0.5"
                    >
                      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </td>

                <!-- Phone -->
                <td class="whitespace-nowrap px-6 py-4 text-slate-500">
                  <a
                    v-if="supervisor.phone"
                    :href="`tel:${supervisor.phone}`"
                    @click.stop
                    class="hover:text-indigo-600 hover:underline"
                  >
                    {{ supervisor.phone }}
                  </a>
                  <span v-else class="text-slate-300">—</span>
                </td>

                <!-- Company -->
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    v-if="getCompanyName(supervisor) !== '—'"
                    class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 py-1 pl-1 pr-3 text-xs font-semibold text-amber-800 border border-amber-200/50"
                  >
                    <img
                      v-if="getCompanyLogo(supervisor)"
                      :src="getCompanyLogo(supervisor)"
                      :alt="getCompanyName(supervisor)"
                      class="h-5 w-5 shrink-0 rounded-full object-cover ring-1 ring-white"
                    />
                    <svg v-else class="h-3.5 w-3.5 shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m3 0h1m-1-4h.01M9 16h.01M9 12h.01M9 8h.01M15 16h.01M15 12h.01M15 8h.01" />
                    </svg>
                    {{ getCompanyName(supervisor) }}
                  </span>
                  <span v-else class="text-slate-300">—</span>
                </td>

                <!-- Status -->
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold"
                    :class="getSupervisorStatusBadgeClass(supervisor)"
                  >
                    <span class="relative flex h-2 w-2">
                      <span
                        v-if="!supervisor.deleted_at && supervisor.status !== 'inactive' && supervisor.status !== 'deactivated'"
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                      />
                      <span
                        class="relative inline-flex rounded-full h-2 w-2"
                        :class="getSupervisorStatusDotClass(supervisor)"
                      />
                    </span>
                    {{ getSupervisorStatusText(supervisor) }}
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

                    <!-- Kebab Dropdown Menu (Smart positioning: Top rows pop DOWN, Bottom rows pop UP) -->
                    <transition name="fade">
                      <div
                        v-if="openKebabId === supervisor.id"
                        class="absolute right-0 z-30 w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none text-left"
                        :class="index < (supervisors.length > 2 ? supervisors.length - 2 : 1) && supervisors.length > 1 ? 'top-full mt-1 origin-top-right' : 'bottom-full mb-1 origin-bottom-right'"
                      >
                        <button
                          type="button"
                          @click.stop="openKebabId = null; viewSupervisor(supervisor)"
                          class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
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
                          class="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
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

      <div v-else class="flex flex-col items-center justify-center px-6 py-16 text-center">
        <h3 class="text-base font-bold text-slate-900">No supervisors found</h3>
        <p class="mt-1 text-sm text-slate-500">No company supervisors have been added yet.</p>
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
            supervisor{{ selectedIds.size !== 1 ? 's' : '' }} selected
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
              <h3 class="text-base font-semibold text-slate-900">Delete {{ selectedIds.size }} Supervisor{{ selectedIds.size !== 1 ? 's' : '' }}</h3>
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
import { useDeactivatedUsersStore } from '@/stores/deactivatedUsers'
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
  company_image_url?: string | null
  company_profile_image_url?: string | null
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
  status?: string
  must_change_password?: boolean
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
const deactivatedUsersStore = useDeactivatedUsersStore()

const supervisors = ref<Supervisor[]>([])
const companies = ref<Company[]>([])
const loading = ref(true)
const error = ref('')

const searchQuery = ref('')
const companyFilter = ref('')
const statusFilter = ref('all')
const sortOrder = ref('newest')

const currentPage = ref(1)
const pagination = ref<PaginationMeta | null>(null)
const totalSupervisors = ref(0)
const activeCount = ref(0)
const inactiveCount = ref(0)
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

// ── Bulk select state ──
const selectMode = ref(false)
const selectedIds = ref<Set<number>>(new Set())
const showBulkConfirm = ref(false)
const bulkDeleting = ref(false)
const bulkError = ref('')

const hasActiveFilters = computed(() =>
  !!searchQuery.value || !!companyFilter.value || statusFilter.value !== 'all' || sortOrder.value !== 'newest'
)

function resetFilters() {
  searchQuery.value = ''
  companyFilter.value = ''
  statusFilter.value = 'all'
  sortOrder.value = 'newest'
  currentPage.value = 1
  fetchSupervisors()
}

function enterSelectMode() {
  selectMode.value = true
}

const isAllSelected = computed(() =>
  supervisors.value.length > 0 && supervisors.value.every((s) => selectedIds.value.has(s.id))
)
const isIndeterminate = computed(() =>
  supervisors.value.some((s) => selectedIds.value.has(s.id)) && !isAllSelected.value
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
    supervisors.value.forEach((s) => next.delete(s.id))
    selectedIds.value = next
  } else {
    const next = new Set(selectedIds.value)
    supervisors.value.forEach((s) => next.add(s.id))
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
    await api.post('/admin/users/bulk-delete', { ids })
    toast.success(`Deleted ${ids.length} supervisor${ids.length !== 1 ? 's' : ''} successfully.`)
    showBulkConfirm.value = false
    clearSelection()
    fetchSupervisors()
  } catch (err: unknown) {
    bulkError.value = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Bulk delete failed.'
  } finally {
    bulkDeleting.value = false
  }
}

function getSupervisorName(supervisor: Supervisor): string {
  return supervisor.name || `${supervisor.first_name || ''} ${supervisor.last_name || ''}`.trim()
}

function getInitials(name: string): string {
  if (!name) return 'SV'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function getSupervisorStatusText(supervisor: Supervisor): string {
  if (supervisor.deleted_at || supervisor.status === 'deactivated') return 'Deactivated'
  if (supervisor.status === 'inactive') return 'Inactive'
  return 'Active'
}

function getSupervisorStatusBadgeClass(supervisor: Supervisor): string {
  if (supervisor.deleted_at || supervisor.status === 'deactivated') return 'bg-rose-50 text-rose-700 border border-rose-200/60'
  if (supervisor.status === 'inactive') return 'bg-amber-50 text-amber-700 border border-amber-200/60'
  return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
}

function getSupervisorStatusDotClass(supervisor: Supervisor): string {
  if (supervisor.deleted_at || supervisor.status === 'deactivated') return 'bg-rose-500'
  if (supervisor.status === 'inactive') return 'bg-amber-500'
  return 'bg-emerald-500'
}

function getCompanyName(supervisor: Supervisor): string {
  return supervisor.supervisor_profile?.company?.company_name || supervisor.company_name || '—'
}

function getCompanyLogo(supervisor: Supervisor): string | undefined {
  const company = supervisor.supervisor_profile?.company
  return company?.company_image_url || company?.company_profile_image_url || undefined
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
  fetchSupervisorStats()
  toast.success('Supervisor saved successfully.')
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

  await confirmOpen({ title: confirmTitle.value, message: confirmMessage.value, confirmText: confirmButtonText.value })
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
      if (statusFilter.value === 'deactivated') {
        await deactivatedUsersStore.deactivateUser(supervisor.id)
      } else {
        await api.put(`/admin/users/${supervisor.id}/deactivate`)
      }
      toast.success(`Supervisor "${name}" deactivated.`)
    } else if (type === 'activate') {
      if (statusFilter.value === 'deactivated') {
        await deactivatedUsersStore.reactivateUser(supervisor.id)
      } else {
        await api.put(`/admin/users/${supervisor.id}/activate`)
      }
      toast.success(`Supervisor "${name}" activated.`)
    }
    pendingAction.value = null
    fetchSupervisors()
    fetchSupervisorStats()
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

/**
 * Fetch supervisor counts from the backend to compute accurate stat card totals.
 * Fetches total, inactive, and deactivated counts separately to avoid relying
 * on unsupported query params.
 */
async function fetchSupervisorStats(): Promise<void> {
  try {
    const res = await api.get('/admin/users', {
      params: { role: 'supervisor', per_page: 1 },
    })
    totalSupervisors.value = res.data.counts?.supervisor ?? res.data.meta?.total ?? 0

    // Fetch deactivated count
    try {
      const deactivatedRes = await api.get('/admin/users', {
        params: { role: 'supervisor', per_page: 1, status: 'deactivated' },
      })
      deactivatedCount.value = deactivatedRes.data.meta?.total ?? 0
    } catch {
      deactivatedCount.value = 0
    }

    // Fetch inactive count
    try {
      const inactiveRes = await api.get('/admin/users', {
        params: { role: 'supervisor', per_page: 1, status: 'inactive' },
      })
      inactiveCount.value = inactiveRes.data.meta?.total ?? 0
    } catch {
      inactiveCount.value = 0
    }

    // Active = total - (deactivated + inactive)
    activeCount.value = totalSupervisors.value - deactivatedCount.value - inactiveCount.value
    if (activeCount.value < 0) activeCount.value = 0
  } catch {
    // Stats fetch failed silently — table data still works
  }
}

async function fetchCompanies() {
  try {
    const res = await api.get('/admin/companies', {
      params: { per_page: 1000 },
    })
    companies.value = res.data.data ?? []
  } catch {
    companies.value = []
  }
}

async function fetchSupervisors() {
  loading.value = true
  error.value = ''
  try {
    if (statusFilter.value === 'deactivated') {
      await deactivatedUsersStore.fetchDeactivated({
        page: currentPage.value,
        per_page: 15,
        search: searchQuery.value || undefined,
        role: 'supervisor',
      })
      supervisors.value = deactivatedUsersStore.users as unknown as Supervisor[]
      pagination.value = deactivatedUsersStore.pagination as unknown as PaginationMeta | null
      error.value = deactivatedUsersStore.error || ''
    } else {
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
    }
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

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
  fetchCompanies()
  fetchSupervisors()
  fetchSupervisorStats()
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

.slide-up-enter-active { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.slide-up-leave-active { transition: all 0.2s ease-in; }
.slide-up-enter-from  { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95); }
.slide-up-leave-to    { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95); }
</style>
