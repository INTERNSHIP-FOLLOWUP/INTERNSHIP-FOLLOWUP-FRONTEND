<template>
  <div>
    <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold text-gray-900">Provide Company Feedback</h1>
          <p class="mt-1 text-sm text-gray-500">
            Leave feedback for tutors about your internship experience.
          </p>
        </div>
      </div>

      <form class="max-w-xl space-y-5" @submit.prevent="submit">
        <label class="block space-y-1">
          <span class="text-sm font-medium text-gray-700"
            >Title <span class="text-rose-500">*</span></span
          >
          <input
            v-model="form.title"
            type="text"
            class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            placeholder="e.g. Overall Experience, Suggestions, etc."
          />
        </label>

        <label class="block space-y-1">
          <span class="text-sm font-medium text-gray-700"
            >Message <span class="text-rose-500">*</span></span
          >
          <textarea
            v-model="form.message"
            rows="6"
            class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            placeholder="Share your feedback for tutors..."
          />
        </label>

        <div v-if="error" class="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
          <p class="text-sm text-rose-600">{{ error }}</p>
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
            type="submit"
            class="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-60"
            :disabled="submitting"
          >
            {{ submitting ? 'Submitting...' : 'Send Feedback' }}
          </button>
        </div>
      </form>

      <div class="mt-10">
        <h2 class="text-sm font-semibold text-gray-900">Recent Feedback</h2>
        <div v-if="loadingFeedback" class="py-8 text-center text-sm text-gray-600">
          Loading feedback...
        </div>
        <div v-else class="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-100">
          <div v-for="item in feedback" :key="item.id" class="px-4 py-4">
            <h3 class="text-sm font-semibold text-gray-900">{{ item.title }}</h3>
            <p class="mt-1 text-sm text-gray-800">{{ item.message }}</p>
            <p class="mt-2 text-xs text-gray-500">{{ item.created_at }}</p>
          </div>
          <div v-if="!feedback.length" class="px-4 py-10 text-center text-sm text-gray-500">
            No feedback yet.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useCompanyStore } from '@/stores/company'
import type { CompanyFeedbackItem, CompanyFeedbackPayload } from '@/types/company'

const store = useCompanyStore()

const form = reactive<CompanyFeedbackPayload>({ title: '', message: '' })
const feedback = ref<CompanyFeedbackItem[]>([])
const submitting = ref(false)
const loadingFeedback = ref(false)
const error = ref<string | null>(null)

function validate(): string | null {
  if (!form.title.trim()) return 'Please enter a title'
  if (!form.message.trim()) return 'Please enter a message'
  return null
}

async function submit() {
  const validationError = validate()
  if (validationError) {
    error.value = validationError
    return
  }

  submitting.value = true
  error.value = null
  try {
    await store.submitFeedback({ title: form.title, message: form.message })
    reset()
    await loadFeedback()
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Failed to submit feedback'
  } finally {
    submitting.value = false
  }
}

function reset() {
  form.title = ''
  form.message = ''
  error.value = null
}

async function loadFeedback() {
  loadingFeedback.value = true
  try {
    const items = await store.fetchFeedback()
    feedback.value = Array.isArray(items) ? items : []
  } finally {
    loadingFeedback.value = false
  }
}

loadFeedback()
</script>
