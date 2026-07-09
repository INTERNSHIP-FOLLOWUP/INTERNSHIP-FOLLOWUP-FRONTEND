import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type CompanyRepresentativeViewTab =
  | 'internships'
  | 'evaluations'
  | 'students'
  | 'worklogs'
  | 'followups'
  | 'issues'
  | 'profile'

export interface CompanySummary {
  id: number
  name: string
  email?: string
  location?: string
}

export const useCompanyStore = defineStore('company', () => {
  // State
  const companies = ref<CompanySummary[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Current selected company (for potential details screens)
  const currentCompanyId = ref<number | null>(null)

  // Getters
  const currentCompany = computed(() => {
    if (currentCompanyId.value == null) return null
    return companies.value.find((c) => c.id === currentCompanyId.value) ?? null
  })

  // Actions
  async function fetchCompanies(): Promise<void> {
    // Placeholder: endpoints/services are not present in the current repo snapshot.
    // The UI can call this action; later we can wire it to an API service.
    loading.value = true
    error.value = null
    try {
      companies.value = []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load companies'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchCompanyById(id: number): Promise<void> {
    currentCompanyId.value = id
    // Placeholder: wire to API later.
    // For now keep companies list as-is.
  }

  // Optional: reset store
  function reset(): void {
    companies.value = []
    currentCompanyId.value = null
    error.value = null
    loading.value = false
  }

  return {
    companies,
    loading,
    error,
    currentCompanyId,
    currentCompany,
    fetchCompanies,
    fetchCompanyById,
    reset,
  }
})

