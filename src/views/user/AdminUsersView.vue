<template>
  <StudentForm
    v-if="showForm"
    :student-id="studentId"
    @saved="goToList"
    @cancel="goToList"
  />
  <StudentList v-else @view="handleView" @add="handleAdd" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StudentList from '@/components/student/StudentList.vue'
import StudentForm from '@/components/student/StudentForm.vue'

const route = useRoute()
const router = useRouter()

const showForm = computed(() => route.name === 'AdminUsersCreate' || route.name === 'AdminUsersEdit')
const studentId = computed(() => (route.name === 'AdminUsersEdit' ? Number(route.params.id) : undefined))

function handleView(id: number): void {
  router.push({ name: 'AdminUsersEdit', params: { id } })
}

function handleAdd(): void {
  router.push({ name: 'AdminUsersCreate' })
}

function goToList(): void {
  router.push({ name: 'AdminUsers' })
}
</script>
