# Frontend Tutor Module Documentation

## Overview

This document describes the complete frontend implementation for the **Tutor Module** in the Student Internship Follow-up System. The module was built using **Vue 3**, **Pinia**, **Axios**, and **TailwindCSS**, following REST API best practices and SOLID principles.

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Module Structure](#module-structure)
3. [Follow-ups Page](#follow-ups-page)
4. [Issues Page](#issues-page)
5. [Profile Page](#profile-page)
6. [State Management](#state-management)
7. [API Services](#api-services)
8. [Routing](#routing)
9. [Testing Checklist](#testing-checklist)

---

## Technology Stack

- **Vue 3** (Composition API)
- **Vue Router** (Navigation guards, role-based routing)
- **Pinia** (State management)
- **Axios** (HTTP client with interceptors)
- **TailwindCSS** (Utility-first styling)

---

## Module Structure

```
INTERNSHIP-FOLLOWUP-FRONTEND/src/
├── components/
│   └── profile/
│       ├── ProfileCard.vue
│       ├── PersonalInformationForm.vue
│       ├── AvatarUpload.vue
│       ├── ChangePasswordForm.vue
│       └── AccountInformation.vue
├── views/
│   ├── followup/
│   │   ├── FollowupList.vue
│   │   └── FollowupForm.vue
│   ├── issue/
│   │   └── IssueTrackerView.vue
│   └── profile/
│       └── ProfileView.vue
├── stores/
│   ├── followupStore.ts
│   ├── issueStore.ts
│   └── profile.js
└── services/
    ├── api.ts
    ├── issueService.ts
    └── profileService.js
```

---

## Follow-ups Page

### File: `src/views/followup/FollowupList.vue`

**Features:**
- Displays a list of follow-up records for the authenticated tutor
- Search by student name
- Empty state with call-to-action
- Loading spinner during API calls
- Create new follow-up via modal
- Edit existing follow-up
- Delete follow-up with confirmation
- Toast notifications on success/error

**Key Functionalities:**
```javascript
// Search
const search = ref('')
function applySearch() {
  followupStore.search = search.value
  followupStore.fetchFollowups()
}

// Delete
async function deleteFollowup(followup) {
  if (!confirm(`Delete follow-up #${followup.id}?`)) return
  await followupStore.deleteFollowup(followup.id)
  toast.success('Follow-up deleted successfully.', 'Deleted')
}
```

### File: `src/views/followup/FollowupForm.vue`

**Features:**
- Modal dialog for creating/editing follow-ups
- Form validation (student, meeting type, date, notes)
- Next follow-up date validation (must be after meeting date)
- Loading state during submission
- Error handling with `ErrorAlert`

### File: `src/stores/followupStore.ts`

**State:**
```typescript
interface FollowupState {
  followups: Followup[]
  loading: boolean
  error: string | null
  search: string
}
```

**Actions:**
- `fetchFollowups(params)` - Fetches follow-ups with optional filters
- `createFollowup(payload)` - Creates new follow-up
- `updateFollowup(id, payload)` - Updates existing follow-up
- `deleteFollowup(id)` - Soft deletes follow-up

**API Endpoint:**
- `GET /api/followups`
- `POST /api/followups`
- `PUT /api/followups/{id}`
- `DELETE /api/followups/{id}`

---

## Issues Page

### File: `src/views/issue/IssueTrackerView.vue`

**Features:**
- Dashboard-style cards with issue statistics (Total, Open, In Progress, Resolved)
- Search, filter by status, filter by priority
- Grid layout for issue cards
- Create/Update issue modal with form validation
- Detail drawer to view issue history
- Resolve issue action
- Delete issue action
- Status and priority badges with color coding
- Pagination controls
- Loading skeletons
- Empty state

**Key Code:**
```javascript
// Filters
function applyFilters() {
  issueStore.setFilters({
    search: localSearch.value,
    status: localStatus.value,
    priority: localPriority.value,
  })
}

// Dynamic user loading for assignee dropdown
async function loadStudents() {
  const res = await api.get('/tutor/students')
  formUsers.value = res.data.data.map(s => ({ id: s.id, name: s.name, role: 'Student' }))
}
```

### File: `src/stores/issueStore.ts`

**State:**
```typescript
interface IssueState {
  issues: Issue[]
  loading: boolean
  error: string | null
  stats: IssueStats | null
  filters: IssueFilters
  pagination: PaginationMeta
}
```

**Computed:**
- `filteredIssues` - Client-side filtering by search, status, priority
- `paginatedIssues` - Paginated subset for current page
- `statsItems` - Statistics cards data

**Actions:**
- `fetchIssues()` - Loads issues from API
- `fetchIssueStats()` - Loads issue statistics
- `createIssue(payload)` - Creates new issue
- `updateIssue(payload)` - Updates issue
- `assignIssue(id, userId)` - Assigns issue to user
- `resolveIssue(id)` - Resolves issue
- `deleteIssue(id)` - Deletes issue

### File: `src/services/issueService.ts`

**Methods:**
- `getIssues(filters)` - GET /api/issues
- `getIssue(id)` - GET /api/issues/{id}
- `createIssue(payload)` - POST /api/issues
- `updateIssue(id, payload)` - PUT /api/issues/{id}
- `assignIssue(id, userId)` - PATCH /api/issues/{id}/assign
- `resolveIssue(id)` - PATCH /api/issues/{id}/resolve
- `getIssueStats()` - GET /api/issues/stats
- `deleteIssue(id)` - DELETE /api/issues/{id}

---

## Profile Page

### File: `src/views/profile/ProfileView.vue`

**Layout:**
- Loading spinner while fetching profile
- ProfileCard component (avatar, name, email, role, upload/remove buttons)
- PersonalInformationForm component
- AvatarUpload component
- ChangePasswordForm component
- AccountInformation component (read-only)

**Features:**
- Fetches profile on mount
- Triggers hidden file input for avatar upload
- Removes avatar with confirmation

### File: `src/components/profile/ProfileCard.vue`

**Displays:**
- User avatar (with fallback SVG)
- Full name
- Email
- Role badge
- Upload Avatar button
- Remove Avatar button (conditional)

**Emits:**
- `upload-avatar`
- `remove-avatar`

### File: `src/components/profile/PersonalInformationForm.vue`

**Form Fields:**
- Name (required)
- Email (required, validated format)
- Phone (optional)

**Validation:**
- Name must not be empty
- Email must be valid format
- Client-side validation before API call

**Behavior:**
- Pre-fills form when store.profile changes
- Shows loading spinner during submit
- Displays error alerts

### File: `src/components/profile/AvatarUpload.vue`

**Features:**
- Avatar preview
- Hidden file input triggered by button
- Validates file type (image/*)
- Validates file size (max 2MB)
- Uploads via FormData
- Shows success/error toasts

### File: `src/components/profile/ChangePasswordForm.vue`

**Form Fields:**
- Current Password
- New Password
- Confirm New Password

**Features:**
- Password visibility toggle (show/hide) for all three fields
- Client-side validation:
  - All fields required
  - New password min 8 characters
  - Passwords must match
- Submits to `store.changePassword()`

### File: `src/components/profile/AccountInformation.vue`

**Displays read-only account details:**
- User ID
- Role
- Created At

### File: `src/stores/profile.js`

**State:**
```javascript
const profile = ref(null)
const loading = ref(false)
const error = ref(null)
```

**Actions:**
- `getProfile()` - GET /api/profile
- `updateProfile(payload)` - PUT /api/profile
- `uploadAvatar(formData)` - POST /api/profile/avatar
- `removeAvatar()` - DELETE /api/profile/avatar
- `changePassword(payload)` - PUT /api/profile/password

**Toast Integration:**
Every action triggers success/error toasts via `useToastStore()`.

### File: `src/services/profileService.js`

**Axios Service Methods:**
```javascript
export const profileService = {
  async getProfile() { ... }
  async updateProfile(payload) { ... }
  async uploadAvatar(formData) { ... }
  async removeAvatar() { ... }
  async changePassword(payload) { ... }
}
```

---

## State Management

### Store Design

All stores use the **Composition API** style with `defineStore`:

```javascript
export const useProfileStore = defineStore('profile', () => {
  const profile = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // actions...
  return { profile, loading, error, actions }
})
```

### Store Responsibilities

- **FollowupStore**: CRUD + search for follow-ups
- **IssueStore**: CRUD + stats + filtering + pagination for issues
- **ProfileStore**: Profile data + avatar + password management

---

## API Services

### Base Configuration

**File:** `src/services/api.ts`

- Base URL: `import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'`
- Timeout: 15000ms
- Headers: `Content-Type: application/json`, `Accept: application/json`
- Credentials: `withCredentials: true` (for Sanctum session auth)
- Interceptors:
  - Request: Attaches Bearer token from `tokenService`
  - Response: Handles 401 (refresh token), 403 (redirect to /forbidden), 422 (validation toast), 500+ (error toast)

### Service Layer

Each module has a dedicated service file:

- `src/services/issueService.ts` - All issue-related API calls
- `src/services/profileService.js` - All profile-related API calls

Pattern:
```typescript
export const issueService = {
  async getIssues(filters) {
    const { data } = await api.get('/issues', { params: filters })
    return data
  },
  // ...
}
```

---

## Routing

### Tutor Routes

```javascript
{
  path: '/tutor',
  component: () => import('@/layouts/TutorLayout.vue'),
  meta: { roles: ['tutor'] },
  children: [
    { path: '', name: 'TutorDashboard', ... },
    { path: 'students', name: 'TutorStudents', ... },
    { path: 'worklogs', name: 'TutorWorklogs', ... },
    { path: 'followups', name: 'TutorFollowups', ... },
    { path: 'issues', name: 'TutorIssues', ... },
    { path: 'profile', name: 'TutorProfile', ... },
  ]
}
```

### Navigation Guard

```javascript
router.beforeEach(async (to, _from, next) => {
  const store = useAuthStore()
  await ensureBooted()

  // Redirect authenticated users from guest routes
  if (isGuest && store.isLoggedIn) {
    next(getDashboardForRole(store.userRole))
    return
  }

  // Require authentication for protected routes
  if (!PUBLIC_ROUTES.includes(to.fullPath) && !store.isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // Role-based access control
  const requiredRoles = getRouteRoles(to)
  if (requiredRoles.length > 0 && !hasAnyRole(store.userRole, requiredRoles)) {
    next(ROLE_ROUTES[store.userRole] || '/login')
    return
  }

  next()
})
```

---

## UI/UX Patterns

### Loading States

- Spinner for page-level loading
- Skeleton cards for grid loading (issues)
- Button-level loading with spinner icon

### Empty States

- Icon + heading + description + CTA button

### Error Handling

- `ErrorAlert` component displays store errors
- Axios interceptor shows global toasts for 422, 403, 500
- Per-action try/catch with toast feedback

### Toast Notifications

```javascript
toast.success('Profile updated successfully.', 'Profile')
toast.error('Failed to load profile.', 'Load Profile Failed')
```

---

## Backend Integration

### API Contract

All API responses follow this standard format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful.",
  "data": { ... }
}
```

**Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "field": ["error message"]
  }
}
```

### Endpoints Used

| Module | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Profile | GET | /api/profile | Get current user profile |
| Profile | PUT | /api/profile | Update profile info |
| Profile | POST | /api/profile/avatar | Upload avatar |
| Profile | DELETE | /api/profile/avatar | Remove avatar |
| Profile | PUT | /api/profile/password | Change password |
| Issues | GET | /api/issues | List issues (with filters) |
| Issues | POST | /api/issues | Create issue |
| Issues | PUT | /api/issues/{id} | Update issue |
| Issues | DELETE | /api/issues/{id} | Delete issue |
| Issues | PATCH | /api/issues/{id}/resolve | Resolve issue |
| Follow-ups | GET | /api/followups | List follow-ups |
| Follow-ups | POST | /api/followups | Create follow-up |
| Follow-ups | PUT | /api/followups/{id} | Update follow-up |
| Follow-ups | DELETE | /api/followups/{id} | Delete follow-up |

---

## Testing Checklist

### Follow-ups Page
- [ ] Page loads without errors
- [ ] Loading spinner displays while fetching
- [ ] Empty state shows when no follow-ups
- [ ] Search filters follow-ups by student name
- [ ] Create modal opens and submits
- [ ] Edit modal pre-fills data
- [ ] Delete confirmation appears
- [ ] Success toast after create/update/delete
- [ ] Error toast on API failure

### Issues Page
- [ ] Stats cards display correct counts
- [ ] Filter by status works
- [ ] Filter by priority works
- [ ] Search filters by title/description
- [ ] Create issue modal opens
- [ ] Update issue modal pre-fills
- [ ] Assign dropdown populated from API
- [ ] Resolve action works
- [ ] Delete action works
- [ ] Pagination controls work
- [ ] Detail drawer shows history

### Profile Page
- [ ] Profile card shows avatar, name, email, role
- [ ] Upload avatar validates file type/size
- [ ] Upload avatar shows preview
- [ ] Remove avatar works
- [ ] Personal info form validates name/email
- [ ] Save changes updates profile
- [ ] Change password validates current password
- [ ] Change password validates min length
- [ ] Change password validates confirmation match
- [ ] All actions show loading state
- [ ] All actions show success/error toast

---

## Known Limitations

1. **Follow-up Student Selector**: Currently shows placeholder disabled option. Backend supports fetching tutor's students via `/api/tutor/students`; frontend dropdown should be populated from that endpoint in a future enhancement.

2. **Issue Pagination**: Server returns pagination meta, but frontend currently uses client-side pagination via `issueStore`. If dataset grows large, switch to server-side pagination.

3. **Avatar URL**: Assumes `storage/` path prefix. If using S3 or other disk, update `avatarUrl` computed in components.

---

## Deployment Notes

1. Ensure `VITE_API_URL` environment variable is set to the correct backend URL in production.
2. Run `npm run build` to generate production assets.
3. Backend must have `php artisan storage:link` for avatar access.
4. Database migration `2026_07_15_030000_add_phone_to_users_table` adds `phone` column to `users`.

---

## Summary

The Tutor Module frontend is fully functional with:
- **Follow-ups**: search, CRUD, delete
- **Issues**: stats, filters, CRUD, assign, resolve, delete, pagination
- **Profile**: view/update profile, upload/remove avatar, change password

All components use consistent TailwindCSS styling, loading states, error handling, and toast notifications.