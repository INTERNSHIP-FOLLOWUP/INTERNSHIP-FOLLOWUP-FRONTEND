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

    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-sm text-gray-600">Loading feedback...</div>
    </div>

    <div
      v-else-if="error"
      class="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3"
    >
      <p class="text-sm text-rose-600">{{ error }}</p>
    </div>

    <div v-else-if="!feedback.length" class="py-12 text-center text-sm text-gray-500">
      No feedback from companies yet.
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="item in feedback"
        :key="item.id"
        class="rounded-xl border border-gray-100 bg-gray-50/50 p-5"
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
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-xs font-bold text-primary-700"
            >
              {{ companyInitials(item.company?.company_name) }}
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-900">{{ item.title }}</h3>
              <p class="mt-0.5 text-xs font-medium text-primary-600">
                {{ item.company?.company_name || 'Company #' + item.company_id }}
              </p>
            </div>
          </div>
          <span class="shrink-0 text-xs text-gray-400">{{ formatDate(item.created_at) }}</span>
        </div>
        <p class="text-sm text-gray-700">{{ item.message }}</p>
      </div>

      <div v-if="meta" class="flex items-center justify-between pt-4">
        <p class="text-xs text-gray-500">
          Page {{ meta.current_page }} of {{ meta.last_page }}
          ({{ meta.total }} total)
        </p>
        <div class="flex gap-2">
          <button
            :disabled="!meta.prev_page_url"
            class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40"
            @click="load(meta.current_page - 1)"
          >
            Previous
          </button>
          <button
            :disabled="!meta.next_page_url"
            class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40"
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
import { ref, onMounted } from 'vue'
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
  } catch (e: any) {
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
