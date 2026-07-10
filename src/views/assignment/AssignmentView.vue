<!-- src/views/assignment/AssignmentView.vue -->
<template>
  <AssignmentList v-if="isListMode" @view="handleView" @add="handleAdd" />
  <AssignmentForm
    v-else
    :assignment-id="assignmentId"
    @saved="handleSaved"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AssignmentList from '@/components/assignment/AssignmentList.vue'
import AssignmentForm from '@/components/assignment/AssignmentForm.vue'

const route = useRoute()
const router = useRouter()

const isListMode = computed(() => route.name === 'AdminAssignments')
const assignmentId = computed(() => {
  const id = route.params.id
  return id ? Number(id) : undefined
})

function handleView(id: number): void {
  router.push(`/admin/assignments/${id}`)
}

function handleAdd(): void {
  router.push('/admin/assignments/create')
}

function handleSaved(): void {
  router.push('/admin/assignments')
}

function handleCancel(): void {
  router.push('/admin/assignments')
}
</script>
