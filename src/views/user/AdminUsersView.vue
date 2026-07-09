<template>
  <StudentList @view="handleView" @add="handleAdd" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import StudentList from '@/components/student/StudentList.vue'

const router = useRouter()

function handleView(id: number): void {
  router.push(`/admin/users/${id}`)
}

function handleAdd(): void {
  router.push('/admin/users/create')
}
</script>
