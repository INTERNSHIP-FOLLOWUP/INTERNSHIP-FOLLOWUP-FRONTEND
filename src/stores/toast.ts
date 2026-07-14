import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  type: ToastType
  message: string
  title?: string
  duration?: number
}

let nextId = 1

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  function add(type: ToastType, message: string, title?: string, duration = 4000) {
    const id = nextId++
    const toast: Toast = { id, type, message, title, duration }
    toasts.value.push(toast)
    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
  }

  function remove(id: number) {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  function success(message: string, title?: string) {
    add('success', message, title)
  }

  function error(message: string, title?: string) {
    add('error', message, title, 6000)
  }

  function warning(message: string, title?: string) {
    add('warning', message, title, 5000)
  }

  function info(message: string, title?: string) {
    add('info', message, title)
  }

  return { toasts, add, remove, success, error, warning, info }
})
