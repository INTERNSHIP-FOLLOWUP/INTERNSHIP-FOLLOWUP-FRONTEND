<template>
  <div class="p-4 sm:p-6 space-y-6">
    <h1 class="text-2xl font-bold tracking-tight text-slate-900">My Profile</h1>

    <div v-if="store.loading" class="flex items-center justify-center py-16">
      <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <template v-else>
      <ProfileCard @upload-avatar="triggerAvatarUpload" @remove-avatar="removeAvatar" />

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PersonalInformationForm />
        <div class="space-y-6">
          <AvatarUpload ref="avatarUploadRef" />
          <ChangePasswordForm />
        </div>
      </div>

      <AccountInformation />
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useProfileStore } from '@/stores/profile'
import ProfileCard from '@/components/profile/ProfileCard.vue'
import PersonalInformationForm from '@/components/profile/PersonalInformationForm.vue'
import AvatarUpload from '@/components/profile/AvatarUpload.vue'
import ChangePasswordForm from '@/components/profile/ChangePasswordForm.vue'
import AccountInformation from '@/components/profile/AccountInformation.vue'

const store = useProfileStore()
const avatarUploadRef = ref(null)

onMounted(() => {
  store.getProfile()
})

function triggerAvatarUpload() {
  avatarUploadRef.value?.$el?.querySelector('input[type="file"]')?.click()
}

async function removeAvatar() {
  await store.removeAvatar()
}
</script>