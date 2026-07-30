<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4">
    <div v-if="!referenceType || !reference" class="text-gray-500 text-sm">
      No related information available.
    </div>

    <!-- Worklog -->
    <div v-else-if="referenceType === 'worklog'" class="space-y-2 text-sm">
      <div class="grid grid-cols-2 gap-2">
        <div>
          <span class="text-gray-500">Student:</span>
          <span class="ml-2 font-medium">{{ reference.student?.name || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Student Code:</span>
          <span class="ml-2">{{ reference.student?.student_code || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Week:</span>
          <span class="ml-2">{{ reference.week_number || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Status:</span>
          <span class="ml-2 capitalize">{{ reference.status || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Submission Date:</span>
          <span class="ml-2">{{ reference.submission_date || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Tutor:</span>
          <span class="ml-2">{{ reference.tutor?.name || 'N/A' }}</span>
        </div>
      </div>
      <div v-if="reference.description">
        <span class="text-gray-500">Description:</span>
        <p class="mt-1 text-gray-700">{{ reference.description }}</p>
      </div>
      <div v-if="reference.challenges">
        <span class="text-gray-500">Challenges:</span>
        <p class="mt-1 text-gray-700">{{ reference.challenges }}</p>
      </div>
      <div v-if="reference.feedback">
        <span class="text-gray-500">Tutor Feedback:</span>
        <p class="mt-1 text-gray-700">{{ reference.feedback }}</p>
      </div>
      <div v-if="reference.id" class="mt-3">
        <a v-if="canViewReference" :href="`/worklogs/${reference.id}`" target="_blank" class="text-blue-600 hover:text-blue-700 text-sm font-medium">View Worklog</a>
      </div>
    </div>

    <!-- Assignment -->
    <div v-else-if="referenceType === 'assignment'" class="space-y-2 text-sm">
      <div class="grid grid-cols-2 gap-2">
        <div>
          <span class="text-gray-500">Student:</span>
          <span class="ml-2 font-medium">{{ reference.student?.name || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Company:</span>
          <span class="ml-2 font-medium">{{ reference.company?.name || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Tutor:</span>
          <span class="ml-2">{{ reference.tutor?.name || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Position:</span>
          <span class="ml-2">{{ reference.position || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Start Date:</span>
          <span class="ml-2">{{ reference.start_date || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">End Date:</span>
          <span class="ml-2">{{ reference.end_date || 'N/A' }}</span>
        </div>
        <div class="col-span-2">
          <span class="text-gray-500">Status:</span>
          <span class="ml-2 capitalize">{{ reference.status || 'N/A' }}</span>
        </div>
      </div>
      <div v-if="reference.id" class="mt-3">
        <a v-if="canViewReference" :href="`/assignments/${reference.id}`" target="_blank" class="text-blue-600 hover:text-blue-700 text-sm font-medium">View Assignment</a>
      </div>
    </div>

    <!-- Issue -->
    <div v-else-if="referenceType === 'issue'" class="space-y-2 text-sm">
      <div class="grid grid-cols-2 gap-2">
        <div class="col-span-2">
          <span class="text-gray-500">Issue #{{ reference.id }}:</span>
          <span class="ml-2 font-medium">{{ reference.title || 'N/A' }}</span>
        </div>
        <div class="col-span-2">
          <span class="text-gray-500">Description:</span>
          <p class="mt-1 text-gray-700">{{ reference.description || 'N/A' }}</p>
        </div>
        <div>
          <span class="text-gray-500">Priority:</span>
          <span class="ml-2 capitalize">{{ reference.priority || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Assigned To:</span>
          <span class="ml-2">{{ reference.assigned_user?.name || 'Unassigned' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Status:</span>
          <span class="ml-2 capitalize">{{ reference.status || 'N/A' }}</span>
        </div>
      </div>
      <div v-if="reference.id" class="mt-3">
        <a v-if="canViewReference" :href="`/issues/${reference.id}`" target="_blank" class="text-blue-600 hover:text-blue-700 text-sm font-medium">View Issue</a>
      </div>
    </div>

    <!-- Evaluation -->
    <div v-else-if="referenceType === 'evaluation'" class="space-y-2 text-sm">
      <div class="grid grid-cols-2 gap-2">
        <div>
          <span class="text-gray-500">Student:</span>
          <span class="ml-2 font-medium">{{ reference.student?.name || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Company:</span>
          <span class="ml-2 font-medium">{{ reference.company?.name || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Technical Skill:</span>
          <span class="ml-2">{{ reference.technical_skill_score ?? reference.score || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Communication:</span>
          <span class="ml-2">{{ reference.communication_score ?? 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Professionalism:</span>
          <span class="ml-2">{{ reference.professionalism_score ?? 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Attendance:</span>
          <span class="ml-2">{{ reference.attendance_score ?? 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Overall Score:</span>
          <span class="ml-2 font-bold">{{ reference.overall_score ?? reference.score || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Status:</span>
          <span class="ml-2 capitalize">{{ reference.status || 'N/A' }}</span>
        </div>
        <div v-if="reference.feedback" class="col-span-2">
          <span class="text-gray-500">Feedback:</span>
          <p class="mt-1 text-gray-700">{{ reference.feedback }}</p>
        </div>
      </div>
      <div v-if="reference.id" class="mt-3">
        <a v-if="canViewReference" :href="`/evaluations/${reference.id}`" target="_blank" class="text-blue-600 hover:text-blue-700 text-sm font-medium">View Evaluation</a>
      </div>
    </div>

    <!-- Follow-up -->
    <div v-else-if="referenceType === 'followup'" class="space-y-2 text-sm">
      <div class="grid grid-cols-2 gap-2">
        <div>
          <span class="text-gray-500">Student:</span>
          <span class="ml-2 font-medium">{{ reference.student?.name || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Tutor:</span>
          <span class="ml-2">{{ reference.tutor?.name || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Meeting Date:</span>
          <span class="ml-2">{{ reference.scheduled_at ? new Date(reference.scheduled_at).toLocaleString() : 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Meeting Type:</span>
          <span class="ml-2">{{ reference.type || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-500">Status:</span>
          <span class="ml-2 capitalize">{{ reference.status || 'N/A' }}</span>
        </div>
        <div v-if="reference.notes" class="col-span-2">
          <span class="text-gray-500">Notes:</span>
          <p class="mt-1 text-gray-700">{{ reference.notes }}</p>
        </div>
        <div v-if="reference.action_items" class="col-span-2">
          <span class="text-gray-500">Action Items:</span>
          <p class="mt-1 text-gray-700">{{ reference.action_items }}</p>
        </div>
      </div>
      <div v-if="reference.id" class="mt-3">
        <a v-if="canViewReference" :href="`/followups/${reference.id}`" target="_blank" class="text-blue-600 hover:text-blue-700 text-sm font-medium">View Follow-up</a>
      </div>
    </div>

    <!-- Message -->
    <div v-else-if="referenceType === 'message'" class="space-y-2 text-sm">
      <div>
        <span class="text-gray-500">Message:</span>
        <p class="mt-1 text-gray-700">{{ reference.message || 'N/A' }}</p>
      </div>
    </div>

    <!-- Generic fallback -->
    <div v-else class="text-sm text-gray-500">
      <pre class="whitespace-pre-wrap">{{ JSON.stringify(reference, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  reference?: Record<string, any>;
  referenceType?: string;
  canViewReference?: boolean;
}>();
</script>
</parameter>
<parameter name="task_progress">- [x] Analyze existing project structure
- [x] Identify gaps in notification system
- [x] Create notification migration files
- [x] Implement notification model, events, listeners, services
- [x] Wire events into existing issue/evaluation/worklog/follow-up/assignment controllers
- [x] Create API routes and controllers for notifications
- [x] Build complete Pinia store with all actions
- [x] Add sorting support to filter component
- [x] Add bulk actions endpoints (mark read/unread, delete)
- [x] Wire bulk actions in NotificationsView
- [x] Fix NotificationList v-model binding
- [x] Integrate ReferenceCard into NotificationDetail
- [x] Fix NotificationEvent (remove broadcast)
- [x] Fix NotificationCard optional chaining
- [x] Fix NotificationList import order
- [x] Register event listener in AppServiceProvider
- [x] Fix is_read boolean conversion bug
- [x] Add sort parameter to controller
- [x] Update migration to match spec
- [x] Update Notification model with scopes and methods
- [x] Update NotificationService with all required methods
- [x] Update NotificationController
- [x] Update frontend types/store
- [x] Update NotificationCard component
- [x] Update NotificationFilter component
- [x] Update ReferenceCard component
- [ ] Update notification views
- [ ] Run migration
- [ ] Verify event wiring
</parameter>
</write_to_file>