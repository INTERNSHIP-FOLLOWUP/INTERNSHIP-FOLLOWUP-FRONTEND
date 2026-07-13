<template>
  <div class="p-4 md:p-6">
    <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Issues</h1>
        <p class="mt-1 text-sm text-gray-600">Track and manage issue updates.</p>
      </div>

      <div class="flex items-center gap-2">
        <router-link v-if="canCreate"
          class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          to="/issues/create">
          + New Issue
        </router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div class="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div class="md:col-span-4">
          <label for="search" class="mb-1 block text-xs font-medium text-gray-700">Search</label>
          <input id="search" v-model.trim="filters.search" type="text"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Search by title" @keyup.enter="applyFilters" />
        </div>

        <div class="md:col-span-3">
          <label for="status" class="mb-1 block text-xs font-medium text-gray-700">Status</label>
          <select id="status" v-model="filters.status"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            @change="applyFilters">
            <option value="">All</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div class="md:col-span-3">
          <label for="priority" class="mb-1 block text-xs font-medium text-gray-700">Priority</label>
          <select id="priority" v-model="filters.priority"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            @change="applyFilters">
            <option value="">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div class="md:col-span-2 flex items-end justify-start md:justify-end">
          <button
            class="inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
            :disabled="loading" @click="applyFilters">
            Search
          </button>
        </div>
      </div>

      <div v-if="roleHint" class="mt-3 text-xs text-gray-500">
        {{ roleHint }}
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mt-5 flex items-center justify-center rounded-xl border border-gray-200 bg-white p-8">
      <p class="text-sm font-semibold text-gray-900">Loading issues…</p>
    </div>

    <!-- Empty -->
    <div v-else-if="!issues.length" class="mt-5 rounded-xl border border-dashed border-gray-300 bg-white p-8">
      <p class="text-sm font-semibold text-gray-900">No issues found</p>
      <p class="mt-1 text-xs text-gray-500">Try adjusting your filters.</p>
    </div>

    <!-- Desktop table -->
    <div v-else class="mt-5 hidden md:block">
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Title</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Student</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Priority</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Created Date</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in issues" :key="i.id" class="border-t border-gray-100">
              <td class="px-4 py-3 text-sm font-semibold text-gray-900">
                <router-link :to="`/issues/${i.id}`" class="hover:underline">{{ i.title }}</router-link>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ i.student?.name ?? '—' }}</td>
              <td class="px-4 py-3">
                <PriorityBadge :priority="i.priority" />
              </td>
              <td class="px-4 py-3">
                <IssueStatusBadge :status="i.status" />
              </td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(i.created_at ?? null) }}</td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <router-link
                    class="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-200"
                    :to="`/issues/${i.id}`">
                    View
                  </router-link>
                  <router-link v-if="canEdit"
                    class="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-100"
                    :to="`/issues/${i.id}/edit`">
                    Edit
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div>Showing {{ issues.length }} items</div>
        <div class="flex items-center gap-2">
          <button class="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-50" :disabled="page <= 1"
            @click="prevPage">
            Prev
          </button>
          <button class="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-50" @click="nextPage">
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile cards -->
    <!-- <div v-else class="mt-5 space-y-4 md:hidden">
      <IssueCard v-for="i in issues" :key="i.id" :issue="i" />

      <div class="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div>Showing {{ issues.length }} items</div>
        <div class="flex items-center gap-2">
          <button class="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-50" :disabled="page <= 1"
            @click="prevPage">
            Prev
          </button>
          <button class="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-50" @click="nextPage">
            Next
          </button>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useIssueStore } from '@/stores/issueStore'
import { useAuth } from '@/composables/useAuth'
import IssueStatusBadge from '@/components/issue/IssueStatusBadge.vue'
import PriorityBadge from '@/components/issue/PriorityBadge.vue'

const issueStore = useIssueStore()
const { role } = useAuth()

const issues = computed(() => issueStore.issues)
const loading = computed(() => issueStore.loading)

const filters = ref({
  search: '',
  status: '',
  priority: '',
})

const page = ref(1)
const perPage = 10

const canCreate = computed(() => true)

const canEdit = computed(() => {
  // Best-guess: allow edit for admin/tutor/company; student can edit (role-based scoping occurs in API)
  if (role.value === 'admin' || role.value === 'tutor' || role.value === 'company representative') return true
  if (role.value === 'student') return true
  return false
})

const roleHint = computed(() => {
  const r = role.value
  if (!r) return ''
  if (r === 'admin') return 'You are viewing all issues.'
  if (r === 'company representative') return 'You are viewing issues related to your students.'
  if (r === 'student') return 'You are viewing your own issues.'
  if (r === 'tutor') return 'You are viewing issues for your assigned students.'
  return ''
})

function formatDate(value?: string | null) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString()
}

async function load() {
  await issueStore.fetchIssues({
    search: filters.value.search,
    status: filters.value.status,
    priority: filters.value.priority,
    page: page.value,
    per_page: perPage,
  })
}

function applyFilters() {
  page.value = 1
  void load()
}

function prevPage() {
  if (page.value <= 1) return
  page.value -= 1
  void load()
}

function nextPage() {
  page.value += 1
  void load()
}

onMounted(() => {
  void load()
})

watch(role, () => {
  page.value = 1
  void load()
})
</script>
