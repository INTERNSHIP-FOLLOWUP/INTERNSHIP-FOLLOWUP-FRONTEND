<template>
  <div class="animate-fade-in">
    <CompanyForm
      :mode="mode"
      :initialData="initialData"
      :apiErrors="apiErrors"
      :onSubmit="onSubmit"
      showCancel
      @cancel="goBack"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CompanyForm from '@/components/company/CompanyForm.vue'
import type { CompanyFormData } from '@/components/company/CompanyForm.vue'
import type { CompanyFormData as StoreCompanyFormData } from '@/stores/company'
import { useCompanyStore } from '@/stores/company'
import { mapValidationErrors } from '@/utils/mapValidationErrors'

const store = useCompanyStore()
const route = useRoute()
const router = useRouter()

const mode = computed(() => (route.params.id ? 'edit' : 'create'))
const apiErrors = ref<Record<string, string>>({})

function getCompanyId(): number {
  const idRaw = route.params.id
  return typeof idRaw === 'string' ? Number(idRaw) : Array.isArray(idRaw) ? Number(idRaw[0]) : NaN
}

const initialData = ref<Partial<CompanyFormData>>({
  companyName: '',
  companyEmail: '',
  location: '',
  contactPhone: '',
  website: '',
  companyProfileImage: '',
  telegramLink: '',
})

async function loadIfNeeded() {
  if (mode.value !== 'edit') return
  const id = getCompanyId()
  if (!Number.isFinite(id)) return

  await store.fetchCompanyById(id)
  const c = store.currentCompany
  if (!c) return

  initialData.value = {
    companyName: c.name,
    companyEmail: c.email ?? '',
    location: c.location ?? '',
    industry: c.industry ?? '',
    contactPerson: c.contactPerson ?? '',
    contactPhone: c.phone ?? '',
    website: c.website ?? '',
    companyProfileImage: c.companyProfileImage ?? '',
    telegramLink: c.telegramLink ?? '',
  }
}

onMounted(async () => {
  await loadIfNeeded()
})

function goBack() {
  router.push({ name: 'AdminCompanies' }).catch(() => {})
}

async function onSubmit(formData: CompanyFormData) {
  const payload = store.mapFromForm(formData as unknown as StoreCompanyFormData)
  apiErrors.value = {}

  try {
    if (mode.value === 'create') {
      await store.createCompany(payload)
    } else {
      const id = getCompanyId()
      if (!Number.isFinite(id)) return
      await store.updateCompany(id, payload)
    }
    await store.fetchCompanies()
    goBack()
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: { status?: number; data?: { errors?: Record<string, string[]> } }
    }
    if (axiosErr.response?.status === 422) {
      apiErrors.value = mapValidationErrors(axiosErr.response.data?.errors)
    } else {
      throw err
    }
  }
}
</script>
