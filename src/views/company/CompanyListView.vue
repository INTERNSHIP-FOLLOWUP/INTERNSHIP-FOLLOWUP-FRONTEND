<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Companies</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Manage partner companies and their details.</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Search companies..." class="h-10 w-56 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" @input="onSearch" />
        </div>
        <router-link to="/admin/companies/create" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Add Company
        </router-link>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div v-if="store.loading" class="flex items-center justify-center py-16">
        <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <div v-else-if="store.error" class="flex flex-col items-center justify-center py-16 text-center">
        <svg class="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p class="mt-3 text-sm font-semibold text-red-500">{{ store.error }}</p>
      </div>
      <div v-else>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400">
                <th class="px-5 py-3.5">Name</th>
                <th class="px-5 py-3.5">Industry</th>
                <th class="px-5 py-3.5">Contact</th>
                <th class="px-5 py-3.5">Email</th>
                <th class="px-5 py-3.5">Phone</th>
                <th class="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="company in store.companies" :key="company.id" class="hover:bg-slate-50/30 transition-colors">
                <td class="whitespace-nowrap px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">{{ getInitials(company.name) }}</div>
                    <span class="font-semibold text-slate-900">{{ company.name }}</span>
                  </div>
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-500">{{ company.industry || '—' }}</td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-500">{{ company.contactPerson || '—' }}</td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-500">{{ company.email || '—' }}</td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-500">{{ company.phone || '—' }}</td>
                <td class="whitespace-nowrap px-5 py-4 text-right">
                  <button class="rounded-lg px-2.5 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all">Edit</button>
                  <button @click="deleteCompany(company.id)" class="ml-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-all">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="store.companies.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <svg class="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p class="mt-3 text-sm font-semibold text-slate-400">{{ searchQuery ? 'No companies match your search.' : 'No companies registered yet.' }}</p>
        </div>
        <div v-if="store.pagination && store.pagination.last_page > 1" class="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <p class="text-xs text-slate-500">Page {{ store.pagination.current_page }} of {{ store.pagination.last_page }}</p>
          <div class="flex gap-2">
            <button :disabled="!store.pagination.current_page || store.pagination.current_page <= 1" @click="changePage(store.pagination.current_page - 1)" class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40">Previous</button>
            <button :disabled="store.pagination.current_page >= store.pagination.last_page" @click="changePage(store.pagination.current_page + 1)" class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCompanyStore } from '@/stores/company'

const store = useCompanyStore()
const searchQuery = ref('')
let searchTimeout: ReturnType<typeof setTimeout>

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function onSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    store.fetchCompanies({ search: searchQuery.value || undefined })
  }, 300)
}

function changePage(page: number) {
  store.fetchCompanies({ page, search: searchQuery.value || undefined })
}

async function deleteCompany(id: number) {
  if (!confirm('Are you sure you want to delete this company?')) return
  try {
    await store.deleteCompany(id)
  } catch {
    // error handled by store
  }
}

onMounted(() => {
  store.fetchCompanies()
})
</script>
