import { ref, watch, onUnmounted, type Ref } from 'vue'

function parseNumber(value: string | number): number {
  if (typeof value === 'number') return value
  const cleaned = value.replace(/[^0-9.-]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

export function useAnimatedCounter(
  target: Ref<string | number> | string | number,
  duration = 800,
) {
  const current = ref(0)
  const displayValue = ref('0')
  let rafId: number | null = null
  let startTime: number | null = null
  let previousTarget = 0
  let isAnimating = false
  let lastTargetValue = 0

  function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3)
  }

  function formatNumber(value: number): string {
    return Math.round(value).toLocaleString()
  }

  function animate(to: number) {
    if (rafId) cancelAnimationFrame(rafId)
    if (isAnimating) return

    const from = previousTarget
    previousTarget = to
    lastTargetValue = to
    startTime = null
    isAnimating = true

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)

      const value = from + (to - from) * easedProgress
      current.value = value
      displayValue.value = formatNumber(value)

      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      } else {
        displayValue.value = formatNumber(to)
        current.value = to
        isAnimating = false
      }
    }

    rafId = requestAnimationFrame(step)
  }

  const targetRef = typeof target === 'number' || typeof target === 'string'
    ? ref(target) as Ref<string | number>
    : target

  watch(
    targetRef,
    (newVal) => {
      const num = parseNumber(newVal)
      if (num !== lastTargetValue) {
        animate(num)
      } else if (displayValue.value === '0') {
        displayValue.value = formatNumber(num)
        current.value = num
      }
    },
    { immediate: true },
  )

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId)
  })

  return { current, displayValue }
}
