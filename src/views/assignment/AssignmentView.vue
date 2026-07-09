<template>
  <AssignmentList @view="handleView" @add="handleAdd" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AssignmentList from '@/components/assignment/AssignmentList.vue'

const router = useRouter()

function handleView(id: number): void {
  router.push(`/admin/assignments/${id}`)
}

function handleAdd(): void {
  router.push('/admin/assignments/create')
}
</script>
