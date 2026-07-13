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
import { computed, h, defineComponent } from 'vue'
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

const stats = [
  {
    label: 'Assigned Students',
    value: 0,
    trend: 'No data yet',
    color: 'bg-indigo-500',
    icon: createIcon(
      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    ),
  },
  {
    label: 'Pending Reviews',
    value: 0,
    trend: 'No data yet',
    color: 'bg-amber-500',
    icon: createIcon(
      'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    ),
  },
  {
    label: 'Follow-ups',
    value: 0,
    trend: 'No data yet',
    color: 'bg-emerald-500',
    icon: createIcon(
      'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    ),
  },
  {
    label: 'Open Issues',
    value: 0,
    trend: 'No data yet',
    color: 'bg-rose-500',
    icon: createIcon(
      'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
    ),
  },
]
</script>
