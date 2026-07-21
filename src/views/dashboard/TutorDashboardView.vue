<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Welcome back, {{ firstName }}!</h1>
      <p class="mt-1 text-sm text-gray-500">
        Here's an overview of your assigned students and activities.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ stat.label }}</p>
            <p class="mt-1 text-2xl font-bold text-gray-900">{{ stat.value }}</p>
          </div>
          <div class="flex h-10 w-10 items-center justify-center rounded-lg" :class="stat.color">
            <component :is="stat.icon" class="h-5 w-5 text-white" />
          </div>
        </div>
        <p
          class="mt-2 text-xs"
          :class="stat.trend.startsWith('+') ? 'text-green-600' : 'text-gray-400'"
        >
          {{ stat.trend }}
        </p>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 class="text-base font-semibold text-gray-900">Recent Worklogs</h2>
        <p class="mt-2 text-sm text-gray-500">
          No worklogs submitted yet. Assign students to get started.
        </p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 class="text-base font-semibold text-gray-900">Upcoming Follow-ups</h2>
        <p class="mt-2 text-sm text-gray-500">
          No follow-ups scheduled. Create one to track student progress.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, defineComponent, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const firstName = computed(() => {
  const name = auth.user?.name
  if (!name) return 'Tutor'
  return name.split(' ')[0] || 'Tutor'
})

function createIcon(path: string) {
  return defineComponent({
    setup() {
      return () =>
        h(
          'svg',
          {
            class: 'h-5 w-5',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24',
          },
          [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              'stroke-width': 2,
              d: path,
            }),
          ],
        )
    },
  })
}

const stats = ref([
  {
    label: 'Total Issues',
    value: 0,
    trend: 'Loading...',
    color: 'bg-blue-500',
    icon: createIcon(
      'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    ),
  },
  {
    label: 'Total Open Issues',
    value: 0,
    trend: 'Loading...',
    color: 'bg-amber-500',
    icon: createIcon(
      'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    ),
  },
  {
    label: 'Total In Progress',
    value: 0,
    trend: 'Loading...',
    color: 'bg-indigo-500',
    icon: createIcon(
      'M13 10V3L4 14h7v7l9-11h-7z',
    ),
  },
  {
    label: 'Total Resolved',
    value: 0,
    trend: 'Loading...',
    color: 'bg-emerald-500',
    icon: createIcon(
      'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    ),
  },
])

onMounted(async () => {
  try {
    const { useIssueStore } = await import('@/stores/issueStore')
    const issueStore = useIssueStore()
    await issueStore.fetchIssueStats()
    const currentStats = issueStore.stats
    if (currentStats) {
      const total = currentStats.total ?? 0
      stats.value[0]!.value = total
      stats.value[0]!.trend = 'All issues'
      stats.value[1]!.value = currentStats.open || 0
      stats.value[1]!.trend = `of ${total} total`
      stats.value[2]!.value = currentStats.inProgress || 0
      stats.value[2]!.trend = `of ${total} total`
      stats.value[3]!.value = currentStats.resolved || 0
      stats.value[3]!.trend = `of ${total} total`
    }
  } catch {
    stats.value.forEach((s) => (s.trend = 'Unable to load'))
  }
})
</script>
