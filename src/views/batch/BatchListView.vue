<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Batches</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Manage cohort batches and student enrollment.
        </p>
      </div>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-indigo-600 active:scale-95"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Create Batch
      </button>
    </div>

    <div
      class="rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div v-if="loading" class="flex items-center justify-center py-16">
        <svg class="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
      <div v-else-if="error" class="flex flex-col items-center justify-center py-16 text-center">
        <svg class="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <p class="mt-3 text-sm font-semibold text-red-500">{{ error }}</p>
      </div>
      <div v-else>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left text-sm">
            <thead>
              <tr
                class="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400"
              >
                <th class="px-5 py-3.5">Batch Name</th>
                <th class="px-5 py-3.5">Year</th>
                <th class="px-5 py-3.5">Students</th>
                <th class="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr
                v-for="batch in batches"
                :key="batch.id"
                class="hover:bg-slate-50/30 transition-colors"
              >
                <td class="whitespace-nowrap px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600"
                    >
                      {{ getInitials(batch.batch_name) }}
                    </div>
                    <span class="font-semibold text-slate-900">{{ batch.batch_name }}</span>
                  </div>
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-500">{{ batch.year }}</td>
                <td class="whitespace-nowrap px-5 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                    :class="countClass(batch.students_count)"
                  >
                    <span
                      class="h-1.5 w-1.5 rounded-full"
                      :class="countDotClass(batch.students_count)"
                    />
                    {{ batch.students_count ?? 0 }} student{{
                      batch.students_count === 1 ? '' : 's'
                    }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-right">
                  <button
                    class="rounded-lg px-2.5 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteBatch(batch.id)"
                    class="ml-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-all"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-if="batches.length === 0"
          class="flex flex-col items-center justify-center py-16 text-center"
        >
          <svg
            class="h-10 w-10 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z"
            />
          </svg>
          <p class="mt-3 text-sm font-semibold text-slate-400">No batches created yet.</p>
        </div>
      </div>
    </div>

    <!-- Create Batch Modal -->
    <transition name="fade">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click="showCreateModal = false"
      >
        <div
          class="w-[92%] max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl"
          @click.stop
        >
          <h3 class="text-base font-semibold text-slate-900">Create New Batch</h3>
          <div class="mt-4 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1.5">Batch Name</label>
              <input
                v-model="form.batch_name"
                type="text"
                placeholder="e.g. Batch 2026-A"
                class="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1.5">Year</label>
              <input
                v-model="form.year"
                type="text"
                placeholder="e.g. 2026"
                class="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <div class="mt-6 flex items-center justify-end gap-3">
            <button
              @click="showCreateModal = false"
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              @click="createBatch"
              :disabled="submitting"
              class="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-60"
            >
              {{ submitting ? 'Creating...' : 'Create Batch' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <ConfirmDialog
      :show="dialog.show.value"
      :title="dialog.title.value"
      :message="dialog.message.value"
      :confirm-text="dialog.confirmText.value"
      :cancel-text="dialog.cancelText.value"
      :loading="dialog.loading.value"
      :error="dialog.error.value"
      @confirm="handleConfirm"
      @cancel="dialog.cancel()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { batchService, type Batch } from '@/services/batch'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { useToastStore } from '@/stores/toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const dialog = useConfirmDialog()
const toast = useToastStore()
const batches = ref<Batch[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const showCreateModal = ref(false)
const submitting = ref(false)
const form = reactive({ batch_name: '', year: '' })
let deleteTargetId: number | null = null

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function countClass(count?: number): string {
  if (!count || count === 0) return 'bg-slate-50 text-slate-600'
  if (count <= 5) return 'bg-amber-50 text-amber-700'
  return 'bg-emerald-50 text-emerald-700'
}

function countDotClass(count?: number): string {
  if (!count || count === 0) return 'bg-slate-400'
  if (count <= 5) return 'bg-amber-500'
  return 'bg-emerald-500'
}

async function fetchBatches() {
  loading.value = true
  error.value = null
  try {
    const response = await batchService.list()
    batches.value = response.data
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to load batches.'
  } finally {
    loading.value = false
  }
}

async function createBatch() {
  if (!form.batch_name || !form.year) return
  submitting.value = true
  try {
    await batchService.create({ batch_name: form.batch_name, year: form.year })
    toast.success('Batch created successfully.')
    showCreateModal.value = false
    form.batch_name = ''
    form.year = ''
    await fetchBatches()
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to create batch.'
  } finally {
    submitting.value = false
  }
}

async function deleteBatch(id: number) {
  deleteTargetId = id
  const confirmed = await dialog.open({
    title: 'Delete Batch',
    message: 'Are you sure you want to delete this batch? This action cannot be undone.',
  })
  if (!confirmed) return
  await handleConfirm()
}

async function handleConfirm() {
  if (deleteTargetId === null) return
  await dialog.confirmAsync(async () => {
    await batchService.delete(deleteTargetId!)
    batches.value = batches.value.filter((b) => b.id !== deleteTargetId)
    toast.success('Batch deleted successfully.')
  })
}

onMounted(fetchBatches)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
