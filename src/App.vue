<template>
  <div id="app">
    <router-view />
    <AppToast />
  </div>
</template>

<script lang="ts" setup>
import AppToast from '@/components/ui/AppToast.vue'
</script>
