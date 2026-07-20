<template>
  <div>
    <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold text-gray-900">Submit Student Evaluation</h1>
          <p class="mt-1 text-sm text-gray-500">Evaluate student performance after internship.</p>
        </div>
      </div>

      <div v-if="loading" class="py-12">
        <div class="flex items-center justify-center">
          <div class="text-sm text-gray-600">Loading...</div>
        </div>
      </div>
      <div
        v-else-if="error"
        class="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3"
      >
        <p class="text-sm text-rose-600">{{ error }}</p>
      </div>
      <div v-else>
        <form class="max-w-xl space-y-5" @submit.prevent="submit">
          <label class="block space-y-1">
            <span class="text-sm font-medium text-gray-700"
              >Student <span class="text-rose-500">*</span></span
            >
            <select
              v-model="form.student_id"
              class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="" disabled>Select student</option>
              <option v-for="student in students" :key="student.id" :value="student.id">
                {{ student.name }}
              </option>
            </select>
          </label>

          <div class="grid grid-cols-2 gap-4">
            <label class="block space-y-1">
              <span class="text-sm font-medium text-gray-700"
                >Technical Skill <span class="text-rose-500">*</span></span
              >
              <input
                v-model.number="form.technical_skill"
                type="number"
                min="1"
                max="100"
                class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="1-100"
              />
            </label>

            <label class="block space-y-1">
              <span class="text-sm font-medium text-gray-700"
                >Communication <span class="text-rose-500">*</span></span
              >
              <input
                v-model.number="form.communication"
                type="number"
                min="1"
                max="100"
                class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="1-100"
              />
            </label>

            <label class="block space-y-1">
              <span class="text-sm font-medium text-gray-700"
                >Professionalism <span class="text-rose-500">*</span></span
              >
              <input
                v-model.number="form.professionalism"
                type="number"
                min="1"
                max="100"
                class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="1-100"
              />
            </label>

            <label class="block space-y-1">
              <span class="text-sm font-medium text-gray-700"
                >Attendance <span class="text-rose-500">*</span></span
              >
              <input
                v-model.number="form.attendance"
                type="number"
                min="1"
                max="100"
                class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="1-100"
              />
            </label>
          </div>

          <label class="block space-y-1">
            <span class="text-sm font-medium text-gray-700">Feedback</span>
            <textarea
              v-model="form.feedback"
              rows="4"
              class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              placeholder="Provide constructive feedback about the student's performance..."
            />
          </label>

          <div class="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              class="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              @click="reset"
            >
              Reset
            </button>
            <button
              type="submit"
              class="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-60"
              :disabled="submitting"
            >
              {{ submitting ? 'Submitting...' : 'Submit Evaluation' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useCompanyStore } from '@/stores/company'
import type { CompanyEvaluationPayload } from '@/types/company'

const store = useCompanyStore()

const students = ref<{ id: number; name: string }[]>([])
const submitting = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const form = reactive<CompanyEvaluationPayload>({
  student_id: 0,
  technical_skill: 0,
  communication: 0,
  professionalism: 0,
  attendance: 0,
  feedback: '',
})

async function loadStudents() {
  loading.value = true
  error.value = null
  try {
    const items = await store.fetchStudents()
    const source = Array.isArray(items) ? items : []
    students.value = source.map((item) => ({
      id: Number(item?.id ?? 0),
      name: String(item?.name ?? item?.student_name ?? 'Student'),
    }))
  } catch (e) {
    error.value = 'Failed to load students'
  } finally {
    loading.value = false
  }
}

function validate(): string | null {
  if (!form.student_id) return 'Please select a student'
  if (form.technical_skill < 1 || form.technical_skill > 100) return 'Technical Skill must be between 1 and 100'
  if (form.communication < 1 || form.communication > 100) return 'Communication must be between 1 and 100'
  if (form.professionalism < 1 || form.professionalism > 100) return 'Professionalism must be between 1 and 100'
  if (form.attendance < 1 || form.attendance > 100) return 'Attendance must be between 1 and 100'
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
    await store.submitEvaluation({
      student_id: form.student_id,
      technical_skill: form.technical_skill,
      communication: form.communication,
      professionalism: form.professionalism,
      attendance: form.attendance,
      feedback: form.feedback || null,
    })
    reset()
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Failed to submit evaluation'
  } finally {
    submitting.value = false
  }
}

function reset() {
  form.student_id = 0
  form.technical_skill = 0
  form.communication = 0
  form.professionalism = 0
  form.attendance = 0
  form.feedback = ''
  error.value = null
}

loadStudents()
</script>
