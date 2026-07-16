<template>
  <div class="flex min-h-screen items-start justify-center bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    <div class="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Student Worklog</p>
          <h1 class="mt-2 text-2xl font-semibold text-slate-900">{{ isEdit ? 'Edit Worklog' : 'Create Worklog' }}</h1>
          <p class="mt-1 text-sm text-slate-500">{{ isEdit ? 'Update your weekly internship submission.' : 'Submit your weekly internship progress.' }}</p>
        </div>
        <router-link to="/student/worklogs" class="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          Back
        </router-link>
      </div>

      <div v-if="initialLoading" class="mt-8 space-y-4">
        <div class="h-4 w-24 animate-pulse rounded bg-slate-200"></div>
        <div class="h-11 animate-pulse rounded-2xl bg-slate-100"></div>
        <div class="h-24 animate-pulse rounded-2xl bg-slate-100"></div>
        <div class="h-24 animate-pulse rounded-2xl bg-slate-100"></div>
      </div>

      <form v-else @submit.prevent="onSubmit" class="mt-8 space-y-5">
        <div>
          <label class="text-sm font-semibold text-slate-700">Week Number</label>
          <select v-model="form.week_number" class="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100">
            <option value="">Select Week</option>
            <option v-for="week in weeks" :key="week" :value="week">Week {{ week }}</option>
          </select>
          <p v-if="errors.week_number" class="mt-1 text-xs font-semibold text-red-600">{{ errors.week_number }}</p>
        </div>

        <div>
          <label class="text-sm font-semibold text-slate-700">Description</label>
          <textarea v-model="form.description" rows="5" placeholder="Describe what you worked on this week..." class="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"></textarea>
          <div class="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span v-if="errors.description" class="font-semibold text-red-600">{{ errors.description }}</span>
            <span v-else>Minimum 10 characters</span>
            <span>{{ form.description.trim().length }}/500</span>
          </div>
        </div>

        <div>
          <label class="text-sm font-semibold text-slate-700">Challenges</label>
          <textarea v-model="form.challenges" rows="4" placeholder="Describe any problems or challenges you encountered..." class="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"></textarea>
          <p v-if="errors.challenges" class="mt-1 text-xs font-semibold text-red-600">{{ errors.challenges }}</p>
        </div>

        <div>
          <label class="text-sm font-semibold text-slate-700">Attachments</label>
          <div class="mt-2">
            <FileUpload v-model="files" @validation="handleFileValidation" />
          </div>
          <p v-if="errors.attachments" class="mt-1 text-xs font-semibold text-red-600">{{ errors.attachments }}</p>
        </div>

        <div v-if="serverError" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {{ serverError }}
        </div>

        <div class="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
          <button type="button" :disabled="submitting" class="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60" @click="cancel">
            Cancel
          </button>
          <button type="submit" :disabled="submitting" class="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:opacity-60">
            <span v-if="submitting" class="inline-flex items-center gap-2">
              <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Saving...
            </span>
            <span v-else>{{ isEdit ? 'Update Worklog' : 'Submit Worklog' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorklogStore } from '@/stores/worklogStore'
import FileUpload from '@/components/worklog/FileUpload.vue'
import { parseApiError } from '@/utils/errorParser'

const route = useRoute()
const router = useRouter()
const store = useWorklogStore()

const weeks = Array.from({ length: 52 }, (_, i) => i + 1)
const files = ref<File[]>([])
const serverError = ref('')
const submitting = ref(false)
const initialLoading = ref(false)

const idParam = computed(() => route.params.id)
const isEdit = computed(() => typeof idParam.value === 'string' && !!idParam.value)

const form = reactive({
  week_number: '' as number | '',
  description: '',
  challenges: '',
})

const errors = reactive<Record<string, string>>({})

onMounted(async () => {
  if (!isEdit.value) return

  initialLoading.value = true
  const id = Number(route.params.id)
  if (!Number.isFinite(id)) return

  try {
    await store.fetchWorklog(id)
    const worklog = store.worklog
    if (worklog) {
      form.week_number = worklog.week_number
      form.description = worklog.description || ''
      form.challenges = worklog.challenges || ''
    }
  } catch {
    // handled by store error state
  } finally {
    initialLoading.value = false
  }
})

function handleFileValidation(message: string | null) {
  if (!message) {
    delete errors.attachments
    return
  }
  errors.attachments = message
}

function cancel() {
  router.push('/student/worklogs')
}

function validateForm() {
  const nextErrors: Record<string, string> = {}

  if (!form.week_number) nextErrors.week_number = 'Please select a week.'
  if (!form.description.trim()) {
    nextErrors.description = 'Please describe your weekly progress.'
  } else if (form.description.trim().length < 10) {
    nextErrors.description = 'Please add at least 10 characters.'
  }

  if (!form.challenges.trim()) {
    // Optional, so ignore
  }

  Object.keys(errors).forEach((key) => delete errors[key])
  Object.assign(errors, nextErrors)
  return Object.keys(nextErrors).length === 0
}

async function onSubmit() {
  if (!validateForm()) return

  submitting.value = true
  serverError.value = ''

  try {
    const payload = new FormData()
    payload.append('week_number', String(form.week_number))
    payload.append('description', form.description.trim())

    if (form.challenges.trim()) payload.append('challenges', form.challenges.trim())
    files.value.forEach((file) => payload.append('attachments', file))

    if (isEdit.value) {
      const id = Number(route.params.id)
      await store.updateWorklog(id, payload)
    } else {
      await store.createWorklog(payload)
    }

    router.push('/student/worklogs')
  } catch (err: unknown) {
    const parsed = parseApiError(err)
    serverError.value = parsed.message
    if (parsed.fields) {
      Object.entries(parsed.fields).forEach(([key, value]) => {
        errors[key] = value
      })
    }
  } finally {
    submitting.value = false
  }
}
</script>

