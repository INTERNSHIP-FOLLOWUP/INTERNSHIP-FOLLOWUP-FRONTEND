<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Tutors</h1>
        <p class="mt-1 text-sm text-slate-500">{{ totalUsers }} registered tutor{{ totalUsers !== 1 ? 's' : '' }}</p>
      </div>
      <router-link to="/admin/users/create"
        class="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Tutor
      </router-link>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <div class="relative min-w-0 flex-1 basis-[200px]">
        <svg class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Search tutors..."
          class="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
      </div>
    </div>

    <div class="rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <div v-if="loading" class="space-y-0 divide-y divide-slate-50">
        <div v-for="n in 3" :key="n" class="flex items-center gap-4 px-6 py-4 animate-pulse">
          <div class="h-8 w-8 rounded-full bg-slate-200" />
          <div class="flex-1 space-y-2">
            <div class="h-3 w-1/3 rounded bg-slate-200" />
            <div class="h-3 w-1/4 rounded bg-slate-100" />
          </div>
          <div class="flex gap-2">
            <div class="h-8 w-20 rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>

      <div v-else-if="users.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th class="px-6 py-3.5 font-medium">First Name</th>
                <th class="px-6 py-3.5 font-medium">Last Name</th>
                <th class="px-6 py-3.5 font-medium">Email</th>
                <th class="px-6 py-3.5 font-medium">Students</th>
                <th class="px-6 py-3.5 font-medium">Status</th>
                <th class="px-6 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="user in users" :key="user.id" class="transition-colors hover:bg-slate-50/50">
                <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">{{ user.first_name }}</td>
                <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">{{ user.last_name }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-slate-500">{{ user.email }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-slate-500">{{ user.students_count ?? '—' }}</td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                    :class="user.deleted_at ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'">
                    <span class="h-1.5 w-1.5 rounded-full" :class="user.deleted_at ? 'bg-rose-500' : 'bg-emerald-500'" />
                    {{ user.deleted_at ? 'Deactivated' : 'Active' }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right">
                  <router-link :to="`/admin/tutor-profile/${user.id}`"
                    class="rounded-lg px-3 py-1.5 text-xs font-bold text-blue-600 transition-all hover:bg-blue-50">
                    View Profile
                  </router-link>
                  <router-link :to="`/admin/users/${user.id}/edit`"
                    class="rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-600 transition-all hover:bg-indigo-50">
                    Edit
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center px-6 py-16 text-center">
        <h3 class="text-base font-bold text-slate-900">No tutors found</h3>
        <p class="mt-1 text-sm text-slate-500">No registered tutors yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import api from '@/services/api'

interface Role { id: number; name: string }
interface User { id: number; first_name?: string; last_name?: string; name: string; email: string; role: Role | null; deleted_at: string | null; students_count?: number }

const users = ref<User[]>([])
const loading = ref(false)
const searchQuery = ref('')
const totalUsers = ref(0)

async function fetchUsers() {
  loading.value = true
  try {
    const params: Record<string, string | number> = { role: 'tutor', per_page: 50 }
    if (searchQuery.value) params.search = searchQuery.value
    const res = await api.get('/admin/users', { params })
    users.value = res.data.data ?? []
    totalUsers.value = res.data.meta?.total ?? 0
  } catch { /* ignore */ }
  finally { loading.value = false }
}

let timeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(fetchUsers, 300)
})

onMounted(fetchUsers)
</script>
