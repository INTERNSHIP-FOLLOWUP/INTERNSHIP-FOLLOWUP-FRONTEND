import { ref } from 'vue'

export function useConfirmDialog() {
  const show = ref(false)
  const title = ref('')
  const message = ref('')
  const confirmText = ref('Delete')
  const cancelText = ref('Cancel')
  const loading = ref(false)
  const error = ref<string | null>(null)

  let resolvePromise: ((value: boolean) => void) | null = null

  function open(opts: {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
  }): Promise<boolean> {
    title.value = opts.title
    message.value = opts.message
    confirmText.value = opts.confirmText ?? 'Delete'
    cancelText.value = opts.cancelText ?? 'Cancel'
    loading.value = false
    error.value = null
    show.value = true

    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  function confirm() {
    resolvePromise?.(true)
    resolvePromise = null
  }

  function cancel() {
    resolvePromise?.(false)
    resolvePromise = null
    show.value = false
  }

  async function confirmAsync(fn: () => Promise<void>): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await fn()
      show.value = false
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred.'
    } finally {
      loading.value = false
    }
  }

  return {
    show,
    title,
    message,
    confirmText,
    cancelText,
    loading,
    error,
    open,
    confirm,
    cancel,
    confirmAsync,
  }
}
