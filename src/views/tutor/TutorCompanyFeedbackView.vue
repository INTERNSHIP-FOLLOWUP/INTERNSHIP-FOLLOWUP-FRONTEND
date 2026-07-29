<template>
  <div class="rounded-2xl border dark:border-slate-700 border-gray-100 dark:bg-slate-800 bg-white p-6 shadow-sm">
    <div class="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold dark:text-slate-100 text-gray-900">Company Feedback</h1>
        <p class="mt-1 text-sm dark:text-slate-400 text-gray-500">
          View student performance feedback submitted by companies.
        </p>
      </div>
    </div>

    <div v-if="meta" class="mb-6 text-xs dark:text-slate-500 text-gray-400">
      {{ meta.total }} feedback{{ meta.total !== 1 ? 's' : '' }}
    </div>

    <template v-if="loading">
      <div class="space-y-4">
        <div v-for="n in 3" :key="n" class="animate-pulse rounded-xl border dark:border-slate-700 border-gray-100 dark:bg-slate-700 bg-gray-50/50 p-5">
          <div class="flex items-start gap-3">
            <div class="h-10 w-10 shrink-0 rounded-lg dark:bg-slate-600 bg-gray-200" />
            <div class="flex-1 space-y-2">
              <div class="h-4 w-48 rounded dark:bg-slate-600 bg-gray-200" />
              <div class="h-3 w-32 rounded dark:bg-slate-600 bg-gray-200" />
              <div class="mt-3 h-12 w-full rounded dark:bg-slate-600 bg-gray-200" />
            </div>
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

    <div v-else-if="!feedback.length" class="flex flex-col items-center justify-center py-16">
      <svg class="mb-4 h-16 w-16 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
      <p class="text-sm font-medium dark:text-slate-400 text-gray-500">No feedback from companies yet.</p>
      <p class="mt-1 text-xs dark:text-slate-500 text-gray-400">Feedback will appear here once companies submit them.</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="item in feedback"
        :key="item.id"
        class="group rounded-xl border dark:border-slate-700 border-gray-100 dark:bg-slate-800 bg-white p-5 shadow-sm transition-all hover:dark:border-slate-600 border-gray-200 hover:shadow-md"
      >
        <!-- Header: Company + Date -->
        <div class="mb-3 flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div
              v-if="getCompanyLogo(item)"
              class="h-10 w-10 shrink-0 overflow-hidden rounded-lg border dark:border-slate-600 border-gray-200 dark:bg-slate-800 bg-white"
            >
              <img
                :src="getCompanyLogo(item)"
                :alt="getCompanyName(item)"
                class="h-full w-full object-cover"
                @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'"
              />
            </div>
            <div
              v-else
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
              :class="avatarBg(getCompanyName(item))"
            >
              {{ companyInitials(getCompanyName(item)) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-semibold dark:text-slate-100 text-gray-900 truncate">{{ getCompanyName(item) }}</h3>
                <span class="shrink-0 rounded dark:bg-slate-600 bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium dark:text-slate-400 text-gray-500">Feedback</span>
              </div>
              <!-- Student info with photo -->
              <div class="mt-1.5 flex items-center gap-2">
                <UserAvatar
                  :avatar="item.student?.photo_url || item.student?.photo"
                  :name="feedbackStudentName(item)"
                  size="sm"
                />
                <p class="truncate text-xs font-medium dark:text-slate-200 text-gray-700">
                  {{ feedbackStudentName(item) }}
                </p>
              </div>
            </div>
          </div>
          <span class="shrink-0 whitespace-nowrap text-xs dark:text-slate-500 text-gray-400">{{ formatDate(item.created_at) }}</span>
        </div>

        <!-- Strengths -->
        <div v-if="item.strengths?.length" class="mb-2.5">
          <p class="mb-1 text-xs font-semibold uppercase tracking-wider dark:text-slate-400 text-gray-500">Strengths</p>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="s in item.strengths"
              :key="s"
              class="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/10"
            >
              {{ s }}
            </span>
          </div>
        </div>

        <!-- Improvement Areas -->
        <div v-if="item.improvement_areas?.length" class="mb-2.5">
          <p class="mb-1 text-xs font-semibold uppercase tracking-wider dark:text-slate-400 text-gray-500">Areas for Improvement</p>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="a in item.improvement_areas"
              :key="a"
              class="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-600/10"
            >
              {{ a }}
            </span>
          </div>
        </div>

        <!-- Comment -->
        <div v-if="item.message" class="relative mt-2 rounded-lg border dark:border-slate-700 border-gray-100 dark:bg-slate-700 bg-gray-50/70 px-4 py-3">
          <svg class="absolute left-3 top-3 h-4 w-4 dark:text-slate-500 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clip-rule="evenodd" />
          </svg>
          <p class="pl-7 text-sm leading-relaxed dark:text-slate-200 text-gray-700">{{ item.message }}</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="meta && meta.last_page > 1" class="flex items-center justify-between border-t dark:border-slate-700 border-gray-100 pt-4">
        <p class="text-xs dark:text-slate-400 text-gray-500">
          Page {{ meta.current_page }} of {{ meta.last_page }}
          ({{ meta.total }} total)
        </p>
        <div class="flex items-center gap-1.5">
          <button
            :disabled="meta.current_page <= 1"
            class="rounded-lg border dark:border-slate-600 border-gray-200 px-3 py-1.5 text-xs font-semibold dark:text-slate-200 text-gray-700 transition-colors hover:dark:bg-slate-700 bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            @click="load(meta.current_page - 1)"
          >
            Previous
          </button>
          <button
            v-for="p in visiblePages"
            :key="p"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors"
            :class="p === meta.current_page ? 'bg-indigo-600 text-white shadow-sm' : 'border dark:border-slate-600 border-gray-200 dark:text-slate-200 text-gray-700 hover:dark:bg-slate-700 bg-gray-50'"
            @click="load(p)"
          >
            {{ p }}
          </button>
          <button
            :disabled="meta.current_page >= meta.last_page"
            class="rounded-lg border dark:border-slate-600 border-gray-200 px-3 py-1.5 text-xs font-semibold dark:text-slate-200 text-gray-700 transition-colors hover:dark:bg-slate-700 bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            @click="load(meta.current_page + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { useTutorStudentStore } from '@/stores/tutorStudent'
import { useCompanyStore } from '@/stores/company'
import UserAvatar from '@/components/common/UserAvatar.vue'
import { normalizeImageUrl } from '@/utils/normalizeImageUrl'

interface FeedbackItem {
  id: number
  company_supervisors_id?: number
  student_id?: number
  student_name?: string
  name?: string
  first_name?: string
  last_name?: string
  title?: string | null
  message: string
  strengths?: string[]
  improvement_areas?: string[]
  created_at?: string
  // Supervisor object with nested company (actual API shape)
  supervisor?: {
    id: number
    company_id?: number
    company?: {
      id: number
      company_name: string
      company_image_url?: string | null
      company_profile_image_url?: string | null
    }
  }
  // Flat company fields (fallback)
  company_name?: string
  company_image_url?: string | null
  company_profile_image_url?: string | null
  // Nested company object (fallback)
  company?: {
    id: number
    company_name: string
    company_image_url?: string | null
    company_profile_image_url?: string | null
  }
  student?: {
    id: number
    name: string
    first_name?: string
    last_name?: string
    email?: string
    photo_url?: string | null
    photo?: string | null
  }
}

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  prev_page_url: string | null
  next_page_url: string | null
}

const feedback = ref<FeedbackItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const meta = ref<PaginationMeta | null>(null)
const studentStore = useTutorStudentStore()
const companyStore = useCompanyStore()

const visiblePages = computed(() => {
  if (!meta.value) return []
  const { current_page, last_page } = meta.value
  const pages: number[] = []
  const start = Math.max(1, current_page - 2)
  const end = Math.min(last_page, current_page + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const avatarColors = [
  'bg-indigo-500', 'bg-emerald-500', 'bg-violet-500',
  'bg-amber-500', 'bg-rose-500', 'bg-cyan-500',
  'bg-orange-500', 'bg-indigo-500', 'bg-teal-500',
]

function avatarBg(name?: string) {
  if (!name) return avatarColors[0]
  const idx = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % avatarColors.length
  return avatarColors[idx]
}

async function load(page = 1) {
  loading.value = true
  error.value = null
  try {
    const res = await api.get('/tutor/feedback', { params: { page } })
    const data = res.data
    feedback.value = data?.data ?? []

    // Enrich feedback items with company data if missing
    await enrichCompanyData()

    meta.value = {
      current_page: data.current_page,
      last_page: data.last_page,
      per_page: data.per_page,
      total: data.total,
      prev_page_url: data.prev_page_url,
      next_page_url: data.next_page_url,
    }
  } catch {
    error.value = 'Failed to load feedback'
  } finally {
    loading.value = false
  }
}

/**
 * Try to enrich feedback items with company name/logo when the API
 * doesn't include nested company data. Uses the company store cache
 * if available, or fetches from the API (may fail for non-admin roles).
 */
async function enrichCompanyData(): Promise<void> {
  const items = feedback.value
  if (!items.length) return

  // Collect unique company IDs from items that lack company info
  const missingIds = new Set<number>()
  for (const item of items) {
    const hasCompany = item.supervisor?.company?.company_name || item.company?.company_name || item.company_name
    if (!hasCompany) {
      const companyId = item.supervisor?.company_id
      if (companyId) missingIds.add(companyId)
    }
  }
  if (!missingIds.size) return

  // Try to fetch companies if the store doesn't have them yet (admin endpoint)
  if (companyStore.companies.length === 0) {
    try {
      await companyStore.fetchCompanies({ per_page: 100 })
    } catch {
      // Tutors may not have admin access — try individual fetch below
    }
  }

  // Map company data from store onto feedback items
  for (const item of items) {
    if (item.supervisor?.company?.company_name || item.company?.company_name || item.company_name) continue
    const companyId = item.supervisor?.company_id
    if (!companyId) continue
    const company = companyStore.companies.find((c) => c.id === companyId)
    if (company) {
      item.company_name = company.name
      item.company_image_url = company.companyImageUrl || company.companyProfileImageUrl || null
      item.company_profile_image_url = company.companyProfileImageUrl || null
    }
  }

  // If some items still lack company data, try fetching individual companies
  const stillMissing = new Set<number>()
  for (const item of items) {
    if (item.supervisor?.company?.company_name || item.company?.company_name || item.company_name) continue
    const companyId = item.supervisor?.company_id
    if (companyId) stillMissing.add(companyId)
  }
  if (!stillMissing.size) return

  const fetched = new Map<number, { name: string; logo: string | null }>()
  for (const companyId of stillMissing) {
    try {
      const res = await api.get(`/companies/${companyId}`)
      const raw = res.data?.company ?? res.data?.data ?? res.data
      if (raw?.id) {
        fetched.set(companyId, {
          name: raw.company_name ?? raw.name ?? '',
          logo: raw.company_image_url ?? raw.company_profile_image_url ?? raw.logo ?? null,
        })
      }
    } catch {
      // try alternative endpoint
      try {
        const res = await api.get(`/admin/companies/${companyId}`)
        const raw = res.data?.company ?? res.data?.data ?? res.data
        if (raw?.id) {
          fetched.set(companyId, {
            name: raw.company_name ?? raw.name ?? '',
            logo: raw.company_image_url ?? raw.company_profile_image_url ?? raw.logo ?? null,
          })
        }
      } catch {
        // company info not available
      }
    }
  }

  for (const item of items) {
    if (item.supervisor?.company?.company_name || item.company?.company_name || item.company_name) continue
    const companyId = item.supervisor?.company_id
    if (!companyId) continue
    const info = fetched.get(companyId)
    if (info) {
      item.company_name = info.name
      item.company_image_url = info.logo
    }
  }
}

/** Extract company name from supervisor.company, nested `company` object, or flat fields */
function getCompanyName(item: FeedbackItem): string {
  return item.supervisor?.company?.company_name
    || item.company?.company_name
    || item.company_name
    || 'Company'
}

/** Extract and resolve company logo URL from supervisor.company, nested `company` object, or flat fields */
function getCompanyLogo(item: FeedbackItem): string | undefined {
  const raw = item.supervisor?.company?.company_image_url
    || item.supervisor?.company?.company_profile_image_url
    || item.company?.company_image_url
    || item.company?.company_profile_image_url
    || item.company_image_url
    || item.company_profile_image_url
  if (!raw) return undefined
  // Strip duplicate /storage/ prefix
  const cleaned = normalizeImageUrl(raw) ?? raw
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) return cleaned
  // Resolve relative path using API base URL
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/api\/?$/, '')
  const cleanPath = cleaned.startsWith('/') ? cleaned : `/storage/${cleaned}`
  return `${baseUrl}${cleanPath}`
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

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr.slice(0, 10)
  }
}

function studentDisplayName(item: unknown) {
  const raw = item as Record<string, unknown> | null
  if (!raw) return 'Student'

  const nestedStudent = raw.student as Record<string, unknown> | undefined
  const firstName = String(raw.first_name ?? nestedStudent?.first_name ?? '').trim()
  const lastName = String(raw.last_name ?? nestedStudent?.last_name ?? '').trim()
  const fullName = `${firstName} ${lastName}`.trim()

  return (
    String(nestedStudent?.name ?? '').trim() ||
    String(raw.student_name ?? '').trim() ||
    String(raw.name ?? '').trim() ||
    fullName ||
    'Student'
  )
}

function feedbackStudentName(item: FeedbackItem) {
  const directName = studentDisplayName(item)
  if (directName !== 'Student') return directName

  const studentId = Number(item.student_id ?? 0)
  const student = studentStore.students.find((s) => s.id === studentId)
  return student ? studentDisplayName(student) : 'Student'
}

onMounted(() => {
  load()
  studentStore.fetchStudents({ per_page: 100 }).catch(() => {})
})
</script>
