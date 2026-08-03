<template>
    <!-- Company Messages -->
    <div v-if="activeTab === 'company'" class="dark:bg-slate-900 dark:text-slate-100">
      <MessageView />
    </div>

    <!-- Student Messages -->
    <div v-if="activeTab === 'students'" class="dark:bg-slate-900 dark:text-slate-100">
      <TutorStudentMessageView />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MessageView from '@/views/company/MessageView.vue'
import TutorStudentMessageView from '@/views/tutor/TutorStudentMessageView.vue'

const route = useRoute()
const router = useRouter()

const activeTab = ref<'company' | 'students'>(
  (route.query.type as 'company' | 'students') || 'company'
)

watch(
  () => route.query.type,
  (type) => {
    if (type === 'company' || type === 'students') {
      activeTab.value = type
    } else if (!type) {
      activeTab.value = 'company'
    }
  }
)

watch(activeTab, (tab) => {
  router.replace({ query: { type: tab } })
})
</script>
