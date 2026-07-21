<template>
  <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <div class="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Company Feedback</h1>
        <p class="mt-1 text-sm text-gray-500">
          View feedback submitted by companies about their internship experience.
        </p>
      </div>
    </div>

    <div v-if="meta" class="mb-6 text-xs text-gray-400">
      {{ meta.total }} feedback{{ meta.total !== 1 ? 's' : '' }}
    </div>

    <template v-if="loading">
      <div class="space-y-4">
        <div v-for="n in 3" :key="n" class="animate-pulse rounded-xl border border-gray-100 bg-gray-50/50 p-5">
          <div class="flex items-start gap-3">
            <div class="h-10 w-10 shrink-0 rounded-lg bg-gray-200" />
            <div class="flex-1 space-y-2">
              <div class="h-4 w-48 rounded bg-gray-200" />
              <div class="h-3 w-32 rounded bg-gray-200" />
              <div class="mt-3 h-12 w-full rounded bg-gray-200" />
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
      <p class="text-sm font-medium text-gray-500">No feedback from companies yet.</p>
      <p class="mt-1 text-xs text-gray-400">Feedback will appear here once companies submit them.</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="item in feedback"
        :key="item.id"
        class="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
      >
        <div class="mb-3 flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div
              v-if="item.company?.company_image_url"
              class="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <img
                :src="item.company.company_image_url"
                :alt="item.company.company_name"
                class="h-full w-full object-cover"
              />
            </div>
            <div
              v-else
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
              :class="avatarBg(item.company?.company_name)"
            >
              {{ companyInitials(item.company?.company_name) }}
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-900">{{ item.title }}</h3>
              <p class="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <svg class="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {{ item.company?.company_name || 'Company #' + item.company_id }}
              </p>
            </div>
          </div>
          <span class="shrink-0 whitespace-nowrap text-xs text-gray-400">{{ formatDate(item.created_at) }}</span>
        </div>
        <div class="relative rounded-lg border border-gray-100 bg-gray-50/70 px-4 py-3">
          <svg class="absolute left-3 top-3 h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clip-rule="evenodd" />
          </svg>
          <p class="pl-7 text-sm leading-relaxed text-gray-700">{{ item.message }}</p>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

interface FeedbackItem {
  id: number
  company_id: number
  title: string
  message: string
  created_at?: string
  company?: {
    id: number
    company_name: string
    company_image_url?: string | null
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
  'bg-primary-500', 'bg-emerald-500', 'bg-violet-500',
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
    const res = await api.get('/admin/feedback', { params: { page } })
    const data = res.data
    feedback.value = data?.data ?? []
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

onMounted(() => load())
</script>
