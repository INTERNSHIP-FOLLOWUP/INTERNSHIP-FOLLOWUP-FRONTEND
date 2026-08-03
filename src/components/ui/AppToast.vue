<template>
  <div
    class="pointer-events-none fixed inset-0 z-[100] flex flex-col items-end gap-3 p-4 sm:p-6"
    aria-live="polite"
    aria-atomic="false"
  >
    <transition-group name="toast" tag="div" class="flex w-full max-w-sm flex-col gap-3">
      <div
        v-for="toast in store.toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-800"
        :class="borderClass(toast.type)"
        role="alert"
      >
        <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
          <component :is="iconComponent(toast.type)" />
        </span>
        <div class="min-w-0 flex-1">
          <p v-if="toast.title" class="text-sm font-bold text-slate-900 dark:text-slate-100">{{ toast.title }}</p>
          <p class="text-sm" :class="toast.title ? 'mt-0.5 text-slate-600 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300'">
            {{ toast.message }}
          </p>
        </div>
        <button
          @click="store.remove(toast.id)"
          class="-mr-1 -mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          aria-label="Dismiss notification"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { h, defineComponent } from 'vue'
import { useToastStore, type ToastType } from '@/stores/toast'

const store = useToastStore()

function borderClass(type: ToastType): string {
  switch (type) {
    case 'success':
      return 'border-l-4 border-l-emerald-500'
    case 'error':
      return 'border-l-4 border-l-red-500'
    case 'warning':
      return 'border-l-4 border-l-amber-500'
    case 'info':
      return 'border-l-4 border-l-blue-500'
  }
}

function createIcon(d: string, color: string) {
  return defineComponent({
    setup() {
      return () =>
        h(
          'svg',
          { class: `h-5 w-5 ${color}`, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
          [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              'stroke-width': 2,
              d,
            }),
          ],
        )
    },
  })
}

function iconComponent(type: ToastType) {
  switch (type) {
    case 'success':
      return createIcon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', 'text-emerald-500')
    case 'error':
      return createIcon(
        'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
        'text-red-500',
      )
    case 'warning':
      return createIcon('M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 'text-amber-500')
    case 'info':
      return createIcon(
        'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        'text-blue-500',
      )
  }
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}
.toast-move {
  transition: transform 0.2s ease;
}
</style>
