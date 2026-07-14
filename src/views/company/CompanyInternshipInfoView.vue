<template>
  <div>
    <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold text-gray-900">Internship Information</h1>
          <p class="mt-1 text-sm text-gray-500">Program and batch information for your company.</p>
        </div>
      </div>

      <div class="max-w-xl space-y-5">
        <label class="block space-y-1">
          <span class="text-sm font-medium text-gray-700">Program Name</span>
          <input
            v-model="form.programName"
            type="text"
            class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            placeholder="e.g. Summer Internship"
          />
        </label>

        <label class="block space-y-1">
          <span class="text-sm font-medium text-gray-700">Batch</span>
          <input
            v-model="form.batch"
            type="text"
            class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            placeholder="e.g. Batch 2025/1"
          />
        </label>

        <label class="block space-y-1">
          <span class="text-sm font-medium text-gray-700">Assigned Tutor</span>
          <input
            v-model="form.tutor"
            type="text"
            class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            placeholder="Tutor name"
          />
        </label>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label class="block space-y-1">
            <span class="text-sm font-medium text-gray-700">Start Date</span>
            <input
              v-model="form.startDate"
              type="date"
              class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </label>

          <label class="block space-y-1">
            <span class="text-sm font-medium text-gray-700">End Date</span>
            <input
              v-model="form.endDate"
              type="date"
              class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </label>
        </div>

        <div class="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            class="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            @click="reset"
          >
            Reset
          </button>
          <button
            type="button"
            class="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-60"
            :disabled="saving"
            @click="save"
          >
            {{ saving ? 'Saving...' : 'Save Information' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'


const form = reactive({
  programName: '',
  batch: '',
  tutor: '',
  startDate: '',
  endDate: '',
})
const saving = ref(false)

async function save() {
  saving.value = true
  await new Promise((resolve) => setTimeout(resolve, 400))
  saving.value = false
}

function reset() {
  form.programName = ''
  form.batch = ''
  form.tutor = ''
  form.startDate = ''
  form.endDate = ''
}
</script>
