<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">My Students</h1>
        <p class="text-sm text-slate-500">
          Students assigned to you, with quick status and follow-up signals.
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div class="flex flex-wrap items-center gap-3 p-4">
        <div class="relative min-w-0 flex-1 basis-[240px]">
          <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            v-model="search"
            type="text"
            placeholder="Search by name, email, or code..."
            class="h-10 w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-10 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            v-if="!!search"
            type="button"
            @click="clearSearchOnly"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-600"
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="min-w-0 basis-[180px]">
          <select
            v-model="status"
            @change="applyApiIfNeeded"
            class="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 transition-all focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Statuses</option>
            <option>Assigned</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Terminated</option>
          </select>
        </div>

        <label class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 cursor-pointer select-none whitespace-nowrap transition-all hover:border-indigo-200">
          <input
            type="checkbox"
            v-model="hasOpenIssue"
            @change="applyApiIfNeeded"
            class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Has open issue
        </label>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div v-if="store.loading" class="divide-y divide-slate-50">
        <div v-for="n in 8" :key="n" class="flex items-center gap-4 px-6 py-4 animate-pulse">
          <div class="h-8 w-8 rounded-full bg-slate-200" />
          <div class="flex-1 space-y-2">
            <div class="h-3 w-1/3 rounded bg-slate-200" />
            <div class="h-3 w-1/4 rounded bg-slate-100" />
          </div>
          <div class="h-3 w-20 rounded bg-slate-200" />
          <div class="h-3 w-16 rounded bg-slate-200" />
          <div class="h-5 w-24 rounded-full bg-slate-200" />
        </div>
      </div>

      <div
        v-else-if="store.error"
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <div class="rounded-full bg-red-50 p-3 text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <p class="mt-3 text-sm font-semibold text-red-600">Unable to load students.</p>
        <button
          type="button"
          @click="load(1)"
          class="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
        >
          Retry
        </button>
      </div>

      <div v-else-if="livePendingMessage()" class="px-6 py-10 text-center">
        <p class="text-sm font-semibold text-slate-700">Type at least {{ MIN_SEARCH_LENGTH }} characters to search.</p>
        <p class="mt-1 text-xs text-slate-400">Results will update as you type.</p>
      </div>

      <div
        v-else-if="!store.loading && displayed.length === 0"
        class="flex flex-col items-center justify-center px-6 py-16 text-center"
      >
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7 text-slate-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19.128a9.38 9.38 0 002.162.938c.464.1.928.158 1.398.158 2.354 0 4.29 1.722 4.49 3.957A4.972 4.972 0 0018.5 17.5c0 .674-.085 1.325-.244 1.95"
            />
          </svg>
        </div>
        <h3 class="mt-4 text-sm font-semibold text-slate-700">No students found</h3>
        <p class="text-xs text-slate-400">Try adjusting your search or filters.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr
              class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              <th class="px-6 py-3.5">Student</th>
              <th class="px-6 py-3.5">Company</th>
              <th class="px-6 py-3.5">Status</th>
              <th class="px-6 py-3.5">Last Worklog</th>
              <th class="px-6 py-3.5">Feedback</th>
              <th class="px-6 py-3.5">Issues</th>
              <th class="px-6 py-3.5">Next Follow-up</th>
              <th class="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr
              v-for="student in displayed"
              :key="student.id"
              class="transition-colors hover:bg-slate-50/50"
            >
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700"
                  >
                    {{ initials(student.name) }}
                  </div>
                  <div>
                    <p class="font-semibold text-slate-900">{{ student.name }}</p>
                    <p class="text-xs text-slate-500">{{ student.email }}</p>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {{ student.company_name || '—' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                  :class="statusColor(student.assignment_status)"
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full"
                    :class="statusDot(student.assignment_status)"
                  />
                  {{ formatStatus(student.assignment_status) }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {{ student.last_worklog_at || '—' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {{ student.feedback_given ? 'Yes' : 'No' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  v-if="(student.open_issues_count || 0) > 0"
                  class="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700"
                  >{{ student.open_issues_count }}</span
                >
                <span v-else class="text-xs text-slate-400">0</span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-xs text-slate-600">
                {{ nextFollowup(student) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right">
                <button
                  type="button"
                  @click="goToDetail(student.id)"
                  class="rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-700 transition-all hover:bg-indigo-50"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTutorStudentStore } from '@/stores/tutorStudent'

const router = useRouter()
const store = useTutorStudentStore()
const search = ref('')
const status = ref('')
const hasOpenIssue = ref(false)

const MIN_SEARCH_LENGTH = 2
let lastAppliedQuery = ''

const matches = (student: any): boolean => {
  const q = search.value.trim().toLowerCase()
  if (!q) return true
  const hay = `${student.name} ${student.email} ${student.student_code || ''}`.toLowerCase()
  if (!hay.includes(q)) return false
  const st = (status.value || '').trim()
  if (st && student.assignment_status !== st) return false
  const issuesCount = Number(student.open_issues_count ?? 0)
  if (hasOpenIssue.value && issuesCount <= 0) return false
  return true
}

const displayed = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q && !status.value && !hasOpenIssue.value) return store.students
  return store.students.filter(matches)
})

function applyApiIfNeeded(): void {
  const q = search.value.trim()
  const searchToken = q.length === 0 ? 'EMPTY' : q.toLowerCase()
  const queryKey = `${searchToken}::|${status.value}::|${String(hasOpenIssue.value)}`

  if (queryKey !== lastAppliedQuery) {
    lastAppliedQuery = queryKey
    if (q.length === 0 || q.length >= MIN_SEARCH_LENGTH) {
      void load(1)
      return
    }
  }
}

watch([search, status, hasOpenIssue], applyApiIfNeeded)

async function load(page = 1) {
  return store.fetchStudents({
    search: search.value || undefined,
    status: status.value || undefined,
    has_open_issue: hasOpenIssue.value || undefined,
    per_page: 15,
    page,
  })
}

onMounted(() => {
  load(1)
})

function clearSearchOnly(): void {
  search.value = ''
  void applyApiIfNeeded()
}

function goToDetail(id: number) {
  router.push(`/tutor/students/${id}`)
}

function initials(name: string) {
  return name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function statusColor(status?: string) {
  switch (status) {
    case 'Assigned':
      return 'bg-indigo-50 text-indigo-700'
    case 'In Progress':
      return 'bg-blue-50 text-blue-700'
    case 'Completed':
      return 'bg-emerald-50 text-emerald-700'
    case 'Terminated':
      return 'bg-rose-50 text-rose-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function statusDot(status?: string) {
  switch (status) {
    case 'Assigned':
      return 'bg-indigo-500'
    case 'In Progress':
      return 'bg-blue-500'
    case 'Completed':
      return 'bg-emerald-500'
    case 'Terminated':
      return 'bg-rose-500'
    default:
      return 'bg-slate-400'
  }
}

function formatStatus(status?: string) {
  if (!status) return 'Unknown'
  return String(status)
}

function nextFollowup(student: any) {
  if (!student.next_followup) return '—'
  return `${student.next_followup.date_label} · ${student.next_followup.time_label}`
}

function livePendingMessage(): boolean {
  const q = search.value.trim()
  return q.length > 0 && q.length < MIN_SEARCH_LENGTH
}
</script>
