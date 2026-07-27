<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
      @click.self="$emit('close')"
    >
      <transition name="scale" appear>
        <div class="relative w-full max-w-xl rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl my-8">
          <!-- Close button -->
          <button
            @click="$emit('close')"
            class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Loading state -->
          <div v-if="loading" class="flex flex-col items-center justify-center py-12">
            <svg class="h-10 w-10 animate-spin text-amber-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p class="mt-3 text-sm font-medium text-slate-500">Loading supervisor details...</p>
          </div>

          <div v-else-if="supervisor" class="space-y-6">
            <!-- Header profile badge -->
            <div class="flex items-center gap-4 border-b border-slate-100 pb-5">
              <div class="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-xl font-extrabold text-amber-700 shadow-inner">
                <img
                  v-if="supervisor.avatar_url"
                  :src="supervisor.avatar_url"
                  :alt="supervisorName"
                  class="h-full w-full rounded-2xl object-cover"
                />
                <span v-else>{{ initials }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <h3 class="text-xl font-bold tracking-tight text-slate-900 truncate">
                    {{ supervisorName }}
                  </h3>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
                    :class="supervisor.deleted_at ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'"
                  >
                    <span class="h-1.5 w-1.5 rounded-full" :class="supervisor.deleted_at ? 'bg-rose-500' : 'bg-emerald-500'" />
                    {{ supervisor.deleted_at ? 'Deactivated' : 'Active' }}
                  </span>
                </div>
                <p class="text-sm font-medium text-slate-500 truncate">{{ supervisor.email }}</p>
              </div>
            </div>

            <!-- Detail Grid -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Phone Number</span>
                <p class="mt-1 text-sm font-semibold text-slate-800">
                  <a v-if="supervisor.phone" :href="`tel:${supervisor.phone}`" class="text-amber-600 hover:underline flex items-center gap-1.5">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {{ supervisor.phone }}
                  </a>
                  <span v-else class="text-slate-400 font-normal">Not provided</span>
                </p>
              </div>

              <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Registered Date</span>
                <p class="mt-1 text-sm font-semibold text-slate-800">
                  {{ formatDate(supervisor.created_at) }}
                </p>
              </div>
            </div>

            <!-- Linked Company Card -->
            <div class="rounded-xl border border-amber-200/60 bg-amber-50/30 p-4">
              <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                <svg class="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m3 0h1m-1-4h.01M9 16h.01M9 12h.01M9 8h.01M15 16h.01M15 12h.01M15 8h.01" />
                </svg>
                Assigned Company
              </div>

              <div v-if="company" class="mt-3 space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-amber-200/60">
                      <img
                        v-if="companyLogo"
                        :src="companyLogo"
                        :alt="company.company_name"
                        class="h-full w-full object-cover"
                      />
                      <svg v-else class="h-4 w-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m3 0h1m-1-4h.01M9 16h.01M9 12h.01M9 8h.01M15 16h.01M15 12h.01M15 8h.01" />
                      </svg>
                    </div>
                    <h4 class="text-base font-bold text-slate-900 truncate">{{ company.company_name }}</h4>
                  </div>
                  <span v-if="company.industry" class="shrink-0 rounded-lg bg-amber-100/80 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                    {{ company.industry }}
                  </span>
                </div>
                <p v-if="company.address" class="text-xs text-slate-600 flex items-start gap-1.5">
                  <svg class="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ company.address }}
                </p>
                <div v-if="company.website" class="pt-1">
                  <a :href="company.website" target="_blank" class="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visit Website
                  </a>
                </div>
              </div>
              <div v-else class="mt-2 text-sm text-slate-500 italic">
                No company assigned to this supervisor.
              </div>
            </div>

            <!-- Footer actions -->
            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                @click="$emit('edit', supervisor)"
                class="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-700 active:scale-95"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Supervisor
              </button>
              <button
                @click="$emit('close')"
                class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Company {
  id: number
  company_name: string
  address?: string
  industry?: string
  website?: string
  email?: string
  company_image_url?: string | null
  company_profile_image_url?: string | null
}

interface Supervisor {
  id: number
  first_name: string
  last_name: string
  name: string
  email: string
  phone: string | null
  avatar_url?: string | null
  created_at?: string
  deleted_at: string | null
  supervisor_profile?: {
    company?: Company
  }
}

const props = defineProps<{
  show: boolean
  supervisor: Supervisor | null
  loading?: boolean
}>()

defineEmits<{
  close: []
  edit: [supervisor: Supervisor]
}>()

const supervisorName = computed(() => {
  if (!props.supervisor) return ''
  return props.supervisor.name || `${props.supervisor.first_name || ''} ${props.supervisor.last_name || ''}`.trim()
})

const initials = computed(() => {
  const name = supervisorName.value
  if (!name) return 'SV'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
})

const company = computed(() => {
  return props.supervisor?.supervisor_profile?.company
})

const companyLogo = computed(() => {
  return company.value?.company_image_url || company.value?.company_profile_image_url || null
})

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.scale-enter-active, .scale-leave-active { transition: all 0.2s ease; }
.scale-enter-from, .scale-leave-to { opacity: 0; transform: scale(0.96); }
</style>
