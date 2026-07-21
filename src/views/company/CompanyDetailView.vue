<template>
  <div class="space-y-6">
    <!-- Back Button & Breadcrumb -->
    <div class="flex items-center gap-3 text-sm">
      <button
        @click="goBack"
        class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Companies
      </button>
      <span class="text-slate-300">/</span>
      <span class="font-medium text-slate-900">{{
        company?.companyName || 'Company Details'
      }}</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-20 text-center">
      <svg class="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <p class="mt-4 text-base font-semibold text-red-500">{{ error }}</p>
      <button
        @click="fetchData"
        class="mt-4 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
      >
        Try Again
      </button>
    </div>

    <!-- Company Detail Card -->
    <div
      v-else-if="company"
      class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
    >
      <!-- Hero Header with Avatar -->
      <div class="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-sky-400 px-8 py-10">
        <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div class="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

        <div class="relative flex flex-col items-center gap-5 sm:flex-row sm:items-end">
          <div
            class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white/50 bg-white shadow-xl"
          >
            <img
              v-if="companyLogoUrl"
              :src="companyLogoUrl"
              :alt="company.companyName"
              class="h-full w-full object-cover"
            />
            <span v-else class="text-3xl font-bold text-indigo-600">
              {{ company.companyName.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="text-center sm:text-left">
            <h1 class="text-2xl font-bold text-white drop-shadow-sm">{{ company.companyName }}</h1>
            <div class="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span
                v-if="company.industry"
                class="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
              >
                {{ company.industry }}
              </span>
              <span
                v-if="company.email"
                class="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
              >
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {{ company.email }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Body -->
      <div class="px-8 py-8">
        <!-- Section: Contact Information -->
        <div class="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          <div class="space-y-5">
            <h3
              class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400"
            >
              <span class="h-1 w-1 rounded-full bg-indigo-500"></span>
              Contact Details
            </h3>

            <div v-if="company.contactPerson" class="flex items-start gap-3">
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"
              >
                <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-xs font-medium text-slate-400">Contact Person</p>
                <p class="text-sm font-semibold text-slate-900">{{ company.contactPerson }}</p>
              </div>
            </div>

            <div v-if="company.address" class="flex items-start gap-3">
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
              >
                <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-xs font-medium text-slate-400">Address</p>
                <p class="text-sm font-semibold text-slate-900">{{ company.address }}</p>
              </div>
            </div>
          </div>

          <div class="space-y-5">
            <h3
              class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400"
            >
              <span class="h-1 w-1 rounded-full bg-sky-400"></span>
              Communication
            </h3>

            <div v-if="company.email" class="flex items-start gap-3">
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600"
              >
                <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-xs font-medium text-slate-400">Email</p>
                <a
                  :href="`mailto:${company.email}`"
                  class="text-sm font-semibold text-sky-600 transition-colors hover:text-sky-800"
                  >{{ company.email }}</a
                >
              </div>
            </div>

            <div v-if="company.phone" class="flex items-start gap-3">
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
              >
                <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-xs font-medium text-slate-400">Phone</p>
                <p class="text-sm font-semibold text-slate-900">{{ company.phone }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="my-8 border-t border-slate-100" />

        <!-- Section: Digital Presence -->
        <div class="space-y-5">
          <h3
            class="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400"
          >
            <span class="h-1 w-1 rounded-full bg-violet-400"></span>
            Digital Presence
          </h3>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div
              v-if="company.website"
              class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50"
            >
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-medium text-slate-400">Website</p>
                <a
                  :href="normalizeUrl(company.website)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block truncate text-sm font-semibold text-violet-600 transition-colors hover:text-violet-800"
                >
                  {{ company.website }}
                </a>
              </div>
            </div>

            <div
              v-if="company.telegramLink"
              class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50"
            >
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
                  />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-medium text-slate-400">Telegram</p>
                <a
                  :href="normalizeUrl(company.telegramLink)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block truncate text-sm font-semibold text-sky-600 transition-colors hover:text-sky-800"
                >
                  {{ company.telegramLink }}
                </a>
              </div>
            </div>
          </div>

          <div
            v-if="!company.website && !company.telegramLink"
            class="rounded-xl border border-dashed border-slate-200 py-6 text-center text-sm text-slate-400"
          >
            No digital presence links provided.
          </div>
        </div>

        <!-- Divider -->
        <div class="my-8 border-t border-slate-100" />

        <!-- Section: Metadata -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div v-if="company.createdAt" class="rounded-xl bg-slate-50/60 p-4">
            <p class="text-xs font-medium text-slate-400">Created</p>
            <p class="mt-1 text-sm font-semibold text-slate-700">
              {{ formatDate(company.createdAt) }}
            </p>
          </div>
          <div v-if="company.updatedAt" class="rounded-xl bg-slate-50/60 p-4">
            <p class="text-xs font-medium text-slate-400">Last Updated</p>
            <p class="mt-1 text-sm font-semibold text-slate-700">
              {{ formatDate(company.updatedAt) }}
            </p>
          </div>
          <div class="rounded-xl bg-slate-50/60 p-4">
            <p class="text-xs font-medium text-slate-400">Company ID</p>
            <p class="mt-1 text-sm font-semibold text-slate-700">#{{ company.id }}</p>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div
        class="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-8 py-5 sm:flex-row"
      >
        <div class="flex items-center gap-2">
          <span class="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
          <span class="text-xs font-medium text-slate-400">Active company record</span>
        </div>
        <div class="flex items-center gap-2">
          <router-link
            :to="`/admin/companies/${company.id}/edit`"
            class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </router-link>
          <button
            @click="deleteCompany"
            :disabled="deleting"
            class="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      :show="dialog.show.value"
      :title="dialog.title.value"
      :message="dialog.message.value"
      :confirm-text="dialog.confirmText.value"
      :cancel-text="dialog.cancelText.value"
      :loading="dialog.loading.value"
      :error="dialog.error.value"
      @cancel="dialog.cancel()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { companyService } from '@/services/company'
import { useCompanyStore } from '@/stores/company'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { useToastStore } from '@/stores/toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import type { Company } from '@/types/company'

const route = useRoute()
const router = useRouter()
const store = useCompanyStore()
const dialog = useConfirmDialog()
const toast = useToastStore()

const company = ref<Company | null>(null)
const loading = ref(false)
const error = ref('')
const deleting = ref(false)

const companyLogoUrl = computed(() => {
  if (!company.value) return null
  return company.value.companyImageUrl || company.value.companyProfileImageUrl || company.value.companyProfileImage || null
})

function getCompanyId(): number {
  const idRaw = route.params.id
  return typeof idRaw === 'string' ? Number(idRaw) : Array.isArray(idRaw) ? Number(idRaw[0]) : NaN
}

function normalizeUrl(url: string | null): string | undefined {
  if (!url) return undefined
  const trimmed = url.trim()
  if (!trimmed) return undefined
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  return `https://${trimmed}`
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

async function fetchData() {
  const id = getCompanyId()
  if (!Number.isFinite(id)) {
    error.value = 'Invalid company ID.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const data = await companyService.get(id)
    company.value = data
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to load company details.'
  } finally {
    loading.value = false
  }
}

async function deleteCompany() {
  const id = getCompanyId()
  if (!Number.isFinite(id)) return

  const confirmed = await dialog.open({
    title: 'Delete Company',
    message: `Are you sure you want to delete "${company.value?.companyName}"? This action cannot be undone.`,
  })
  if (!confirmed) return

  deleting.value = true
  try {
    await store.deleteCompany(id)
    toast.success('Company deleted successfully.')
    goBack()
  } catch {
    toast.error('Failed to delete company.')
  } finally {
    deleting.value = false
  }
}

function goBack() {
  router.push({ name: 'AdminCompanies' }).catch(() => {})
}

onMounted(() => {
  fetchData()
})
</script>
