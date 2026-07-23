import { ref, onMounted } from 'vue'

export function useStaggeredEntrance(
  itemCount: number,
  baseDelay = 50,
  initialActive = false,
) {
  const visible = ref(initialActive)

  function getDelay(index: number): number {
    if (!visible.value) return 9999
    return baseDelay * index
  }

  function getStyle(index: number) {
    return {
      transitionDelay: `${getDelay(index)}ms`,
    }
  }

  function trigger() {
    visible.value = true
  }

  return { visible, trigger, getDelay, getStyle }
}
