import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function usePagination(
  fetchFn: (params: { page: number }) => void,
  extraParams?: Record<string, import('vue').Ref<string | undefined>>,
) {
  const route = useRoute()
  const router = useRouter()

  const currentPage = ref(1)

  function buildQuery(): Record<string, string | undefined> {
    const query: Record<string, string | undefined> = { ...route.query }
    query.page = currentPage.value > 1 ? String(currentPage.value) : undefined
    if (extraParams) {
      for (const [key, ref] of Object.entries(extraParams)) {
        query[key] = ref.value || undefined
      }
    }
    return query
  }

  function syncPageFromUrl() {
    const page = Number(route.query.page) || 1
    if (page !== currentPage.value) {
      currentPage.value = page
    }
    if (extraParams) {
      for (const [key, ref] of Object.entries(extraParams)) {
        const urlVal = route.query[key]
        if (typeof urlVal === 'string' && urlVal !== ref.value) {
          ref.value = urlVal
        }
      }
    }
  }

  function setPage(page: number) {
    if (page === currentPage.value) return
    currentPage.value = page
    router.replace({ query: buildQuery() })
    fetchFn({ page })
  }

  watch(
    () => route.query,
    () => {
      syncPageFromUrl()
    },
    { deep: true },
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
