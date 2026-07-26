<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Reports</h1>
        <p class="text-sm text-slate-500">Generate and export internship performance reports</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="exportPdf" :disabled="loading || !hasData"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Export PDF
        </button>
        <button @click="exportExcel" :disabled="loading || !hasData"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Excel
        </button>
        <button @click="refreshReport" :disabled="loading"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg class="h-4 w-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <div class="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div>
          <label class="mb-1 block text-xs font-semibold text-slate-500">Batch</label>
          <select v-model="filters.batch_id" @keydown.enter="fetchReport"
            class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100">
            <option value="">All Batches</option>
            <option v-for="b in batches" :key="b.id" :value="b.id">{{ b.batch_name }} ({{ b.year }})</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-slate-500">Company</label>
          <select v-model="filters.company_id" @keydown.enter="fetchReport"
            class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100">
            <option value="">All Companies</option>
            <option v-for="c in companies" :key="c.id" :value="c.id">{{ c.companyName }}</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-slate-500">Tutor</label>
          <select v-model="filters.tutor_id" @keydown.enter="fetchReport"
            class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100">
            <option value="">All Tutors</option>
            <option v-for="t in tutors" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-slate-500">Status</label>
          <select v-model="filters.status" @keydown.enter="fetchReport"
            class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100">
            <option value="">All Statuses</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-slate-500">From</label>
          <input v-model="filters.date_from" type="date" :max="filters.date_to || undefined" @keydown.enter="fetchReport"
            class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100" />
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-slate-500">To</label>
          <input v-model="filters.date_to" type="date" :min="filters.date_from || undefined" @keydown.enter="fetchReport"
            class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100" />
        </div>
      </div>
      <div class="mt-4 flex items-center gap-3">
        <button @click="fetchReport" :disabled="loading"
          class="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-primary-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
          <svg v-if="loading" class="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <svg v-else class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {{ loading ? 'Generating...' : 'Generate Report' }}
        </button>
        <button @click="clearFilters" class="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 transition-all hover:bg-slate-50">Clear Filters</button>
        <button v-if="hasData" @click="saveReport" class="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 transition-all hover:bg-slate-50">Save Report</button>
      </div>
    </div>

    <div v-if="activeFilterCount > 0" class="flex flex-wrap items-center gap-2">
      <span class="text-xs font-semibold text-slate-400">Active filters:</span>
      <span v-for="badge in activeFilterBadges" :key="badge.key"
        class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
        {{ badge.label }}
        <button @click="removeFilter(badge.key)" class="ml-0.5 text-slate-400 hover:text-slate-600">
          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </span>
      <span class="text-xs text-slate-400">({{ activeFilterCount }} filter{{ activeFilterCount > 1 ? 's' : '' }})</span>
    </div>

    <div v-if="hasData" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      <div v-for="(value, label) in r.summary" :key="label" class="rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ formatLabel(label) }}</p>
        <p class="mt-1 text-xl font-bold text-slate-900">{{ value }}</p>
      </div>
    </div>

    <div v-if="hasData" class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-900">Students per Batch</h3>
          <span class="text-xs text-slate-400">{{ r.students_per_batch.length }} batches</span>
        </div>
        <div class="space-y-2">
          <div v-for="item in r.students_per_batch" :key="item.batch" class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
            <span class="text-xs font-semibold text-slate-700">{{ item.batch }} ({{ item.year }})</span>
            <div class="flex items-center gap-3">
              <span class="text-[10px] text-slate-400">Active: {{ item.active_count }}</span>
              <span class="inline-flex items-center rounded-md bg-primary-50 px-2 py-0.5 text-xs font-bold text-primary-700">{{ item.student_count }}</span>
            </div>
          </div>
        </div>
        <p v-if="!r.students_per_batch.length" class="py-6 text-center text-xs text-slate-400">No batch data.</p>
      </div>
      <div class="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-900">Students per Company</h3>
          <span class="text-xs text-slate-400">{{ r.students_per_company.length }} companies</span>
        </div>
        <div class="space-y-2">
          <div v-for="item in r.students_per_company" :key="String(item.company)" class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
            <div>
              <span class="text-xs font-semibold text-slate-700">{{ item.company }}</span>
              <span v-if="item.industry" class="ml-2 text-[10px] text-slate-400">{{ item.industry }}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-[10px] text-slate-400">Active: {{ item.active_count }}</span>
              <span class="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-xs font-bold text-purple-700">{{ item.assigned_count }}</span>
            </div>
          </div>
        </div>
        <p v-if="!r.students_per_company.length" class="py-6 text-center text-xs text-slate-400">No company data.</p>
      </div>
    </div>

    <div v-if="hasData" class="rounded-lg border border-slate-200/80 bg-white shadow-sm">
      <div class="border-b border-slate-100 px-5 py-4">
        <h3 class="text-sm font-bold text-slate-900">Assignments ({{ r.assignments.length }})</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-left text-sm">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400">
              <th class="px-4 py-3">Student</th>
              <th class="px-4 py-3">Student ID</th>
              <th class="px-4 py-3">Batch</th>
              <th class="px-4 py-3">Company</th>
              <th class="px-4 py-3">Tutor</th>
              <th class="px-4 py-3">Position</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Start</th>
              <th class="px-4 py-3">End</th>
              <th class="px-4 py-3">Duration</th>
              <th class="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="a in paginatedAssignments" :key="String(a.id)" class="hover:bg-slate-50/30 transition-colors">
              <td class="break-words px-4 py-3 font-semibold text-slate-900 max-w-[180px]">{{ a.student }}</td>
              <td class="whitespace-nowrap px-4 py-3 font-medium text-slate-500">{{ formatStudentId(a.student_code, a.batch) }}</td>
              <td class="whitespace-nowrap px-4 py-3 text-slate-600">{{ a.batch }}</td>
              <td class="break-words px-4 py-3 text-slate-600 max-w-[200px]">{{ a.company }}</td>
              <td class="break-words px-4 py-3 text-slate-600 max-w-[160px]">{{ a.tutor }}</td>
              <td class="break-words px-4 py-3 text-slate-600 max-w-[200px]">{{ a.position }}</td>
              <td class="whitespace-nowrap px-4 py-3">
                <span class="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold" :class="statusClass(a.status)">{{ a.status }}</span>
              </td>
              <td class="whitespace-nowrap px-4 py-3 text-slate-500">{{ a.start_date }}</td>
              <td class="whitespace-nowrap px-4 py-3 text-slate-500">{{ a.end_date }}</td>
              <td class="whitespace-nowrap px-4 py-3 text-slate-500">{{ a.duration_days }} days</td>
              <td class="whitespace-nowrap px-4 py-3 text-right">
                <button @click="openDetailModal(a)" class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-primary-600 transition-all hover:bg-primary-50">
                  View Detail
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="r.assignments.length > pageSize" class="border-t border-slate-100 px-5 py-3">
        <div class="flex items-center justify-between">
          <span class="text-xs text-slate-500">
            Showing {{ ((currentPage - 1) * pageSize) + 1 }}-{{ Math.min(currentPage * pageSize, r.assignments.length) }} of {{ r.assignments.length }}
          </span>
          <div class="flex items-center gap-1">
            <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
              class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">&lsaquo;</button>
            <template v-for="p in visiblePages" :key="p">
              <span v-if="p === '...'" class="px-1 text-xs text-slate-400">...</span>
              <button v-else @click="currentPage = Number(p)"
                class="min-w-[28px] rounded-lg border px-2 py-1 text-xs font-bold transition-all"
                :class="p === currentPage
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'">{{ p }}</button>
            </template>
            <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages"
              class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">&rsaquo;</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasData" class="text-center text-xs text-slate-400">
      Report generated with {{ r.assignments.length }} assignment{{ r.assignments.length !== 1 ? 's' : '' }}.
      {{ activeFilterCount > 0 ? `Filtered by ${activeFilterCount} condition${activeFilterCount > 1 ? 's' : ''}.` : 'No filters applied — showing all data.' }}
      <span v-if="r.metadata" class="ml-2">Generated at {{ r.metadata.generated_at }}</span>
    </div>

    <Teleport to="body">
      <div v-if="detailModal.assignment" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="closeDetailModal">
        <div class="w-full max-w-lg rounded-xl bg-white shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h3 class="text-sm font-bold text-slate-900">Assignment Details</h3>
            <button @click="closeDetailModal" class="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="space-y-4 px-6 py-5">
            <div class="grid grid-cols-2 gap-4">
              <div><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student</p><p class="mt-0.5 text-sm font-semibold text-slate-900">{{ detailModal.assignment.student }}</p></div>
              <div><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student ID</p><p class="mt-0.5 text-sm font-medium text-slate-700">{{ formatStudentId(detailModal.assignment.student_code, detailModal.assignment.batch) }}</p></div>
              <div><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Batch</p><p class="mt-0.5 text-sm font-medium text-slate-700">{{ detailModal.assignment.batch }}</p></div>
              <div><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Company</p><p class="mt-0.5 text-sm font-medium text-slate-700">{{ detailModal.assignment.company }}</p></div>
              <div><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tutor</p><p class="mt-0.5 text-sm font-medium text-slate-700">{{ detailModal.assignment.tutor }}</p></div>
              <div><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Position</p><p class="mt-0.5 text-sm font-medium text-slate-700">{{ detailModal.assignment.position }}</p></div>
              <div><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</p><span class="mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold" :class="statusClass(detailModal.assignment.status)">{{ detailModal.assignment.status }}</span></div>
              <div><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</p><p class="mt-0.5 text-sm font-medium text-slate-700">{{ detailModal.assignment.duration_days }} days</p></div>
              <div><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Start Date</p><p class="mt-0.5 text-sm font-medium text-slate-700">{{ detailModal.assignment.start_date }}</p></div>
              <div><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">End Date</p><p class="mt-0.5 text-sm font-medium text-slate-700">{{ detailModal.assignment.end_date }}</p></div>
            </div>
          </div>
          <div class="flex justify-end border-t border-slate-100 px-6 py-4">
            <button @click="closeDetailModal" class="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-200">Close</button>
          </div>
        </div>
      </div>
    </Teleport>

    <div v-if="!loading && !hasData && !fetched" class="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-16 text-center">
      <svg class="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="mt-4 text-sm font-semibold text-slate-500">Ready to generate a report</p>
      <p class="mt-1 text-xs text-slate-400">Optionally set filters above, then click <strong>Generate Report</strong> to get started. After the first run, reports auto-refresh when filters change.</p>
      <button @click="fetchReport" :disabled="loading" class="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-primary-700 active:scale-95">
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Generate Report
      </button>
    </div>

    <div v-if="!loading && !hasData && fetched" class="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-16 text-center">
      <svg class="mx-auto h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="mt-3 text-sm font-semibold text-slate-500">No results found</p>
      <p class="mt-1 text-xs text-slate-400">Try adjusting your filters or clearing them to see more data.</p>
    </div>

    <div v-if="loading && !hasData" class="flex flex-col items-center justify-center py-16">
      <svg class="h-8 w-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p class="mt-3 text-sm font-semibold text-slate-500">Generating report...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import api from '@/services/api'
import { batchService, type Batch } from '@/services/batch'
import { companyService } from '@/services/company'
import { useToastStore } from '@/stores/toast'
import type { Company } from '@/types/company'
import { formatStudentId } from '@/utils/studentUtils'

interface ReportFilters {
  batch_id: string
  company_id: string
  tutor_id: string
  status: string
  date_from: string
  date_to: string
}

interface Tutor {
  id: number
  name: string
  email: string
}

interface StudentsPerBatchSummary {
  batch: string
  year: number
  active_count: number
  student_count: number
}

interface StudentsPerCompanySummary {
  company: string
  industry?: string
  active_count: number
  assigned_count: number
}

interface ReportData {
  summary: Record<string, number>
  students_per_batch: StudentsPerBatchSummary[]
  students_per_company: StudentsPerCompanySummary[]
  assignments: AssignmentDetail[]
  metadata?: Record<string, unknown>
}

interface AssignmentDetail {
  id: number
  student: string
  student_code: string
  batch: string
  company: string
  tutor: string
  position: string
  status: string
  start_date: string
  end_date: string
  duration_days: number
  [key: string]: unknown
}

const toast = useToastStore()

const loading = ref(false)
const fetched = ref(false)
const batches = ref<Batch[]>([])
const companies = ref<Company[]>([])
const tutors = ref<Tutor[]>([])
const report = ref<ReportData | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const detailModal = reactive<{ assignment: AssignmentDetail | null }>({ assignment: null })

const filters = reactive<ReportFilters>({
  batch_id: '', company_id: '', tutor_id: '', status: '', date_from: '', date_to: '',
})

const hasData = computed(() => !!report.value)
const r = computed(() => report.value!)

const activeFilterCount = computed(() =>
  [filters.batch_id, filters.company_id, filters.tutor_id, filters.status, filters.date_from, filters.date_to]
    .filter(Boolean).length
)

const activeFilterBadges = computed(() => {
  const badges: Array<{ key: string; label: string }> = []
  if (filters.batch_id) {
    const b = batches.value.find(x => x.id === Number(filters.batch_id))
    badges.push({ key: 'batch_id', label: `Batch: ${b ? `${b.batch_name} (${b.year})` : filters.batch_id}` })
  }
  if (filters.company_id) {
    const c = companies.value.find(x => x.id === Number(filters.company_id))
    badges.push({ key: 'company_id', label: `Company: ${c ? c.companyName : filters.company_id}` })
  }
  if (filters.tutor_id) {
    const t = tutors.value.find(x => String(x.id) === filters.tutor_id)
    badges.push({ key: 'tutor_id', label: `Tutor: ${t ? t.name : filters.tutor_id}` })
  }
  if (filters.status) badges.push({ key: 'status', label: `Status: ${filters.status}` })
  if (filters.date_from) badges.push({ key: 'date_from', label: `From: ${filters.date_from}` })
  if (filters.date_to) badges.push({ key: 'date_to', label: `To: ${filters.date_to}` })
  return badges
})

const paginatedAssignments = computed(() => {
  if (!report.value?.assignments) return []
  const start = (currentPage.value - 1) * pageSize.value
  return report.value.assignments.slice(start, start + pageSize.value)
})

const totalPages = computed(() =>
  report.value?.assignments ? Math.ceil(report.value.assignments.length / pageSize.value) : 0
)

const visiblePages = computed(() => {
  const total = totalPages.value
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

function buildParams(): Record<string, string> {
  const params: Record<string, string> = {}
  if (filters.batch_id) params.batch_id = filters.batch_id
  if (filters.company_id) params.company_id = filters.company_id
  if (filters.tutor_id) params.tutor_id = filters.tutor_id
  if (filters.status) params.status = filters.status
  if (filters.date_from) params.date_from = filters.date_from
  if (filters.date_to) params.date_to = filters.date_to
  return params
}

async function fetchReport() {
  loading.value = true
  fetched.value = true
  try {
    const res = await api.get('/admin/reports', { params: buildParams() })
    report.value = res.data
    currentPage.value = 1
    toast.success('Report generated successfully')
  } catch {
    toast.error('Failed to generate report')
  } finally {
    loading.value = false
  }
}

async function refreshReport() {
  if (loading.value) return
  await fetchReport()
}

function removeFilter(key: string) {
  (filters as Record<string, string>)[key] = ''
  if (hasData.value) fetchReport()
}

async function exportPdf() {
  try {
    const res = await api.get('/admin/reports/export/pdf', { params: buildParams(), responseType: 'blob' })
    downloadBlob(res.data as Blob, `internship-performance-report-${new Date().toISOString().split('T')[0]}.pdf`)
    toast.success('PDF exported successfully')
  } catch {
    toast.error('Failed to export PDF')
  }
}

async function exportExcel() {
  try {
    const res = await api.get('/admin/reports/export/excel', { params: buildParams(), responseType: 'blob' })
    downloadBlob(res.data as Blob, `internship-performance-report-${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Excel exported successfully')
  } catch {
    toast.error('Failed to export Excel')
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

function clearFilters() {
  if (!activeFilterCount.value) return
  filters.batch_id = ''
  filters.company_id = ''
  filters.tutor_id = ''
  filters.status = ''
  filters.date_from = ''
  filters.date_to = ''
  report.value = null
  fetched.value = false
  currentPage.value = 1
  toast.info('Filters cleared')
}

function saveReport() {
  try {
    localStorage.setItem('saved_report', JSON.stringify(report.value))
    localStorage.setItem('saved_report_filters', JSON.stringify(filters))
    toast.success('Report saved successfully')
  } catch {
    toast.error('Failed to save report')
  }
}

function loadSavedReport() {
  try {
    const savedReport = localStorage.getItem('saved_report')
    const savedFilters = localStorage.getItem('saved_report_filters')
    if (savedReport && savedFilters) {
      report.value = JSON.parse(savedReport)
      Object.assign(filters, JSON.parse(savedFilters))
      fetched.value = true
    }
  } catch {
    // ignore corrupted data
  }
}

function openDetailModal(assignment: Record<string, unknown>) {
  detailModal.assignment = assignment as AssignmentDetail
}

function closeDetailModal() {
  detailModal.assignment = null
}

function formatLabel(label: string) {
  return label.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function statusClass(status: string) {
  switch (status) {
    case 'Assigned': return 'bg-blue-50 text-blue-700'
    case 'In Progress': return 'bg-amber-50 text-amber-700'
    case 'Completed': return 'bg-emerald-50 text-emerald-700'
    case 'Terminated': return 'bg-rose-50 text-rose-700'
    default: return 'bg-slate-50 text-slate-700'
  }
}

async function loadFilterOptions() {
  try {
    const [batchRes, companyRes] = await Promise.all([
      batchService.list(),
      companyService.list(),
    ])
    batches.value = batchRes.data
    companies.value = companyRes.data
  } catch (e) {
    console.error('Failed to load filter options:', e)
  }
  try {
    const tutorRes = await api.get<{ data: Tutor[] }>('/admin/users', {
      params: { role: 'tutor', per_page: 100 },
    })
    tutors.value = tutorRes.data.data ?? []
  } catch (e) {
    console.error('Failed to load tutors:', e)
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(() => [filters.batch_id, filters.company_id, filters.tutor_id, filters.status], () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (fetched.value) {
      currentPage.value = 1
      fetchReport()
    }
  }, 500)
})

onMounted(() => {
  loadFilterOptions()
  if (fetched.value) {
    fetchReport()
  }
})
</script>
