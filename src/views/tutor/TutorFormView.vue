<template>
  <div class="space-y-6">
    <button
      type="button"
      @click="$router.back()"
      class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back to Tutors
    </button>

    <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <TutorForm
        :tutor-id="tutorId"
        @saved="onSaved"
        @cancel="$router.back()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTutorStore } from '@/stores/tutorStore'
import TutorForm from '@/components/tutor/TutorForm.vue'

const route = useRoute()
const tutorStore = useTutorStore()

const tutorId = computed(() =>
  route.name === 'AdminTutorsEdit' ? Number(route.params.id) : undefined,
)

async function onSaved(): Promise<void> {
  await tutorStore.fetchTutors()
  router.push('/admin/tutors')
}
</script>
