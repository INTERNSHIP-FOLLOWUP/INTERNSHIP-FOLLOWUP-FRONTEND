<template>
  <div class="animate-fade-in">
    <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 class="text-xl font-semibold text-gray-900">Companies</h1>
          <p class="mt-1 text-sm text-gray-500">Manage company profiles and overview.</p>
        </div>

        <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          <div class="w-full sm:w-[320px]">
            <input
              v-model="query"
              type="search"
              placeholder="Search by name, email, or location"
              class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-gray-300"
            />
          </div>

          <button
            type="button"
            class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="store.loading"
            @click="refresh"
          >
            {{ store.loading ? 'Loading…' : 'Refresh' }}
          </button>

          <button
            type="button"
            class="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="store.loading"
            @click="goCreate"
          >
            New Company
          </button>
        </div>
      </div>

      <div v-if="store.loading" class="py-12">
        <div class="flex items-center justify-center">
          <div class="text-sm text-gray-600">Loading companies…</div>
        </div>
      </div>

      <div v-else-if="store.error" class="rounded-xl border border-error/20 bg-error/5 px-4 py-3">
        <p class="text-sm text-error">{{ store.error }}</p>
      </div>

      <div v-else-if="filteredCompanies.length === 0" class="py-12">
        <div class="text-center">
          <p class="text-sm font-medium text-gray-900">No companies found.</p>
          <p class="mt-1 text-sm text-gray-500">Try adjusting your search.</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CompanyCard
          v-for="c in filteredCompanies"
          :key="c.id"
          :company="c"
          @edit="goEdit(c.id)"
          @delete="onDelete(c.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CompanyCard from '@/components/company/CompanyCard.vue'
import { useCompanyStore } from '@/stores/company'

const store = useCompanyStore()
const router = useRouter()
const query = ref('')

onMounted(async () => {
  await store.fetchCompanies()
})

async function refresh() {
  await store.fetchCompanies()
}

function goCreate() {
  router.push({ name: 'CompaniesCreate' }).catch(() => {})
}

function goEdit(id: number) {
  router.push({ name: 'CompaniesEdit', params: { id } }).catch(() => {})
}



async function onDelete(id: number) {
  if (!confirm('Delete this company?')) return
  await store.deleteCompany(id)
  await store.fetchCompanies()
}

const filteredCompanies = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return store.companies

  return store.companies.filter((c) => {
    const name = c.name?.toLowerCase() ?? ''
    const email = c.email?.toLowerCase() ?? ''
    const location = c.location?.toLowerCase() ?? ''
    return name.includes(q) || email.includes(q) || location.includes(q)
  })
})
</script>


