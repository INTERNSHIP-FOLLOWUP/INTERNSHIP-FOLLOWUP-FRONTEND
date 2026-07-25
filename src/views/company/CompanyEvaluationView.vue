<template>
  <div class="space-y-6">
    <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold text-gray-900">{{ $t('companies.submitEvaluation') }}</h1>
          <p class="mt-1 text-sm text-gray-500">{{ $t('companies.evaluationSubtitle') }}</p>
        </div>
      </div>

      <div v-if="loading" class="py-12">
        <div class="flex items-center justify-center">
          <div class="text-sm text-gray-600">{{ $t('common.loading') }}</div>
        </div>
      </div>
      <div v-else>
        <div
          v-if="formError"
          class="mb-5 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3"
        >
          <p class="text-sm text-rose-600">{{ formError }}</p>
        </div>

        <form class="max-w-xl space-y-5" @submit.prevent="submit">
          <label class="block space-y-1">
            <span class="text-sm font-medium text-gray-700"
              >{{ $t('common.student') }} <span class="text-rose-500">*</span></span
            >
            <select
              v-model="form.student_id"
              class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="0" disabled>{{ $t('companies.selectStudent') }}</option>
              <option v-for="student in students" :key="student.id" :value="student.id">
                {{ student.name }}
              </option>
            </select>
          </label>

          <div class="grid grid-cols-2 gap-4">
            <label class="block space-y-1">
              <span class="text-sm font-medium text-gray-700"
                >{{ $t('companies.technicalSkill') }} <span class="text-rose-500">*</span></span
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
                >{{ $t('companies.communicationField') }} <span class="text-rose-500">*</span></span
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
                >{{ $t('companies.professionalismField') }} <span class="text-rose-500">*</span></span
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
                >{{ $t('companies.attendanceField') }} <span class="text-rose-500">*</span></span
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
            <span class="text-sm font-medium text-gray-700">{{ $t('companies.feedback') }}</span>
            <textarea
              v-model="form.feedback"
              rows="4"
              class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              :placeholder="$t('companies.feedbackPlaceholder')"
            />
          </label>

          <div class="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              class="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              @click="resetForm"
            >
              {{ $t('companies.reset') }}
            </button>
            <button
              type="submit"
              class="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-60"
              :disabled="submitting"
            >
              {{ submitting ? $t('companies.submitting') : $t('companies.submitEval') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">{{ $t('companies.submittedEvalTitle') }}</h2>
          <p class="mt-1 text-sm text-gray-500">{{ $t('companies.submittedEvalSub') }}</p>
        </div>
      </div>

      <div v-if="loadingEvaluations" class="flex items-center justify-center py-8">
        <div class="text-sm text-gray-600">{{ $t('common.loading') }}</div>
      </div>

      <div v-else-if="!submittedEvaluations.length" class="py-8 text-center text-sm text-gray-500">
        {{ $t('companies.noEvalYet') }}
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="item in submittedEvaluations"
          :key="item.id"
          class="rounded-xl border border-gray-100 bg-gray-50/50 p-4"
        >
          <div class="mb-2 flex items-start justify-between gap-3">
            <div>
              <h3 class="text-sm font-semibold text-gray-900">
                {{ studentName(item) }}
              </h3>
              <p class="mt-0.5 text-xs text-gray-500">{{ formatDate(item.created_at) }}</p>
            </div>
            <span
              class="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold"
              :class="scoreBadge(item.overall_score)"
            >
              {{ item.overall_score }}/100
            </span>
          </div>
          <div class="grid grid-cols-4 gap-2">
            <div class="text-center">
              <p class="text-[10px] text-gray-400">{{ $t('companies.technical') }}</p>
              <p class="text-xs font-semibold text-gray-800">{{ item.technical_skill }}</p>
            </div>
            <div class="text-center">
              <p class="text-[10px] text-gray-400">{{ $t('companies.communicationField') }}</p>
              <p class="text-xs font-semibold text-gray-800">{{ item.communication }}</p>
            </div>
            <div class="text-center">
              <p class="text-[10px] text-gray-400">{{ $t('companies.professionalismField') }}</p>
              <p class="text-xs font-semibold text-gray-800">{{ item.professionalism }}</p>
            </div>
            <div class="text-center">
              <p class="text-[10px] text-gray-400">{{ $t('companies.attendanceField') }}</p>
              <p class="text-xs font-semibold text-gray-800">{{ item.attendance }}</p>
            </div>
          </div>
          <p v-if="item.feedback" class="mt-2 text-xs text-gray-600">
            "{{ item.feedback }}"
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCompanyStore } from '@/stores/company'
import type { CompanyEvaluationPayload, CompanyEvaluationItem } from '@/types/company'

const { t: $t_script } = useI18n()

const store = useCompanyStore()

const students = ref<{ id: number; studentId: number; name: string }[]>([])
const submittedEvaluations = ref<CompanyEvaluationItem[]>([])
const submitting = ref(false)
const loading = ref(false)
const loadingEvaluations = ref(false)
const formError = ref<string | null>(null)

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
  formError.value = null
  try {
    const items = await store.fetchStudents()
    const source = Array.isArray(items) ? items : []
    students.value = source.map((item) => ({
      id: Number(item?.id ?? 0),
      studentId: Number(item?.student_id ?? item?.id ?? 0),
      name: studentDisplayName(item),
    }))
  } catch {
    formError.value = $t_script('companies.evaluationFormError')
  } finally {
    loading.value = false
  }
}

async function loadEvaluations() {
  loadingEvaluations.value = true
  try {
    const items = await store.fetchEvaluations()
    submittedEvaluations.value = Array.isArray(items) ? items : []
  } catch {
    // silently fail
  } finally {
    loadingEvaluations.value = false
  }
}

function validate(): string | null {
  if (!form.student_id) return $t_script('companies.validateSelectStudent')
  if (form.technical_skill < 1 || form.technical_skill > 100) return $t_script('companies.validateSkillRange')
  if (form.communication < 1 || form.communication > 100) return $t_script('companies.validateCommRange')
  if (form.professionalism < 1 || form.professionalism > 100) return $t_script('companies.validateProfRange')
  if (form.attendance < 1 || form.attendance > 100) return $t_script('companies.validateAttendRange')
  return null
}

async function submit() {
  const validationError = validate()
  if (validationError) {
    formError.value = validationError
    return
  }

  submitting.value = true
  formError.value = null
  try {
    await store.submitEvaluation({
      student_id: form.student_id,
      technical_skill: form.technical_skill,
      communication: form.communication,
      professionalism: form.professionalism,
      attendance: form.attendance,
      feedback: form.feedback || null,
    })
    resetForm()
    await loadEvaluations()
  } catch (e: any) {
    formError.value = e?.response?.data?.message || e?.message || $t_script('companies.evalFailed')
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  form.student_id = 0
  form.technical_skill = 0
  form.communication = 0
  form.professionalism = 0
  form.attendance = 0
  form.feedback = ''
  formError.value = null
}

function studentDisplayName(item: unknown) {
  const raw = item as Record<string, unknown> | null
  if (!raw) return 'Student'

  const nestedStudent = raw.student as Record<string, unknown> | undefined
  const firstName = String(raw.first_name ?? nestedStudent?.first_name ?? '').trim()
  const lastName = String(raw.last_name ?? nestedStudent?.last_name ?? '').trim()
  const fullName = `${firstName} ${lastName}`.trim()

  return (
    String(nestedStudent?.name ?? '').trim() ||
    String(raw.student_name ?? '').trim() ||
    String(raw.name ?? '').trim() ||
    fullName ||
    $t_script('common.student')
  )
}

function studentName(evalItem: CompanyEvaluationItem) {
  const directName = studentDisplayName(evalItem)
  if (directName !== $t_script('common.student')) return directName

  const s = students.value.find(
    (student) => student.studentId === evalItem.student_id || student.id === evalItem.student_id,
  )
  return s?.name || 'Student'
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr.slice(0, 10)
  }
}

function scoreBadge(score: number) {
  if (score >= 80) return 'bg-emerald-50 text-emerald-700'
  if (score >= 60) return 'bg-amber-50 text-amber-700'
  return 'bg-rose-50 text-rose-700'
}

onMounted(() => {
  loadStudents()
  loadEvaluations()
})
</script>
