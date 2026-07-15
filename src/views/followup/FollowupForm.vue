<!-- src/views/followup/FollowupForm.vue -->
<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
      <h2 class="text-lg font-semibold mb-4 text-slate-900">
        {{ isEdit ? 'Edit Follow-up' : 'New Follow-up' }}
      </h2>

      <ErrorAlert :message="submitError" />

      <form @submit.prevent="submit" class="space-y-4">
        <!-- Student selector -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Student</label>
          <select
            v-model="form.student_id"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            :class="{ 'border-red-400': errors.student_id }"
          >
            <option :value="null" disabled>Student list is unavailable right now</option>
          </select>
          <p v-if="errors.student_id" class="text-red-600 text-xs mt-1">{{ errors.student_id }}</p>
        </div>

        <!-- Meeting type -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Meeting Type</label>
          <select
            v-model="form.meeting_type"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            :class="{ 'border-red-400': errors.meeting_type }"
          >
            <option value="" disabled>Select meeting type</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Annual">Annual</option>
          </select>
          <p v-if="errors.meeting_type" class="text-red-600 text-xs mt-1">{{ errors.meeting_type }}</p>
        </div>

        <!-- Meeting date -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Meeting Date</label>
          <input
            v-model="form.meeting_date"
            type="date"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            :class="{ 'border-red-400': errors.meeting_date }"
          />
          <p v-if="errors.meeting_date" class="text-red-600 text-xs mt-1">{{ errors.meeting_date }}</p>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Notes</label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            :class="{ 'border-red-400': errors.notes }"
          ></textarea>
          <p v-if="errors.notes" class="text-red-600 text-xs mt-1">{{ errors.notes }}</p>
        </div>

        <!-- Action items -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Action Items</label>
          <textarea
            v-model="form.action_items"
            rows="3"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          ></textarea>
        </div>

        <!-- Next follow-up date -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Next Follow-up Date</label>
          <input
            v-model="form.next_followup"
            type="date"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button
            type="button"
            @click="$emit('cancelled')"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95 disabled:opacity-50"
          >
            <svg v-if="submitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ submitting ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useFollowupStore } from '@/stores/followupStore'
import type { Followup, FollowupPayload, MeetingType } from '@/types/followup'
import type { AxiosError } from 'axios'
import ErrorAlert from '@/components/common/ErrorAlert.vue'

const props = defineProps<{ followup: Followup | null }>()
const emit = defineEmits<{ saved: []; cancelled: [] }>()

const followupStore = useFollowupStore()

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
})

const submitting = ref(false)
const submitError = ref<string | null>(null)

function validate(): boolean {
  errors.student_id = ''
  errors.meeting_type = ''
  errors.meeting_date = ''
  errors.notes = ''
  submitError.value = null
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
  }
  if (!form.notes.trim()) {
    errors.notes = 'Notes are required.'
    valid = false
  }
  if (form.next_followup && form.next_followup < form.meeting_date) {
    submitError.value = 'Next follow-up date must be after the meeting date.'
    valid = false
  }

  return valid
}

async function submit(): Promise<void> {
  if (!validate()) return
  submitting.value = true
  submitError.value = null
  try {
    if (isEdit.value && props.followup) {
      await followupStore.updateFollowup(props.followup.id, { ...form })
    } else {
      await followupStore.createFollowup({ ...form })
    }
    emit('saved')
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string }>
    submitError.value = axiosErr.response?.data?.message ?? 'Failed to save follow-up.'
  } finally {
    submitting.value = false
  }
}
</script>
