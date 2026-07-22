<template>
  <div class="p-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {{ isEdit ? 'Edit Worklog' : 'Create Worklog' }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Weekly student submission.</p>
      </div>
      <router-link
        to="/student/worklogs"
        class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Back
      </router-link>
    </div>

    <div class="mt-6 max-w-3xl">
      <form @submit.prevent="onSubmit" class="space-y-5">
        <div>
          <label class="text-sm font-semibold text-slate-700">Week Number</label>
          <select
            v-model="form.week_number"
            required
            class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option disabled value="">Select a week</option>
            <option v-for="w in weeks" :key="w" :value="w">Week {{ w }}</option>
          </select>
          <p v-if="errors.week_number" class="mt-1 text-xs font-semibold text-red-500">
            {{ errors.week_number }}
          </p>
        </div>

        <div>
          <label class="text-sm font-semibold text-slate-700">Description</label>
          <textarea
            v-model="form.description"
            required
            rows="4"
            placeholder="What did you work on this week?"
            class="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <p v-if="errors.description" class="mt-1 text-xs font-semibold text-red-500">
            {{ errors.description }}
          </p>
        </div>

        <div>
          <label class="text-sm font-semibold text-slate-700">Challenges</label>
          <textarea
            v-model="form.challenges"
            rows="3"
            placeholder="What difficulties did you face?"
            class="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <p v-if="errors.challenges" class="mt-1 text-xs font-semibold text-red-500">
            {{ errors.challenges }}
          </p>
        </div>

        <div>
          <label class="text-sm font-semibold text-slate-700">Attachments</label>
          <div class="mt-2">
            <FileUpload v-model="files" />
          </div>
          <p v-if="errors.attachments" class="mt-1 text-xs font-semibold text-red-500">
            {{ errors.attachments }}
          </p>
        </div>

        <div class="flex items-center gap-3 pt-3">
          <button
            type="submit"
            :disabled="submitting"
            class="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-60"
          >
            <span v-if="submitting" class="inline-flex items-center gap-2">
              <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Saving...
            </span>
            <span v-else>{{ isEdit ? 'Update' : 'Submit' }}</span>
          </button>

          <button
            type="button"
            :disabled="submitting"
            @click="cancel"
            class="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>

        <div
          v-if="serverError"
          class="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700"
        >
          {{ serverError }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { WorklogStatus } from '@/types/worklog'
import { useWorklogStore } from '@/stores/worklogStore'
import FileUpload from '@/components/worklog/FileUpload.vue'
import type { Worklog } from '@/types/worklog'
import { parseApiError } from '@/utils/errorParser'

const route = useRoute()
const router = useRouter()
const store = useWorklogStore()

const idParam = computed(() => route.params.id)
const isEdit = computed(() => typeof idParam.value === 'string' && !!idParam.value)

const weeks = Array.from({ length: 52 }, (_, i) => i + 1)

const files = ref<File[]>([])

const form = reactive<{ week_number: number | ''; description: string; challenges: string }>({
  week_number: '',
  description: '',
  challenges: '',
})

const errors = reactive<Record<string, string>>({})
const serverError = ref<string>('')
const submitting = ref(false)

onMounted(async () => {
  if (!isEdit.value) return
  const id = Number(route.params.id)
  if (!Number.isFinite(id)) return
  await store.fetchWorklog(id)
  const w = store.worklog
  if (!w) return

  form.week_number = w.week_number
  form.description = w.description
  form.challenges = w.challenges ?? ''
})

function cancel() {
  router.push('/student/worklogs')
}

async function onSubmit() {
  submitting.value = true
  serverError.value = ''
  Object.keys(errors).forEach((k) => delete errors[k])

  try {
    const fd = new FormData()
    fd.append('week_number', String(form.week_number))
    fd.append('description', form.description)
    if (form.challenges?.trim()) fd.append('challenges', form.challenges)
    fd.append('submission_date', new Date().toISOString().split('T')[0])
    for (const f of files.value) fd.append('attachments[]', f)

    if (isEdit.value) {
      const id = Number(route.params.id)
      await store.updateWorklog(id, fd)
    } else {
      await store.createWorklog(fd)
    }

    router.push('/student/worklogs')
  } catch (err: unknown) {
    const parsed = parseApiError(err)
    serverError.value = parsed.message
    if (parsed.fields) {
      for (const [k, v] of Object.entries(parsed.fields)) {
        errors[k] = v
      }
    }
  } finally {
    submitting.value = false
  }
}
</script>
