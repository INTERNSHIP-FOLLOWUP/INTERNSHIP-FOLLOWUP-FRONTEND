<template>
  <div>
    <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold text-gray-900">Submit Student Evaluation</h1>
          <p class="mt-1 text-sm text-gray-500">Evaluate student performance after internship.</p>
        </div>
      </div>

      <div v-if="store.loading" class="py-12">
        <div class="flex items-center justify-center">
          <div class="text-sm text-gray-600">Loading…</div>
        </div>
      </div>
      <div
        v-else-if="store.error"
        class="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3"
      >
        <p class="text-sm text-rose-600">{{ store.error }}</p>
      </div>
      <div v-else>
        <form class="max-w-xl space-y-5" @submit.prevent="submit">
          <label class="block space-y-1">
            <span class="text-sm font-medium text-gray-700"
              >Student <span class="text-rose-500">*</span></span
            >
            <select
              v-model="form.studentId"
              class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="" disabled>Select student</option>
              <option v-for="student in students" :key="student.id" :value="student.id">
                {{ student.name }}
              </option>
            </select>
          </label>

          <label class="block space-y-1">
            <span class="text-sm font-medium text-gray-700"
              >Rating <span class="text-rose-500">*</span></span
            >
            <select
              v-model="form.rating"
              class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="" disabled>Select rating</option>
              <option value="5">Excellent</option>
              <option value="4">Good</option>
              <option value="3">Average</option>
              <option value="2">Below Average</option>
              <option value="1">Poor</option>
            </select>
          </label>

          <label class="block space-y-1">
            <span class="text-sm font-medium text-gray-700"
              >Remarks <span class="text-rose-500">*</span></span
            >
            <textarea
              v-model="form.remarks"
              rows="5"
              class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              placeholder="Provide constructive feedback..."
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

const store = useCompanyStore()

const students = ref<{ id: number; name: string }[]>([])
const submitting = ref(false)

const form = reactive<{ studentId: string; rating: string; remarks: string }>({
  studentId: '',
  rating: '',
  remarks: '',
})

async function loadStudents() {
  try {
    const items = await store.fetchStudents()
    const source = Array.isArray(items) ? items : []
    students.value = source.map((item: any) => ({
      id: Number(item?.id ?? 0),
      name: String(item?.name ?? item?.student_name ?? 'Student'),
    }))
  } catch {}
}

async function submit() {
  submitting.value = true
  try {
    await store.submitEvaluation({
      studentId: Number(form.studentId),
      rating: Number(form.rating),
      remarks: form.remarks || null,
    })
    reset()
  } finally {
    submitting.value = false
  }
}

function reset() {
  form.studentId = ''
  form.rating = ''
  form.remarks = ''
}

loadStudents()
</script>
