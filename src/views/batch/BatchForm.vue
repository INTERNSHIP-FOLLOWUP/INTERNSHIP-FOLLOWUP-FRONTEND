<!-- src/views/batch/BatchForm.vue -->
<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 class="text-lg font-semibold mb-4">
        {{ isEdit ? 'Edit Batch' : 'Add Batch' }}
      </h2>

      <form @submit.prevent="submit">
        <div class="mb-3">
          <label class="block text-sm mb-1">Batch Name</label>
          <input
            v-model="form.batch_name"
            type="text"
            class="border rounded px-3 py-2 w-full"
            :class="{ 'border-red-500': errors.batch_name }"
          />
          <p v-if="errors.batch_name" class="text-red-600 text-sm mt-1">
            {{ errors.batch_name }}
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-sm mb-1">Year</label>
          <input
            v-model.number="form.year"
            type="number"
            class="border rounded px-3 py-2 w-full"
            :class="{ 'border-red-500': errors.year }"
          />
          <p v-if="errors.year" class="text-red-600 text-sm mt-1">
            {{ errors.year }}
          </p>
        </div>

        <div v-if="submitError" class="text-red-600 text-sm mb-3">
          {{ submitError }}
        </div>

        <div class="flex justify-end gap-2">
          <button type="button" @click="$emit('cancelled')" class="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            {{ submitting ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useBatchStore } from '@/stores/batchStore'

interface BatchProp {
  id?: number | string
  batch_name?: string
  name?: string
  year?: number
  [key: string]: unknown
}

const props = withDefaults(defineProps<{ batch?: BatchProp | null }>(), { batch: null })
const emit = defineEmits<{ saved: []; cancelled: [] }>()

const batchStore = useBatchStore()
const isEdit = computed(() => !!props.batch)

const form = reactive({
  batch_name: props.batch?.batch_name ?? '',
  year: props.batch?.year ?? new Date().getFullYear(),
})

const errors = reactive({ batch_name: '', year: '' })
const submitting = ref(false)
const submitError = ref('')

function validate() {
  errors.batch_name = ''
  errors.year = ''
  let valid = true

  if (!form.batch_name.trim()) {
    errors.batch_name = 'Batch name is required.'
    valid = false
  }
  if (!form.year || form.year < 2000 || form.year > 2100) {
    errors.year = 'Enter a valid year.'
    valid = false
  }
  return valid
}

async function submit() {
  if (!validate()) return
  submitting.value = true
  submitError.value = ''

  try {
    if (isEdit.value) {
      if (!props.batch?.id) throw new Error('Batch ID is missing')
      await batchStore.updateBatch(props.batch.id, { ...form })
    } else {
      await batchStore.createBatch({ ...form })
    }
    emit('saved')
  } catch (err: unknown) {
    submitError.value =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Failed to save batch.'
  } finally {
    submitting.value = false
  }
}
</script>
