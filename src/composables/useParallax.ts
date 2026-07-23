import { ref, onMounted, onUnmounted } from 'vue'

export function useParallax(speed = 0.1) {
  const offset = ref(0)
  let ticking = false

  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        offset.value = window.scrollY * speed
        ticking = false
      })
      ticking = true
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return { offset }
}
