<template>
  <div class="animate-fade-in">
    <CompanyForm mode="edit" :initialData="initialData" showCancel />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CompanyForm from '@/components/company/CompanyForm.vue'
import type { CompanyFormData } from '@/components/company/CompanyForm.vue'

// In the app snapshot we don't yet have backend company details.
// This keeps the form reusable for both create and edit.
const initialData = computed<Partial<CompanyFormData>>(() => ({
  // Example values can be filled in once an API is wired.
  companyName: '',
  companyEmail: '',
  location: '',
  contactPhone: '',
  website: '',
}))
</script>


