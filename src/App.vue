<template>
  <div id="app" class="dark:bg-slate-900 dark:text-slate-100 min-h-screen">
    <router-view />
    <ForceChangePasswordModal />
    <AppToast />
  </div>
</template>

<script lang="ts" setup>
import AppToast from '@/components/ui/AppToast.vue'
import ForceChangePasswordModal from '@/components/auth/ForceChangePasswordModal.vue'
</script>
