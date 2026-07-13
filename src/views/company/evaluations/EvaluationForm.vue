<template>
  <div class="mx-auto max-w-3xl px-4 py-6">
    <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div class="mb-6">
        <h1 class="text-xl font-semibold text-gray-900">Submit Student Evaluation</h1>
        <p class="mt-1 text-sm text-gray-500">
          Rate your assigned student across skills, communication, professionalism, and attendance.
        </p>
      </div>

      <div v-if="store.loading" class="py-10">
        <div class="flex items-center justify-center">
          <div class="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-primary-600" />
        </div>
      </div>

      <div v-else>
        <form class="space-y-5" @submit.prevent="onSubmit">
          <!-- Student -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              Student <span class="text-rose-500">*</span>
            </label>
            <select v-model="form.student_id"
              class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              :aria-invalid="!!fieldErrors.student_id">
              <option value="" disabled>Select student</option>
              <option v-for="s in store.students" :key="s.id" :value="s.id">
                {{ s.name }}
              </option>
            </select>
            <p v-if="fieldErrors.student_id" class="text-sm text-rose-600">{{ fieldErrors.student_id }}</p>
          </div>

          <!-- Ratings -->
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Technical Skill <span class="text-rose-500">*</span>
              </label>
              <StarRating v-model="form.technical_skill" :error="fieldErrors.technical_skill"
                aria-label="Technical skill" />
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Communication <span class="text-rose-500">*</span>
              </label>
              <StarRating v-model="form.communication" :error="fieldErrors.communication" aria-label="Communication" />
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Professionalism <span class="text-rose-500">*</span>
              </label>
              <StarRating v-model="form.professionalism" :error="fieldErrors.professionalism"
                aria-label="Professionalism" />
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                Attendance <span class="text-rose-500">*</span>
              </label>
              <StarRating v-model="form.attendance" :error="fieldErrors.attendance" aria-label="Attendance" />
            </div>
          </div>

          <!-- Overall -->
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-sm font-medium text-gray-700">Overall Score</p>
              <p class="text-xs text-gray-500">Auto-calculated as the average of the 4 ratings.</p>
            </div>
            <ScoreBadge :score="overallScore" />
          </div>

          <!-- Feedback -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              Feedback <span class="text-gray-400'">(optional)</span>
            </label>
            <textarea v-model="form.feedback" maxlength="1000" rows="5"
              class="mt-1 w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              placeholder="Excellent work, keep improving..." />
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span />
              <span>{{ (form.feedback?.length ?? 0) }}/1000</span>
            </div>
          </div>

          <!-- Non-field errors -->
          <div v-if="formError" class="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
            <p class="text-sm text-rose-600">{{ formError }}</p>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col-reverse items-stretch justify-end gap-3 sm:flex-row">
            <button type="button"
              class="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              :disabled="submitting" @click="onCancel">
              Cancel
            </button>

            <button type="submit"
              class="inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-60"
              :disabled="submitting || !isFormValid">
              <span v-if="submitting"
                class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              {{ submitting ? 'Submitting...' : 'Submit' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import StarRating from '@/components/evaluation/StarRating.vue'
import ScoreBadge from '@/components/evaluation/ScoreBadge.vue'
import { useEvaluationStore } from '@/stores/evaluationStore'
import { parseApiError } from '@/utils/errorParser'

import { notifyError, notifySuccess } from '@/utils/notify'

const router = useRouter()
const store = useEvaluationStore()


const submitting = ref(false)
const formError = ref<string | null>(null)

const form = reactive<{
  student_id: number | ''
  technical_skill: number | null
  communication: number | null
  professionalism: number | null
  attendance: number | null
  feedback: string
}>({
  student_id: '',
  technical_skill: null,
  communication: null,
  professionalism: null,
  attendance: null,
  feedback: '',
})

function getRatingOrNull(v: number | null) {
  if (v == null) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

const overallScore = computed(() => {
  const r = [
    getRatingOrNull(form.technical_skill) ?? 0,
    getRatingOrNull(form.communication) ?? 0,
    getRatingOrNull(form.professionalism) ?? 0,
    getRatingOrNull(form.attendance) ?? 0,
  ]
  const avg = r.reduce((a, b) => a + b, 0) / 4
  return avg
})

const fieldErrors = computed(() => store.errors)

const isFormValid = computed(() => {
  return (
    form.student_id !== '' &&
    form.technical_skill != null &&
    form.communication != null &&
    form.professionalism != null &&
    form.attendance != null
  )
})

async function load() {
  try {
    await store.fetchStudents()
  } catch (err: unknown) {
    const parsed = parseApiError(err)
    formError.value = parsed.message
  }
}

async function onSubmit() {
  submitting.value = true
  formError.value = null
  store.clearErrors()

  try {
    // client validation (required fields)
    if (!isFormValid.value) {
      const errs: Record<string, string> = {}
      if (form.student_id === '') errs.student_id = 'Student is required.'
      if (form.technical_skill == null) errs.technical_skill = 'Technical skill is required.'
      if (form.communication == null) errs.communication = 'Communication is required.'
      if (form.professionalism == null) errs.professionalism = 'Professionalism is required.'
      if (form.attendance == null) errs.attendance = 'Attendance is required.'
      store.setErrors(errs)
      return
    }

    const payload = {
      student_id: Number(form.student_id),
      technical_skill: Number(form.technical_skill),
      communication: Number(form.communication),
      professionalism: Number(form.professionalism),
      attendance: Number(form.attendance),
      overall_score: Number(overallScore.value.toFixed(2)),
      feedback: form.feedback.trim() ? form.feedback.trim() : null,
    }

    await store.createEvaluation(payload)

    notifySuccess('Evaluation submitted successfully.')
    router.push({ name: 'CompanyEvaluations' })
  } catch (err: unknown) {
    const parsed = parseApiError(err)
    formError.value = parsed.message
    store.setErrors(parsed.fields)
    notifyError('Failed to submit evaluation.')
  } finally {
    submitting.value = false
  }
}

function onCancel() {
  router.push({ name: 'CompanyEvaluations' })
}

onMounted(load)
</script>
