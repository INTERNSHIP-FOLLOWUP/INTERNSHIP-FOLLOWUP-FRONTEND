<template>
  <div class="animate-fade-in">
    <CompanyForm
      :mode="mode"
      :initialData="initialData"
      showCancel
      @cancel="goBack"
      @submit="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CompanyForm from '@/components/company/CompanyForm.vue'
import type { CompanyFormData } from '@/components/company/CompanyForm.vue'
import { useCompanyStore } from '@/stores/company'

const store = useCompanyStore()
const route = useRoute()
const router = useRouter()

const mode = computed(() => (route.params.id ? 'edit' : 'create'))

const initialData = ref<Partial<CompanyFormData>>({
  companyName: '',
  companyEmail: '',
  location: '',
  contactPhone: '',
  website: '',
})

async function loadIfNeeded() {
  if (mode.value !== 'edit') return

  const idRaw = route.params.id
  const id = typeof idRaw === 'string' ? Number(idRaw) : Array.isArray(idRaw) ? Number(idRaw[0]) : NaN
  if (!Number.isFinite(id)) return

  await store.fetchCompanyById(id)
  const c = store.currentCompany
  if (!c) return

  initialData.value = {
    companyName: c.name,
    companyEmail: c.email ?? '',
    location: c.location ?? '',
    // Store currently may not provide industry/contactPerson/phone/website, so default to empty strings.
    // (If your API returns them, we can extend CompanySummary mapping in stores/company.ts.)
    industry: (c as any).industry ?? '',
    contactPerson: (c as any).contactPerson ?? '',
    contactPhone: (c as any).phone ?? (c as any).contactPhone ?? '',
    website: (c as any).website ?? '',
  }

}

onMounted(async () => {
  await loadIfNeeded()
})

function goBack() {
  // Prefer returning to the section the user is currently in.
  const parent = route.matched?.[1]?.name as string | undefined
  const target = parent && parent !== 'CompanyProfile' ? parent : 'AdminCompanies'
  router.push({ name: target }).catch(() => {})
}

async function onSubmit(payload: CompanyFormData) {
  const createPayload = store.mapFromForm(payload)

  try {
    if (mode.value === 'create') {
      await store.createCompany(createPayload)
      await store.fetchCompanies()
      goBack()
      return
    }

    const idRaw = route.params.id
    const id = typeof idRaw === 'string' ? Number(idRaw) : Array.isArray(idRaw) ? Number(idRaw[0]) : NaN
    if (!Number.isFinite(id)) return

    await store.updateCompany(id, createPayload)
    await store.fetchCompanies()
    goBack()
  } catch {
    // store.error will be displayed by parent list view
  }
}
</script>



