export function notifySuccess(message: string) {
  // Fallback notification mechanism (no external toast dependency required).
  // If your project has a toast library, wire it here.
  window.alert(message)
}

export function notifyError(message: string) {
  window.alert(message)
}

