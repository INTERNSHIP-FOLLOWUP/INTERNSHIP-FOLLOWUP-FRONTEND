<template>
  <div>
    <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold text-gray-900">Student Performance Feedback</h1>
          <p class="mt-1 text-sm text-gray-500">
            Evaluate the performance of your assigned internship students.
          </p>
        </div>
      </div>

      <form class="max-w-2xl space-y-6" @submit.prevent="submit">
        <!-- Student Selection -->
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">
            Student <span class="text-rose-500">*</span>
          </label>
          <div class="relative">
            <select
              v-model="form.student_id"
              class="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="" disabled>Select a student...</option>
              <option
                v-for="s in students"
                :key="s.id"
                :value="s.id"
              >
                {{ s.student_name || s.name || `Student #${s.id}` }}
              </option>
            </select>
            <svg class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- Strengths -->
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">
            Strengths <span class="text-rose-500">*</span>
          </label>
          <p class="text-xs text-gray-500">Select all that apply</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="s in STRENGTH_OPTIONS"
              :key="s"
              type="button"
              class="rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150"
              :class="form.strengths.includes(s)
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'"
              @click="toggleStrength(s)"
            >
              <span v-if="form.strengths.includes(s)" class="mr-1">✓</span>
              {{ s }}
            </button>
          </div>
        </div>

        <!-- Improvement Areas -->
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">
            Areas for Improvement <span class="text-rose-500">*</span>
          </label>
          <p class="text-xs text-gray-500">Select all that apply</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="area in IMPROVEMENT_OPTIONS"
              :key="area"
              type="button"
              class="rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150"
              :class="form.improvement_areas.includes(area)
                ? 'border-amber-300 bg-amber-50 text-amber-700 shadow-sm'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'"
              @click="toggleImprovement(area)"
            >
              <span v-if="form.improvement_areas.includes(area)" class="mr-1">✓</span>
              {{ area }}
            </button>
          </div>
        </div>

        <!-- Comment -->
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">
            Comment <span class="text-rose-500">*</span>
          </label>
          <textarea
            v-model="form.message"
            rows="4"
            class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            placeholder="Share your detailed feedback about this student's performance..."
          />
        </div>

        <div v-if="error" class="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
          <p class="text-sm text-rose-600">{{ error }}</p>
        </div>

        <div class="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            class="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            @click="resetForm"
          >
            Reset
          </button>
          <button
            type="submit"
            class="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-60"
            :disabled="submitting"
          >
            {{ submitting ? 'Submitting...' : 'Submit Feedback' }}
          </button>
        </div>
      </form>

      <!-- Submitted Feedback History -->
      <div class="mt-12">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-semibold text-gray-900">Submitted Feedback</h2>
          <span class="text-xs text-gray-400">{{ feedback.length }} entries</span>
        </div>

        <div v-if="loadingFeedback" class="py-8 text-center text-sm text-gray-500">
          Loading feedback...
        </div>

        <div v-else-if="!feedback.length" class="rounded-xl border border-dashed border-gray-200 py-12 text-center">
          <svg class="mx-auto mb-3 h-12 w-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm font-medium text-gray-500">No feedback submitted yet.</p>
          <p class="mt-1 text-xs text-gray-400">Complete the form above to submit your first evaluation.</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="item in feedback"
            :key="item.id"
            class="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div class="mb-3 flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <UserAvatar
                  :avatar="item.student?.photo_url || item.student?.photo"
                  :name="item.student?.name"
                  size="md"
                />
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ item.student?.name || 'Student' }}</p>
                  <p class="text-xs text-gray-400">{{ formatDate(item.created_at) }}</p>
                </div>
              </div>
            </div>

            <!-- Strengths badges -->
            <div v-if="item.strengths?.length" class="mb-2">
              <p class="mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Strengths</p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="s in item.strengths"
                  :key="s"
                  class="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/10"
                >
                  {{ s }}
                </span>
              </div>
            </div>

            <!-- Improvement areas badges -->
            <div v-if="item.improvement_areas?.length" class="mb-2">
              <p class="mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Areas for Improvement</p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="a in item.improvement_areas"
                  :key="a"
                  class="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-600/10"
                >
                  {{ a }}
                </span>
              </div>
            </div>

            <!-- Comment -->
            <div v-if="item.message" class="mt-2 rounded-lg bg-gray-50 px-3.5 py-2.5">
              <p class="text-sm leading-relaxed text-gray-700">{{ item.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useCompanyStore } from '@/stores/company'
import type { CompanyFeedbackItem, CompanyFeedbackPayload, CompanyStudentItem } from '@/types/company'
import UserAvatar from '@/components/common/UserAvatar.vue'

const STRENGTH_OPTIONS = [
  'Good Communication',
  'Strong Teamwork',
  'Quick Learner',
  'Responsible',
  'Punctual',
  'Good Problem-Solving',
  'Good Technical Skills',
  'Positive Attitude',
  'Takes Initiative',
  'Adapts Quickly',
  'Follows Instructions Well',
  'Professional Behavior',
]

const IMPROVEMENT_OPTIONS = [
  'Communication Skills',
  'Teamwork',
  'Technical Skills',
  'Time Management',
  'Problem-Solving',
  'Confidence',
  'Responsibility',
  'Attendance',
  'Work Quality',
  'Attention to Detail',
  'Initiative',
  'Adaptability',
]

const store = useCompanyStore()
const students = ref<CompanyStudentItem[]>([])
const feedback = ref<CompanyFeedbackItem[]>([])
const submitting = ref(false)
const loadingFeedback = ref(false)
const loadingStudents = ref(false)
const error = ref<string | null>(null)

const form = reactive<CompanyFeedbackPayload>({
  student_id: 0,
  strengths: [],
  improvement_areas: [],
  message: '',
})

function toggleStrength(s: string) {
  const idx = form.strengths.indexOf(s)
  if (idx === -1) {
    form.strengths.push(s)
  } else {
    form.strengths.splice(idx, 1)
  }
}

function toggleImprovement(area: string) {
  const idx = form.improvement_areas.indexOf(area)
  if (idx === -1) {
    form.improvement_areas.push(area)
  } else {
    form.improvement_areas.splice(idx, 1)
  }
}

function validate(): string | null {
  if (!form.student_id) return 'Please select a student'
  if (!form.strengths.length) return 'Please select at least one strength'
  if (!form.improvement_areas.length) return 'Please select at least one area for improvement'
  if (!form.message.trim()) return 'Please enter a comment'
  return null
}

async function submit() {
  const validationError = validate()
  if (validationError) {
    error.value = validationError
    return
  }

  submitting.value = true
  error.value = null
  try {
    await store.submitFeedback({
      student_id: form.student_id,
      strengths: form.strengths,
      improvement_areas: form.improvement_areas,
      message: form.message,
    })
    resetForm()
    await loadFeedback()
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Failed to submit feedback'
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  form.student_id = 0
  form.strengths = []
  form.improvement_areas = []
  form.message = ''
  error.value = null
}

async function loadFeedback() {
  loadingFeedback.value = true
  try {
    const items = await store.fetchFeedback()
    feedback.value = Array.isArray(items) ? items : []
  } finally {
    loadingFeedback.value = false
  }
}

async function loadStudents() {
  loadingStudents.value = true
  try {
    const items = await store.fetchStudents()
    students.value = Array.isArray(items) ? items : []
  } catch {
    students.value = []
  } finally {
    loadingStudents.value = false
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr.slice(0, 10)
  }
}

onMounted(() => {
  loadStudents()
  loadFeedback()
})
</script>
