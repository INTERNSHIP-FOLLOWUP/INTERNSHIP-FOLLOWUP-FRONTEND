<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      @click.self="$emit('close')"
    >
      <transition name="scale" appear>
        <div
          ref="dialogRef"
          class="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          @keydown.escape="$emit('close')"
        >
          <div class="flex items-center justify-between mb-5">
            <h3 :id="titleId" class="text-base font-semibold text-slate-900 dark:text-white">
              {{ isEdit ? 'Edit Batch' : 'Create Batch' }}
            </h3>
            <button
              type="button"
              class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              @click="$emit('close')"
              aria-label="Close"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submit" novalidate>
            <div class="space-y-4">
              <div>
                <label for="batch_name" class="block text-xs font-semibold text-slate-600 mb-1.5 dark:text-slate-400">
                  Batch Name
                </label>
                <input
                  id="batch_name"
                  ref="nameInput"
                  v-model="form.batch_name"
                  type="text"
                  placeholder="e.g. Batch 2026-A"
                  maxlength="100"
                  :aria-invalid="!!errors.batch_name"
                  :aria-describedby="errors.batch_name ? 'batch-name-error' : undefined"
                  class="h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
                  :class="inputClass('batch_name')"
                  @input="clearFieldError('batch_name')"
                />
                <p v-if="errors.batch_name" id="batch-name-error" class="mt-1.5 text-xs font-medium text-red-500">
                  {{ errors.batch_name }}
                </p>
              </div>

              <div>
                <label for="year" class="block text-xs font-semibold text-slate-600 mb-1.5 dark:text-slate-400">
                  Year
                </label>
                <input
                  id="year"
                  v-model="form.year"
                  type="text"
                  inputmode="numeric"
                  placeholder="e.g. 2026"
                  maxlength="4"
                  :aria-invalid="!!errors.year"
                  :aria-describedby="errors.year ? 'year-error' : undefined"
                  class="h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
                  :class="inputClass('year')"
                  @input="clearFieldError('year')"
                />
                <p v-if="errors.year" id="year-error" class="mt-1.5 text-xs font-medium text-red-500">
                  {{ errors.year }}
                </p>
              </div>
            </div>

            <p
              v-if="submitError"
              role="alert"
              class="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400"
            >
              {{ submitError }}
            </p>

            <div class="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                :disabled="submitting"
                class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                @click="$emit('close')"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg v-if="submitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {{ submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Batch' }}
              </button>
            </div>
          </form>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { reactive, ref, computed, nextTick, onMounted, watch } from 'vue'
import { useBatchStore } from '@/stores/batchStore'
import { useToastStore } from '@/stores/toast'
import { mapValidationErrors, type ApiFieldErrors } from '@/utils/mapValidationErrors'

interface BatchData {
  id?: number | string
  batch_name?: string
  year?: string | number
}

const props = withDefaults(defineProps<{
  show: boolean
  batch?: BatchData | null
}>(), { batch: null })

const emit = defineEmits<{
  close: []
  saved: []
}>()

const titleId = 'batch-form-title'
const dialogRef = ref<HTMLElement | null>(null)
const nameInput = ref<HTMLInputElement | null>(null)

const batchStore = useBatchStore()
const toast = useToastStore()

const isEdit = computed(() => !!props.batch?.id)

const form = reactive({
  batch_name: '',
  year: '',
})

const errors = reactive<Record<string, string>>({ batch_name: '', year: '' })
const submitting = ref(false)
const submitError = ref('')

watch(() => props.show, (val) => {
  if (val) {
    form.batch_name = props.batch?.batch_name ?? ''
    form.year = String(props.batch?.year ?? new Date().getFullYear())
    errors.batch_name = ''
    errors.year = ''
    submitError.value = ''
    nextTick(() => nameInput.value?.focus())
  }
})

function inputClass(field: string): Record<string, boolean> {
  return {
    'border-slate-200 focus:border-indigo-300 focus:ring-indigo-500/20 dark:border-slate-600': !errors[field],
    'border-red-300 focus:border-red-400 focus:ring-red-500/20 dark:border-red-500': !!errors[field],
  }
}

function clearFieldError(field: string) {
  errors[field] = ''
  submitError.value = ''
}

function validate(): boolean {
  let valid = true
  errors.batch_name = ''
  errors.year = ''

  const name = form.batch_name.trim()
  if (!name) {
    errors.batch_name = 'Batch name is required.'
    valid = false
  } else if (name.length < 2) {
    errors.batch_name = 'Batch name must be at least 2 characters.'
    valid = false
  } else if (name.length > 100) {
    errors.batch_name = 'Batch name must not exceed 100 characters.'
    valid = false
  } else if (!/^[a-zA-Z0-9\s\-_./()]+$/.test(name)) {
    errors.batch_name = 'Batch name contains invalid characters.'
    valid = false
  }

  const year = form.year.trim()
  if (!year) {
    errors.year = 'Year is required.'
    valid = false
  } else if (!/^\d{4}$/.test(year)) {
    errors.year = 'Enter a valid 4-digit year.'
    valid = false
  } else {
    const y = parseInt(year, 10)
    if (y < 2000 || y > 2100) {
      errors.year = 'Year must be between 2000 and 2100.'
      valid = false
    }
  }

  return valid
}

async function submit() {
  if (!validate()) return

  submitting.value = true
  submitError.value = ''

  const payload = {
    batch_name: form.batch_name.trim(),
    year: form.year.trim(),
  }

  try {
    if (isEdit.value) {
      await batchStore.updateBatch(props.batch!.id!, payload)
      toast.success('Batch updated successfully.')
    } else {
      await batchStore.createBatch(payload)
      toast.success('Batch created successfully.')
    }
    emit('saved')
    emit('close')
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string; errors?: ApiFieldErrors } } }
    const serverErrors = mapValidationErrors(axiosErr?.response?.data?.errors)
    if (Object.keys(serverErrors).length > 0) {
      Object.assign(errors, serverErrors)
    } else {
      submitError.value = axiosErr?.response?.data?.message || 'Failed to save batch. Please try again.'
    }
  } finally {
    submitting.value = false
  }
}

function trapFocus(e: KeyboardEvent) {
  if (e.key !== 'Tab' || !dialogRef.value) return
  const focusable = dialogRef.value.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )
  if (focusable.length === 0) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last?.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first?.focus()
  }
}

onMounted(() => {
  document.addEventListener('keydown', trapFocus)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.scale-enter-active {
  transition: all 0.2s ease-out;
}
.scale-leave-active {
  transition: all 0.15s ease-in;
}
.scale-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(4px);
}
.scale-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(2px);
}
</style>
