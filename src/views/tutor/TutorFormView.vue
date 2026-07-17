<template>
  <TutorForm :tutor-id="tutorId" @saved="onSaved" @cancel="onCancel" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TutorForm from '@/components/tutor/TutorForm.vue'

const route = useRoute()
const router = useRouter()

const tutorId = computed(() =>
  route.name === 'AdminTutorsEdit' ? Number(route.params.id) : undefined,
)

async function onSaved(): Promise<void> {
  await router.replace({ name: 'AdminTutors' })
}

function onCancel(): void {
  router.back()
}
</script>
