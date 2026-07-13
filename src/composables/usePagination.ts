import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function usePagination(fetchFn: (params: { page: number }) => void) {
  const route = useRoute()
  const router = useRouter()

  const currentPage = ref(1)

  function syncPageFromUrl() {
    const page = Number(route.query.page) || 1
    if (page !== currentPage.value) {
      currentPage.value = page
    }
  }

  function setPage(page: number) {
    if (page === currentPage.value) return
    currentPage.value = page
    router.replace({ query: { ...route.query, page: page > 1 ? page : undefined } })
    fetchFn({ page })
  }

  watch(
    () => route.query.page,
    () => {
      syncPageFromUrl()
    },
  )

  onMounted(() => {
    syncPageFromUrl()
    fetchFn({ page: currentPage.value })
  })

  return {
    currentPage,
    setPage,
    resetPage: () => setPage(1),
  }
}
