<!-- src/components/followup/FollowupForm.vue -->
<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
      <h2 class="text-lg font-semibold mb-4">
        {{ isEdit ? 'Edit Follow-up' : 'New Follow-up' }}
      </h2>

      <div
        v-if="formError"
        role="alert"
        aria-live="polite"
        class="mb-4 rounded-lg border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm font-medium text-rose-700"
      >
        {{ formError }}
      </div>

      <form @submit.prevent="submit" class="space-y-4" novalidate>
        <!-- Student selector -->
        <div class="space-y-1.5">
          <label for="student_id" class="block text-sm font-medium text-slate-700">
            Student <span class="text-error">*</span>
          </label>
          <select
            id="student_id"
            v-model.number="form.student_id"
            :disabled="isEdit"
            class="block w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-200"
            :class="errors.student_id ? 'border-error' : 'border-slate-200'"
            @change="clearFieldError('student_id')"
          >
            <option :value="null" disabled>Select a student</option>
            <option v-for="student in studentStore.students" :key="student.id" :value="student.id">
              {{ student.name }}
            </option>
          </select>
          <p v-if="errors.student_id" class="text-sm text-error">{{ errors.student_id }}</p>
        </div>

        <!-- Meeting type -->
        <div class="space-y-1.5">
          <label for="meeting_type" class="block text-sm font-medium text-slate-700">
            Meeting Type <span class="text-error">*</span>
          </label>
          <select
            id="meeting_type"
            v-model="form.meeting_type"
            class="block w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-200"
            :class="errors.meeting_type ? 'border-error' : 'border-slate-200'"
            @change="clearFieldError('meeting_type')"
          >
            <option value="" disabled>Select meeting type</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Annual">Annual</option>
          </select>
          <p v-if="errors.meeting_type" class="text-sm text-error">{{ errors.meeting_type }}</p>
        </div>

        <!-- Meeting date -->
        <div class="space-y-1.5">
          <label for="meeting_date" class="block text-sm font-medium text-slate-700">
            Meeting Date <span class="text-error">*</span>
          </label>
          <input
            id="meeting_date"
            v-model="form.meeting_date"
            type="date"
            class="block w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-200"
            :class="errors.meeting_date ? 'border-error' : 'border-slate-200'"
            @change="clearFieldError('meeting_date')"
          />
          <p v-if="errors.meeting_date" class="text-sm text-error">{{ errors.meeting_date }}</p>
        </div>

        <!-- Notes -->
        <div class="space-y-1.5">
          <label for="notes" class="block text-sm font-medium text-slate-700">
            Notes <span class="text-error">*</span>
          </label>
          <textarea
            id="notes"
            v-model="form.notes"
            rows="4"
            class="block w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-200"
            :class="errors.notes ? 'border-error' : 'border-slate-200'"
            placeholder="Meeting notes..."
            @input="clearFieldError('notes')"
          />
          <p v-if="errors.notes" class="text-sm text-error">{{ errors.notes }}</p>
        </div>

        <!-- Action items -->
        <div class="space-y-1.5">
          <label for="action_items" class="block text-sm font-medium text-slate-700">
            Action Items
          </label>
          <textarea
            id="action_items"
            v-model="form.action_items"
            rows="3"
            class="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-200"
            placeholder="Action items..."
          />
        </div>

        <!-- Next follow-up date -->
        <div class="space-y-1.5">
          <label for="next_followup" class="block text-sm font-medium text-slate-700">
            Next Follow-up Date
          </label>
          <input
            id="next_followup"
            v-model="form.next_followup"
            type="date"
            class="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-200"
          />
          <p v-if="errors.next_followup" class="text-sm text-error">{{ errors.next_followup }}</p>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            @click="$emit('cancelled')"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:from-primary-700 hover:to-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg v-if="submitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {{ submitting ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useFollowupStore } from '@/stores/followupStore'
import { useStudentStore } from '@/stores/student'
import type { Followup, FollowupPayload, MeetingType } from '@/types/followup'

const props = withDefaults(
  defineProps<{
    followup?: Followup | null
  }>(),
  { followup: null },
)
const emit = defineEmits<{
  saved: []
  cancelled: []
}>()

const followupStore = useFollowupStore()
const studentStore = useStudentStore()

const isEdit = computed(() => !!props.followup)

const form = reactive<FollowupPayload>({
  student_id: props.followup?.student_id ?? (null as unknown as number),
  meeting_type: props.followup?.meeting_type ?? ('' as MeetingType),
  meeting_date: props.followup?.meeting_date ?? '',
  notes: props.followup?.notes ?? '',
  action_items: props.followup?.action_items ?? '',
  next_followup: props.followup?.next_followup ?? null,
})

const errors = reactive({
  student_id: '',
  meeting_type: '',
  meeting_date: '',
  notes: '',
  next_followup: '',
})

const submitting = ref(false)
const formError = ref('')

function clearFieldError(field: keyof typeof errors): void {
  errors[field] = ''
  formError.value = ''
}

function validate(): boolean {
  errors.student_id = ''
  errors.meeting_type = ''
  errors.meeting_date = ''
  errors.notes = ''
  errors.next_followup = ''
  formError.value = ''
  let valid = true

  if (!form.student_id) {
    errors.student_id = 'Please select a student.'
    valid = false
  }
  if (!form.meeting_type) {
    errors.meeting_type = 'Please select a meeting type.'
    valid = false
  }
  if (!form.meeting_date) {
    errors.meeting_date = 'Meeting date is required.'
    valid = false
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.meeting_date)) {
    errors.meeting_date = 'Please enter a valid date.'
    valid = false
  }
  if (!form.notes.trim()) {
    errors.notes = 'Notes are required.'
    valid = false
  }
  if (form.next_followup && form.meeting_date && form.next_followup < form.meeting_date) {
    errors.next_followup = 'Next follow-up date must be after the meeting date.'
    valid = false
  }

  return valid
}

async function submit(): Promise<void> {
  if (!validate()) return
  submitting.value = true
  formError.value = ''

  try {
    if (isEdit.value && props.followup) {
      await followupStore.updateFollowup(props.followup.id, { ...form })
    } else {
      await followupStore.createFollowup({ ...form })
    }
    emit('saved')
  } catch (err: unknown) {
    formError.value =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Failed to save follow-up.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (studentStore.students.length === 0) {
    studentStore.fetchStudents().catch(() => {
      // parent list shows student fetch error
    })
  }
})
</script>
