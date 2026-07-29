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
        class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        Back
      </router-link>
    </div>

    <div class="mt-6 max-w-3xl">
      <form @submit.prevent="onSubmit" class="space-y-5">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Date</label>
            <input
              v-model="form.work_date"
              type="date"
              class="mt-2 h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all duration-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              :class="errors.work_date ? 'border-red-400 ring-2 ring-red-500/20 focus:border-red-400 dark:border-red-500' : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-500/20 dark:border-slate-600'"
            />
            <p v-if="errors.work_date" class="mt-1 text-xs font-semibold text-red-500">{{ errors.work_date }}</p>
          </div>
          <div>
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Time (From – To)</label>
            <div class="mt-2 flex items-center gap-2">
              <input
                v-model="form.time_from"
                type="time"
                class="h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all duration-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                :class="errors.time_from ? 'border-red-400 ring-2 ring-red-500/20 focus:border-red-400 dark:border-red-500' : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-500/20 dark:border-slate-600'"
              />
              <span class="text-sm font-semibold text-slate-400">to</span>
              <input
                v-model="form.time_to"
                type="time"
                class="h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all duration-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                :class="errors.time_to ? 'border-red-400 ring-2 ring-red-500/20 focus:border-red-400 dark:border-red-500' : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-500/20 dark:border-slate-600'"
              />
            </div>
            <p v-if="errors.time_from || errors.time_to" class="mt-1 text-xs font-semibold text-red-500">{{ errors.time_from || errors.time_to }}</p>
          </div>
        </div>

        <div>
          <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Work Activities</label>
          <textarea
            v-model="form.work_activities"
            rows="4"
            placeholder="What work activities did you perform?"
            class="mt-2 w-full resize-none rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all duration-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            :class="errors.work_activities ? 'border-red-400 ring-2 ring-red-500/20 focus:border-red-400 dark:border-red-500' : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-500/20 dark:border-slate-600'"
          />
          <p v-if="errors.work_activities" class="mt-1 text-xs font-semibold text-red-500">{{ errors.work_activities }}</p>
        </div>

        <div>
          <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">What did you learn?</label>
          <textarea
            v-model="form.what_learned"
            rows="3"
            placeholder="What new things did you learn?"
            class="mt-2 w-full resize-none rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all duration-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            :class="errors.what_learned ? 'border-red-400 ring-2 ring-red-500/20 focus:border-red-400 dark:border-red-500' : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-500/20 dark:border-slate-600'"
          />
          <p v-if="errors.what_learned" class="mt-1 text-xs font-semibold text-red-500">{{ errors.what_learned }}</p>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Difficulties / Issues</label>
            <textarea
              v-model="form.difficulties"
              rows="3"
              placeholder="What difficulties or issues did you encounter?"
              class="mt-2 w-full resize-none rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all duration-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              :class="errors.difficulties ? 'border-red-400 ring-2 ring-red-500/20 focus:border-red-400 dark:border-red-500' : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-500/20 dark:border-slate-600'"
            />
            <p v-if="errors.difficulties" class="mt-1 text-xs font-semibold text-red-500">{{ errors.difficulties }}</p>
          </div>
          <div>
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Solutions</label>
            <textarea
              v-model="form.solutions"
              rows="3"
              placeholder="How did you solve them?"
              class="mt-2 w-full resize-none rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all duration-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              :class="errors.solutions ? 'border-red-400 ring-2 ring-red-500/20 focus:border-red-400 dark:border-red-500' : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-500/20 dark:border-slate-600'"
            />
            <p v-if="errors.solutions" class="mt-1 text-xs font-semibold text-red-500">{{ errors.solutions }}</p>
          </div>
        </div>

        <div>
          <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">To Do</label>
          <textarea
            v-model="form.to_do"
            rows="2"
            placeholder="What do you plan to do next?"
            class="mt-2 w-full resize-none rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all duration-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            :class="errors.to_do ? 'border-red-400 ring-2 ring-red-500/20 focus:border-red-400 dark:border-red-500' : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-500/20 dark:border-slate-600'"
          />
          <p v-if="errors.to_do" class="mt-1 text-xs font-semibold text-red-500">{{ errors.to_do }}</p>
        </div>

        <div>
          <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Comment</label>
          <textarea
            v-model="form.comment"
            rows="2"
            placeholder="Any additional comments?"
            class="mt-2 w-full resize-none rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all duration-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            :class="errors.comment ? 'border-red-400 ring-2 ring-red-500/20 focus:border-red-400 dark:border-red-500' : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-500/20 dark:border-slate-600'"
          />
          <p v-if="errors.comment" class="mt-1 text-xs font-semibold text-red-500">{{ errors.comment }}</p>
        </div>

        <div>
          <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Attachments</label>
          <div class="mt-2 rounded-xl transition-all duration-200" :class="errors.attachments ? 'border-2 border-red-400 ring-2 ring-red-500/20' : ''">
            <FileUpload v-model="files" />
          </div>
          <p v-if="errors.attachments" class="mt-1 text-xs font-semibold text-red-500">{{ errors.attachments }}</p>
        </div>

        <div class="flex items-center gap-3 pt-3">
          <button
            type="submit"
            :disabled="submitting"
            class="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-60"
          >
            <span v-if="submitting" class="inline-flex items-center gap-2">
              <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </span>
            <span v-else>{{ isEdit ? 'Update' : 'Submit' }}</span>
          </button>

          <button
            type="button"
            :disabled="submitting"
            @click="cancel"
            class="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
        </div>

        <div v-if="serverError" class="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
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

const files = ref<File[]>([])

const form = reactive<{
  work_date: string
  time_from: string
  time_to: string
  work_activities: string
  what_learned: string
  difficulties: string
  solutions: string
  to_do: string
  comment: string
}>(
  {
    work_date: '',
    time_from: '',
    time_to: '',
    work_activities: '',
    what_learned: '',
    difficulties: '',
    solutions: '',
    to_do: '',
    comment: '',
  },
)

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

  form.work_date = w.work_date ?? ''
  if (w.work_time) {
    const parts = w.work_time.split(' to ')
    form.time_from = parts[0] ?? ''
    form.time_to = parts[1] ?? ''
  }
  form.work_activities = w.work_activities ?? ''
  form.what_learned = w.what_learned ?? ''
  form.difficulties = w.difficulties ?? ''
  form.solutions = w.solutions ?? ''
  form.to_do = w.to_do ?? ''
  form.comment = w.comment ?? ''
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
    if (form.work_date) fd.append('work_date', form.work_date)
    if (form.time_from || form.time_to) fd.append('work_time', `${form.time_from} to ${form.time_to}`)
    if (form.work_activities?.trim()) fd.append('work_activities', form.work_activities)
    if (form.what_learned?.trim()) fd.append('what_learned', form.what_learned)
    if (form.difficulties?.trim()) fd.append('difficulties', form.difficulties)
    if (form.solutions?.trim()) fd.append('solutions', form.solutions)
    if (form.to_do?.trim()) fd.append('to_do', form.to_do)
    if (form.comment?.trim()) fd.append('comment', form.comment)
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

