<template>
  <div class="space-y-6">
    <AssignmentList
      @add="openCreate"
      @view="openEdit"
    />
    <AssignmentForm
      v-if="showForm"
      :assignment-id="editingId ?? undefined"
      @saved="onSaved"
      @cancel="closeForm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAssignmentStore } from '@/stores/assignment'
import AssignmentList from '@/components/assignment/AssignmentList.vue'
import AssignmentForm from '@/components/assignment/AssignmentForm.vue'

const store = useAssignmentStore()
const showForm = ref(false)
const editingId = ref<number | null>(null)

function openCreate() {
  editingId.value = null
  showForm.value = true
}

function openEdit(id: number) {
  editingId.value = id
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingId.value = null
}

function onSaved() {
  closeForm()
  store.fetchAssignments({ per_page: 15 }).catch(() => {})
}
</script>
