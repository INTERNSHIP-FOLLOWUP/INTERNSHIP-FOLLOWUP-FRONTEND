# TODO - Tutor Worklog Review Module

## Step 1: Repo understanding
- [x] Inspect existing tutor worklog views, store, service, router.
- [x] Inspect shared components (AttachmentList, WorklogStatusBadge) and types.

## Step 2: Implement backend integration
- [ ] Update `src/services/worklogService.js` to add tutor endpoints:
  - [ ] `getTutorWorklogs(params)` → `GET /api/tutor/worklogs`
  - [ ] `getTutorWorklog(id)` → `GET /api/tutor/worklogs/:id`
  - [ ] `reviewWorklog(id, data)` → `PUT /api/tutor/worklogs/:id`

## Step 3: Store updates (Pinia)
- [ ] Update `src/stores/worklogStore.ts`:
  - [ ] Ensure `reviewWorklog` accepts both `Pending` and `Reviewed`
  - [ ] Ensure payload is passed as selected status + feedback
  - [ ] Fix error handling getter (`store.error`)

## Step 4: Router updates
- [ ] Update `src/router/index.ts` to add/replace tutor routes:
  - [ ] `/tutor/worklogs` → `src/views/tutor/worklog/TutorWorklogList.vue`
  - [ ] `/tutor/worklogs/:id` → `src/views/tutor/worklog/WorklogReview.vue`
  - [ ] Remove/avoid conflicts with existing worklog detail routes for tutor

## Step 5: View updates
- [ ] Update `src/views/tutor/worklog/WorklogReview.vue`:
  - [ ] Allow selecting both statuses
  - [ ] Save using store.reviewWorklog with selected status
  - [ ] Validate feedback required when status becomes `Reviewed`
  - [ ] Load existing feedback/status correctly from backend response shape
  - [ ] Add success/error notifications using existing `notify`/toast utilities

- [ ] Update `src/views/tutor/worklog/TutorWorklogList.vue`:
  - [ ] Replace placeholder student filter with real search + filters
  - [ ] Add search by student name (input)
  - [ ] Filter by status
  - [ ] Ensure only assigned students are shown (via backend API params)
  - [ ] Navigate to review page: `/tutor/worklogs/:id`

## Step 6: Validation
- [ ] Run typecheck/lint/build if available
- [ ] Verify navigation + API calls work end-to-end

