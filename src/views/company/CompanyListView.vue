<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Companies</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Manage partner companies and their details.
        </p>
      </div>
      <button
        @click="openCreateModal"
        class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Add Company
      </button>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <DebouncedInput
        v-model="searchQuery"
        placeholder="Search by name or industry..."
        class="flex-1 max-w-xs"
        clearable
        @change="onSearch"
        @clear="onClearSearch"
      />
      <select
        v-model="industryFilter"
        @change="onFilterChange"
        class="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        <option value="">All Industries</option>
        <option v-for="ind in industries" :key="ind" :value="ind">{{ ind }}</option>
      </select>
    </div>

    <div
      class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div v-if="store.loading" class="flex items-center justify-center py-16">
        <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
      <div
        v-else-if="store.error"
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <svg class="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <p class="mt-3 text-sm font-semibold text-red-500">{{ store.error }}</p>
      </div>

      <!-- Company Cards Grid -->
      <div
        v-else-if="store.companies.length > 0"
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <CompanyCard
          v-for="company in store.companies"
          :key="company.id"
          :company="company"
          @view="openDetailsModal(company.id)"
          @edit="openEditModal(company.id)"
          @delete="deleteCompany(company.id)"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-16 text-center">
        <svg class="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <p class="mt-3 text-sm font-semibold text-slate-400">
          {{
            searchQuery || industryFilter
              ? 'No companies match your filters.'
              : 'No companies registered yet.'
          }}
        </p>
      </div>

      <BasePagination :meta="store.pagination" @page-change="setPage" />
    </div>

    <!-- Company Form Modal -->
    <transition name="fade">
      <div
        v-if="showFormModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm overflow-y-auto"
        @click.self="closeFormModal"
      >
        <div class="my-8 max-h-[90vh] w-full max-w-3xl overflow-y-auto">
          <CompanyForm
            :mode="modalMode"
            :initialData="modalInitialData"
            :apiErrors="modalApiErrors"
            :onSubmit="onCompanySubmit"
            showCancel
            @cancel="closeFormModal"
          />
        </div>
      </div>
    </transition>

    <!-- Company Details Modal -->
    <transition name="fade">
      <div
        v-if="showDetailsModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm overflow-y-auto"
        @click.self="closeDetailsModal"
      >
        <div class="my-8 max-h-[90vh] w-full max-w-3xl overflow-y-auto">
          <CompanyDetailsModal
            :company="viewingCompany"
            :loading="detailsLoading"
            @close="closeDetailsModal"
            @edit="editFromDetails"
          />
        </div>
      </div>
    </transition>

    <ConfirmDialog
      :show="dialog.show.value"
      :title="dialog.title.value"
      :message="dialog.message.value"
      :confirm-text="dialog.confirmText.value"
      :cancel-text="dialog.cancelText.value"
      :loading="dialog.loading.value"
      :error="dialog.error.value"
      @confirm="handleConfirm"
      @cancel="dialog.cancel()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCompanyStore } from '@/stores/company'
import type { CompanyFormData as StoreCompanyFormData } from '@/stores/company'
import { companyService } from '@/services/company'
import type { Company } from '@/types/company'
import { useToastStore } from '@/stores/toast'
import { usePagination } from '@/composables/usePagination'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import CompanyCard from '@/components/company/CompanyCard.vue'
import CompanyForm from '@/components/company/CompanyForm.vue'
import type { CompanyFormData } from '@/components/company/CompanyForm.vue'
import CompanyDetailsModal from '@/components/company/CompanyDetailsModal.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import DebouncedInput from '@/components/ui/DebouncedInput.vue'
import { mapValidationErrors } from '@/utils/mapValidationErrors'
import { parseApiError } from '@/utils/errorParser'


const store = useCompanyStore()
const dialog = useConfirmDialog()
const toast = useToastStore()
const searchQuery = ref('')
const industryFilter = ref('')
let deleteTargetId: number | null = null

const showFormModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const editingCompanyId = ref<number | undefined>(undefined)
const modalApiErrors = ref<Record<string, string>>({})
const emptyFormData: Partial<CompanyFormData> = {
  companyName: '',
  companyEmail: '',
  location: '',
  industry: '',
  website: '',
  companyImage: null,
  telegramLink: '',
}
const modalInitialData = ref<Partial<CompanyFormData>>({ ...emptyFormData })

const showDetailsModal = ref(false)
const viewingCompany = ref<Company | null>(null)
const detailsLoading = ref(false)

const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Manufacturing',
  'Retail',
  'Consulting',
]

function openCreateModal() {
  modalMode.value = 'create'
  editingCompanyId.value = undefined
  modalApiErrors.value = {}
  modalInitialData.value = { ...emptyFormData }
  showFormModal.value = true
}

function openEditModal(id: number) {
  const company = store.companies.find((c) => c.id === id)
  if (!company) return

  modalMode.value = 'edit'
  editingCompanyId.value = id
  modalApiErrors.value = {}
  modalInitialData.value = {
    companyName: company.name,
    companyEmail: company.email ?? '',
    location: company.location ?? '',
    industry: company.industry ?? '',
    website: company.website ?? '',
    companyImage: company.companyImageUrl ?? company.companyImage ?? null,
    telegramLink: company.telegramLink ?? '',
  }
  showFormModal.value = true
}

function closeFormModal() {
  showFormModal.value = false
  editingCompanyId.value = undefined
  modalApiErrors.value = {}
}

async function openDetailsModal(id: number) {
  showDetailsModal.value = true
  detailsLoading.value = true
  viewingCompany.value = null
  try {
    viewingCompany.value = await companyService.get(id)
  } catch {
    toast.error('Failed to load company details.')
    showDetailsModal.value = false
  } finally {
    detailsLoading.value = false
  }
}

function closeDetailsModal() {
  showDetailsModal.value = false
  viewingCompany.value = null
}

function editFromDetails() {
  if (!viewingCompany.value) return
  const id = viewingCompany.value.id
  closeDetailsModal()
  openEditModal(id)
}

async function onCompanySubmit(formData: CompanyFormData) {
  const payload = store.mapFromForm(formData as unknown as StoreCompanyFormData)
  modalApiErrors.value = {}

  try {
    if (modalMode.value === 'create') {
      await store.createCompany(payload)
      toast.success('Company created successfully.')
    } else {
      if (editingCompanyId.value === undefined) return
      await store.updateCompany(editingCompanyId.value, payload)
      toast.success('Company updated successfully.')
    }
    await store.fetchCompanies({
      search: searchQuery.value || undefined,
      industry: industryFilter.value || undefined,
    })
    closeFormModal()
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: { status?: number; data?: { errors?: Record<string, string[]> } }
    }
    if (axiosErr.response?.status === 422) {
      modalApiErrors.value = mapValidationErrors(axiosErr.response.data?.errors)
      toast.error('Please fix the highlighted errors.', 'Validation Error')
    } else if (axiosErr.response?.status && axiosErr.response.status >= 500) {
      const parsed = parseApiError(err)
      toast.error(parsed.message, 'Server Error')
      throw new Error(parsed.message)
    } else {
      toast.error('Failed to save. Please try again.', 'Error')
      throw err
    }
  }
}

function fetchPage({ page }: { page: number }) {
  store.fetchCompanies({
    page,
    search: searchQuery.value || undefined,
    industry: industryFilter.value || undefined,
  })
}

const { setPage, resetPage } = usePagination(fetchPage, {
  search: searchQuery,
  industry: industryFilter,
})

function onSearch() {
  resetPage()
}

function onFilterChange() {
  resetPage()
}

function onClearSearch() {
  searchQuery.value = ''
  resetPage()
}

async function deleteCompany(id: number) {
  deleteTargetId = id
  const confirmed = await dialog.open({
    title: 'Delete Company',
    message: 'Are you sure you want to delete this company? This action cannot be undone.',
  })
  if (!confirmed) return
  await handleConfirm()
}

async function handleConfirm() {
  if (deleteTargetId === null) return
  await dialog.confirmAsync(async () => {
    await store.deleteCompany(deleteTargetId!)
    toast.success('Company deleted successfully.')
  })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
