<template>
  <transition name="confirm-fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      @click.self="$emit('cancel')"
    >
      <transition name="confirm-scale" appear>
        <div
          ref="dialogRef"
          class="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
          @keydown.escape="$emit('cancel')"
          @keydown.enter="handleKeyEnter"
        >
          <div class="flex items-start gap-4">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
              <svg
                class="h-5.5 w-5.5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 :id="titleId" class="text-base font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h3>
              <p class="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{{ message }}</p>
            </div>
          </div>            <div v-if="error" class="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-400">
            {{ error }}
          </div>

          <div class="mt-6 flex items-center justify-end gap-3">
            <button
              :disabled="loading"
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              @click="$emit('cancel')"
            >
              {{ cancelText }}
            </button>
            <button
              :disabled="loading"
              class="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
              @click="$emit('confirm')"
            >
              <svg v-if="loading" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              {{ confirmText }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

defineProps<{
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  error?: string | null
}>()

defineEmits<{
  confirm: []
  cancel: []
}>()

const titleId = 'confirm-dialog-title'
const dialogRef = ref<HTMLElement | null>(null)

function handleKeyEnter() {
  if (!dialogRef.value?.querySelector('button:disabled')) {
    dialogRef.value?.querySelector<HTMLButtonElement>('button:last-child')?.click()
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

onMounted(async () => {
  await nextTick()
  dialogRef.value?.querySelector<HTMLButtonElement>('button:last-child')?.focus()
  document.addEventListener('keydown', trapFocus)
})

onUnmounted(() => {
  document.removeEventListener('keydown', trapFocus)
})
</script>

<style scoped>
.confirm-fade-enter-active,
.confirm-fade-leave-active {
  transition: opacity 0.2s ease;
}
.confirm-fade-enter-from,
.confirm-fade-leave-to {
  opacity: 0;
}
.confirm-scale-enter-active {
  transition: all 0.2s ease-out;
}
.confirm-scale-leave-active {
  transition: all 0.15s ease-in;
}
.confirm-scale-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(4px);
}
.confirm-scale-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(2px);
}
</style>
