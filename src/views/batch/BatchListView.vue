<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Batch Management</h1>
      <button
        @click="openCreateModal"
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        + New Batch
      </button>
    </div>

    <div v-if="store.loading" class="flex justify-center py-12">
      <LoadingSpinner />
    </div>

    <div
      v-else-if="store.error"
      class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      {{ store.error }}
    </div>

    <div
      v-else-if="store.batches.length === 0"
      class="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm"
    >
      <p class="text-sm text-gray-500">No batches found. Create your first batch to get started.</p>
    </div>

    <div v-else class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Batch Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Year</th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="batch in store.batches" :key="batch.id" class="hover:bg-gray-50">
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ batch.id }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{{ batch.batch_name || batch.name }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ batch.year }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-right text-sm">
              <button @click="openEditModal(batch)" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
              <button @click="confirmDelete(batch)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      @click.self="closeModal"
    >
      <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ editingBatch ? 'Edit Batch' : 'New Batch' }}
        </h2>
        <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Batch Name</label>
            <input
              v-model="form.batch_name"
              type="text"
              required
              class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Year</label>
            <input
              v-model="form.year"
              type="number"
              required
              class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeModal"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {{ editingBatch ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      @click.self="showDeleteConfirm = false"
    >
      <div class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 class="text-lg font-semibold text-gray-900">Confirm Delete</h2>
        <p class="mt-2 text-sm text-gray-600">
          Are you sure you want to delete <strong>{{ deletingBatch?.batch_name || deletingBatch?.name }}</strong>?
        </p>
        <div class="mt-4 flex justify-end gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useBatchStore } from '@/stores/batchStore'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const store = useBatchStore()

const showModal = ref(false)
const showDeleteConfirm = ref(false)
const editingBatch = ref<Record<string, unknown> | null>(null)
const deletingBatch = ref<Record<string, unknown> | null>(null)

const form = reactive({
  batch_name: '',
  year: new Date().getFullYear().toString(),
})

onMounted(() => {
  store.fetchBatches()
})

function openCreateModal() {
  editingBatch.value = null
  form.batch_name = ''
  form.year = new Date().getFullYear().toString()
  showModal.value = true
}

function openEditModal(batch: Record<string, unknown>) {
  editingBatch.value = batch
  form.batch_name = (batch.batch_name as string) || (batch.name as string) || ''
  form.year = (batch.year as string) || ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingBatch.value = null
}

async function handleSubmit() {
  const payload = { ...form }
  if (editingBatch.value) {
    await store.updateBatch(editingBatch.value.id as number | string, payload)
  } else {
    await store.createBatch(payload)
  }
  closeModal()
}

function confirmDelete(batch: Record<string, unknown>) {
  deletingBatch.value = batch
  showDeleteConfirm.value = true
}

async function handleDelete() {
  if (deletingBatch.value) {
    await store.deleteBatch(deletingBatch.value.id as number | string)
  }
  showDeleteConfirm.value = false
  deletingBatch.value = null
}
</script>
