<template>
  <div>
    <div v-if="activity">
      <div class="grid gap-4 md:grid-cols-3">
        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs uppercase tracking-wider text-slate-400">Worklogs</p>
          <p class="mt-2 text-base font-semibold text-slate-900">{{ activity.worklog_stats.total }}</p>
          <div class="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
            <span class="rounded-full bg-amber-50 px-2 py-1 text-amber-700">{{ activity.worklog_stats.submitted }} submitted</span>
            <span class="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">{{ activity.worklog_stats.approved }} approved</span>
            <span class="rounded-full bg-rose-50 px-2 py-1 text-rose-700">{{ activity.worklog_stats.rejected }} rejected</span>
          </div>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs uppercase tracking-wider text-slate-400">Issues</p>
          <p class="mt-2 text-base font-semibold text-slate-900">{{ activity.issues.length }}</p>
          <p class="mt-2 text-sm text-slate-500">Latest: {{ activity.issues[0]?.title ?? 'No issues' }}</p>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs uppercase tracking-wider text-slate-400">Assignments</p>
          <p class="mt-2 text-base font-semibold text-slate-900">{{ activity.assignments.length }}</p>
          <p class="mt-2 text-sm text-slate-500">Students: {{ activity.students.length }}</p>
        </div>
      </div>
    </div>
    <div v-else class="text-sm text-slate-500">Loading tutor details...</div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

interface TutorWorklogStats {
  total: number
  submitted: number
  approved: number
  rejected: number
}

interface TutorActivity {
  worklog_stats: TutorWorklogStats
  issues: Array<{ title?: string }>
  assignments: Array<unknown>
  students: Array<unknown>
}

const props = defineProps({
  activity: {
    type: Object as PropType<TutorActivity | null>,
    default: null,
  },
})
</script>
