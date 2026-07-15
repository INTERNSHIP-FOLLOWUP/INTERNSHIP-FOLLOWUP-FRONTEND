<!-- src/views/followup/FollowupForm.vue -->
<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <h2 class="text-lg font-semibold mb-4">
        {{ isEdit ? 'Edit Follow-up' : 'New Follow-up' }}
      </h2>

      <ErrorAlert :message="submitError" />

      <form @submit.prevent="submit" class="space-y-3">
        <!-- Student selector -->
        <div>
          <label class="block text-sm mb-1">Student</label>
          <select
            v-model="form.student_id"
            class="border rounded px-3 py-2 w-full"
            :class="{ 'border-red-500': errors.student_id }"
            :disabled="isEdit"
          >
            <option :value="null" disabled>Select a student</option>
            <option disabled>Student list is unavailable right now</option>
          </select>
          <p v-if="errors.student_id" class="text-red-600 text-sm mt-1">{{ errors.student_id }}</p>
        </div>

        <!-- Meeting type -->
        <div>
          <label class="block text-sm mb-1">Meeting Type</label>
          <select
            v-model="form.meeting_type"
            class="border rounded px-3 py-2 w-full"
            :class="{ 'border-red-500': errors.meeting_type }"
          >
            <option value="" disabled>Select meeting type</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Annual">Annual</option>
          </select>
          <p v-if="errors.meeting_type" class="text-red-600 text-sm mt-1">{{ errors.meeting_type }}</p>
        </div>

        <!-- Meeting date -->
        <div>
          <label class="block text-sm mb-1">Meeting Date</label>
          <input
            v-model="form.meeting_date"
            type="date"
            class="border rounded px-3 py-2 w-full"
            :class="{ 'border-red-500': errors.meeting_date }"
          />
          <p v-if="errors.meeting_date" class="text-red-600 text-sm mt-1">{{ errors.meeting_date }}</p>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm mb-1">Notes</label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="border rounded px-3 py-2 w-full"
            :class="{ 'border-red-500': errors.notes }"
          ></textarea>
          <p v-if="errors.notes" class="text-red-600 text-sm mt-1">{{ errors.notes }}</p>
        </div>

        <!-- Action items -->
        <div>
          <label class="block text-sm mb-1">Action Items</label>
          <textarea
            v-model="form.action_items"
            rows="3"
            class="border rounded px-3 py-2 w-full"
          ></textarea>
        </div>

        <!-- Next follow-up date -->
        <div>
          <label class="block text-sm mb-1">Next Follow-up Date</label>
          <input
            v-model="form.next_followup"
            type="date"
            class="border rounded px-3 py-2 w-full"
          />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" @click="$emit('cancelled')" class="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 flex items-center gap-2"
          >
            <Spinner v-if="submitting" />
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
import Spinner from '@/components/ui/LoadingSpinner.vue'
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
  // next_followup must be after meeting_date, if provided
  if (form.next_followup && form.next_followup < form.meeting_date) {
    valid = false
    submitError.value = 'Next follow-up date must be after the meeting date.'
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