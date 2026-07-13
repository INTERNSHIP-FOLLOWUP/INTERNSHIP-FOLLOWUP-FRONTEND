<template>
  <div class="animate-fade-in">
    <div class="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500">Company panel overview</p>
      </div>
      <button
        type="button"
        class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
        :disabled="store.loading"
        @click="load"
      >
        {{ store.loading ? 'Loading…' : 'Refresh' }}
      </button>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2 rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-5">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label class="block space-y-1">
            <span class="text-sm font-medium text-gray-700">Company Name</span>
            <input
              type="text"
              :value="company.name"
              disabled
              class="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 shadow-sm"
            />
          </label>

          <label class="block space-y-1">
            <span class="text-sm font-medium text-gray-700">Company Email</span>
            <input
              type="email"
              :value="company.email"
              disabled
              class="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 shadow-sm"
            />
          </label>

          <label class="block space-y-1 sm:col-span-2">
            <span class="text-sm font-medium text-gray-700">Address</span>
            <input
              type="text"
              :value="company.location"
              disabled
              class="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 shadow-sm"
            />
          </label>
        </div>
      </div>

      <div class="space-y-4">
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-2">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Active Internships</p>
          <p class="text-3xl font-bold tracking-tight text-gray-900">{{ stats.activeInternships }}</p>
          <p class="text-xs text-gray-500">Currently running program slots</p>
        </div>

        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-2">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Assigned Students</p>
          <p class="text-3xl font-bold tracking-tight text-gray-900">{{ stats.assignedStudents }}</p>
          <p class="text-xs text-gray-500">Across all active batches</p>
        </div>

        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-2">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Pending Reviews</p>
          <p class="text-3xl font-bold tracking-tight text-gray-900">{{ stats.pendingReviews }}</p>
          <p class="text-xs text-gray-500">Awaiting evaluation action</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCompanyStore } from '@/stores/company'

const store = useCompanyStore()

const company = ref({
  name: '',
  email: '',
  location: '',
})

const stats = ref({
  activeInternships: 0,
  assignedStudents: 0,
  pendingReviews: 0,
})

async function load() {
  await store.fetchProfile()
  const raw = store.currentCompany
  if (raw) {
    company.value = {
      name: raw.name ?? '',
      email: raw.email ?? '',
      location: raw.location ?? '',
    }
  }

  try {
    const [students, evaluations] = await Promise.all([store.fetchStudents(), store.fetchEvaluations()])
    stats.value = {
      activeInternships: Array.isArray(students)
        ? students.filter((s) => (s as Record<string, unknown>).status === 'assigned').length
        : 0,
      assignedStudents: Array.isArray(students) ? students.length : 0,
      pendingReviews: Array.isArray(evaluations) ? evaluations.length : 0,
    }
  } catch {
    // keep dashboard visible as read-only if secondary APIs fail
  }
}

onMounted(load)
</script>
