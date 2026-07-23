<template>
  <div class="space-y-6">
    <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold text-gray-900">Student Evaluations</h1>
          <p class="mt-1 text-sm text-gray-500">
            View and filter evaluations submitted by companies.
          </p>
        </div>
      </div>

      <div class="mb-6 flex flex-wrap items-center gap-3">
        <div class="relative">
          <select
            v-model="selectedCompanyId"
            class="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            @change="onCompanyChange"
          >
            <option value="">All Companies</option>
            <option v-for="c in companies" :key="c.id" :value="c.id">
              {{ c.company_name }}
            </option>
          </select>
          <svg class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <button
          v-if="selectedCompanyId"
          class="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
          @click="clearFilter"
        >
          Clear filter
        </button>
        <span v-if="meta" class="text-xs text-gray-400">
          {{ meta.total }} evaluation{{ meta.total !== 1 ? 's' : '' }}
        </span>
      </div>

      <template v-if="loading">
        <div class="space-y-4">
          <div v-for="n in 3" :key="n" class="animate-pulse rounded-xl border border-gray-100 bg-gray-50/50 p-5">
            <div class="mb-3 flex items-center gap-3">
              <div class="h-10 w-10 rounded-lg bg-gray-200" />
              <div class="flex-1 space-y-2">
                <div class="h-4 w-40 rounded bg-gray-200" />
                <div class="h-3 w-24 rounded bg-gray-200" />
              </div>
            </div>
            <div class="mb-3 grid grid-cols-4 gap-3">
              <div v-for="i in 4" :key="i" class="h-14 rounded-lg bg-gray-200" />
            </div>
            <div class="flex items-center justify-between">
              <div class="h-4 w-32 rounded bg-gray-200" />
              <div class="h-4 w-48 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </template>

      <div
        v-else-if="error"
        class="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3"
      >
        <p class="text-sm text-rose-600">{{ error }}</p>
      </div>

      <div v-else-if="!evaluations.length" class="flex flex-col items-center justify-center py-16">
        <svg class="mb-4 h-16 w-16 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm font-medium text-gray-500">
          No evaluations{{ selectedCompanyId ? ' for this company' : '' }} yet.
        </p>
        <p class="mt-1 text-xs text-gray-400">
          {{ selectedCompanyId ? 'Try selecting a different company.' : 'Evaluations will appear here once companies submit them.' }}
        </p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="item in evaluations"
          :key="item.id"
          class="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
        >
          <div class="mb-4 flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                :class="avatarBg(item.student?.name)"
              >
                {{ studentInitials(item.student?.name) }}
              </div>
              <div>
                <h3 class="text-sm font-semibold text-gray-900">{{ item.student?.name || 'Student #' + item.student_id }}</h3>
                <div class="mt-0.5 flex items-center gap-1.5">
                  <div
                    v-if="item.company?.company_image_url || item.company?.company_profile_image_url"
                    class="h-5 w-5 shrink-0 overflow-hidden rounded border border-gray-200 bg-white"
                  >
                    <img
                      :src="item.company.company_image_url || item.company.company_profile_image_url"
                      :alt="item.company.company_name"
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div
                    v-else
                    class="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-100 text-[8px] font-bold text-gray-500"
                  >
                    {{ companyInitials(item.company?.company_name) }}
                  </div>
                  <span class="text-xs font-medium text-gray-500">
                    {{ item.company?.company_name || 'Company #' + item.company_id }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex shrink-0 flex-col items-end gap-1">
              <div
                class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
                :class="overallBadge(item.overall_score)"
              >
                <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {{ item.overall_score }}/100
              </div>
              <span class="text-[11px] text-gray-400">{{ formatDate(item.created_at) }}</span>
            </div>
          </div>

          <div class="mb-4 grid grid-cols-4 gap-3">
            <div v-for="s in skills" :key="s.key" class="rounded-lg bg-gray-50 px-3 py-2.5">
              <div class="mb-1.5 flex items-center justify-between">
                <span class="text-[11px] font-medium text-gray-500">{{ s.label }}</span>
                <span class="text-xs font-bold" :class="skillScoreColor(item[s.key])">{{ item[s.key] }}</span>
              </div>
              <div class="h-1.5 overflow-hidden rounded-full bg-gray-200">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="skillBarColor(item[s.key])"
                  :style="{ width: item[s.key] + '%' }"
                />
              </div>
            </div>
          </div>

          <div v-if="item.feedback" class="relative rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3">
            <svg class="absolute left-3 top-3 h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clip-rule="evenodd" />
            </svg>
            <p class="pl-7 text-sm italic text-gray-600">"{{ item.feedback }}"</p>
          </div>
        </div>

        <div v-if="meta && meta.last_page > 1" class="flex items-center justify-between border-t border-gray-100 pt-4">
          <p class="text-xs text-gray-500">
            Page {{ meta.current_page }} of {{ meta.last_page }}
            ({{ meta.total }} total)
          </p>
          <div class="flex items-center gap-1.5">
            <button
              :disabled="meta.current_page <= 1"
              class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              @click="load(meta.current_page - 1)"
            >
              Previous
            </button>
            <button
              v-for="p in visiblePages"
              :key="p"
              class="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors"
              :class="p === meta.current_page ? 'bg-primary-600 text-white shadow-sm' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'"
              @click="load(p)"
            >
              {{ p }}
            </button>
            <button
              :disabled="meta.current_page >= meta.last_page"
              class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              @click="load(meta.current_page + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

interface EvaluationItem {
  id: number
  student_id: number
  company_id: number
  technical_skill: number
  communication: number
  professionalism: number
  attendance: number
  overall_score: number
  feedback?: string | null
  created_at?: string
  student?: {
    id: number
    name: string
    email?: string
  }
  company?: {
    id: number
    company_name: string
    company_image_url?: string | null
    company_profile_image_url?: string | null
  }
}

interface CompanyOption {
  id: number
  company_name: string
}

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  prev_page_url: string | null
  next_page_url: string | null
}

const skills = [
  { key: 'technical_skill' as const, label: 'Technical' },
  { key: 'communication' as const, label: 'Communication' },
  { key: 'professionalism' as const, label: 'Professionalism' },
  { key: 'attendance' as const, label: 'Attendance' },
]

const evaluations = ref<EvaluationItem[]>([])
const companies = ref<CompanyOption[]>([])
const selectedCompanyId = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const meta = ref<PaginationMeta | null>(null)

const visiblePages = computed(() => {
  if (!meta.value) return []
  const { current_page, last_page } = meta.value
  const pages: number[] = []
  const start = Math.max(1, current_page - 2)
  const end = Math.min(last_page, current_page + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

async function loadCompanies() {
  try {
    const res = await api.get('/admin/companies', { params: { per_page: 100 } })
    const data = res.data
    if (Array.isArray(data?.data)) {
      companies.value = data.data.map((c: any) => ({
        id: c.id,
        company_name: c.company_name || c.name || '',
      }))
    }
  } catch {
    // silently fail — company filter is optional
  }
}

function onCompanyChange() {
  load(1)
}

function clearFilter() {
  selectedCompanyId.value = ''
  load(1)
}

async function load(page = 1) {
  loading.value = true
  error.value = null
  try {
    const params: Record<string, any> = { page }
    if (selectedCompanyId.value) {
      params.company_id = selectedCompanyId.value
    }
    const res = await api.get('/admin/evaluations', { params })
    const data = res.data
    evaluations.value = Array.isArray(data?.data) ? data.data : []
    meta.value = data
      ? {
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total,
          prev_page_url: data.prev_page_url,
          next_page_url: data.next_page_url,
        }
      : null
  } catch {
    error.value = 'Failed to load evaluations'
  } finally {
    loading.value = false
  }
}

const avatarColors = [
  'bg-primary-500', 'bg-emerald-500', 'bg-violet-500',
  'bg-amber-500', 'bg-rose-500', 'bg-cyan-500',
  'bg-orange-500', 'bg-indigo-500', 'bg-teal-500',
]

function avatarBg(name?: string) {
  if (!name) return avatarColors[0]
  const idx = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % avatarColors.length
  return avatarColors[idx]
}

function studentInitials(name?: string) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function companyInitials(name?: string) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function overallBadge(score: number) {
  if (score >= 80) return 'bg-emerald-50 text-emerald-700'
  if (score >= 60) return 'bg-amber-50 text-amber-700'
  return 'bg-rose-50 text-rose-700'
}

function skillScoreColor(score: number) {
  if (score >= 80) return 'text-emerald-600'
  if (score >= 60) return 'text-amber-600'
  return 'text-rose-600'
}

function skillBarColor(score: number) {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-amber-500'
  return 'bg-rose-500'
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr.slice(0, 10)
  }
}

onMounted(() => {
  loadCompanies()
  load()
})
</script>
