# Tutor Backend API Requirements
## Student Internship Follow-up System

> **Date:** 2024
> **Source:** Frontend codebase analysis — Tutor-specific services, stores, views, and types
> **Purpose:** This document lists all backend API endpoints the Tutor module requires, ordered by priority.

---

## Table of Contents

1. [Tutor Dashboard](#1-tutor-dashboard)
2. [Tutor Students Management](#2-tutor-students-management)
3. [Tutor Worklogs Review](#3-tutor-worklogs-review)
4. [Tutor Follow-ups](#4-tutor-follow-ups)
5. [Issues (Tutor-scoped)](#5-issues-tutor-scoped)
6. [Supporting Data Endpoints](#6-supporting-data-endpoints)
7. [Database Tables Required](#7-database-tables-required)
8. [Key Technical Notes](#8-key-technical-notes)

---

## 1. Tutor Dashboard

**Base path:** `/api/tutor`

### Source files
- `src/services/tutorDashboard.ts` — `tutorDashboardService.getDashboard()`
- `src/stores/tutorDashboard.ts` — `useTutorDashboardStore`
- `src/views/dashboard/TutorDashboardView.vue`
- `src/types/tutor.ts`, `src/types/tutorDashboard.ts`

### Endpoints

| Priority | Method | Endpoint | Purpose | Expected Returns |
|----------|--------|----------|---------|-----------------|
| 🔴 HIGH | GET | `/api/tutor/dashboard` | Fetch full dashboard data | `DashboardResponse` (see below) |

### Expected Response Shape

```json
{
  "success": true,
  "data": {
    "stats": {
      "assigned_students": 0,
      "pending_reviews": 0,
      "followups_due": 0,
      "open_issues": 0,
      "inactive_students": 0
    },
    "recent_worklogs": [
      {
        "id": 1,
        "week_number": 1,
        "status": "Submitted",
        "submission_date": "2024-01-15T10:00:00Z",
        "submitted_at": "2024-01-15T10:00:00Z",
        "description": "Worked on backend API",
        "student": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "012345678"
        }
      }
    ],
    "upcoming_followups": [
      {
        "id": 1,
        "scheduled_at": "2024-01-20T14:00:00Z",
        "date_label": "2024-01-20",
        "time_label": "2:00 PM",
        "relative": "in 3 days",
        "type": "Online",
        "notes": "Discuss progress",
        "status": "Scheduled",
        "student": {
          "id": 1,
          "name": "John Doe",
          "phone": "012345678"
        }
      }
    ],
    "open_issues": [
      {
        "id": 1,
        "title": "Database connection issue",
        "status": "Open",
        "priority": "High",
        "created_at": "2024-01-10T08:00:00Z",
        "student": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ],
    "recent_activity": [
      {
        "type": "worklog",
        "icon": "worklog",
        "message": "John Doe submitted Week 3 worklog",
        "timestamp": "2024-01-15T10:00:00Z",
        "reference_id": 5
      }
    ]
  }
}
```

### View Screens
The dashboard displays **5 StatCards** and **4 Panels**:

**StatCards:**
| Stat | Key in `stats` object |
|------|-----------------------|
| Assigned Students | `assigned_students` |
| Pending Reviews | `pending_reviews` |
| Follow-ups Due | `followups_due` |
| Open Issues | `open_issues` |
| Inactive Students | `inactive_students` |

**Panels:**
1. **Recent Worklogs** — shows cards with student name, week number, status badge, date
2. **Upcoming Follow-ups** — shows cards with date block, student name, meeting type, relative time
3. **Open Issues** — shows cards with issue title, student name, priority badge
4. **Recent Activity** — shows timeline with icon, message, relative timestamp

---

## 2. Tutor Students Management

**Base path:** `/api/tutor`

### Source files
- `src/services/tutorDashboard.ts` — `tutorStudentService`
- `src/stores/tutorStudent.ts` — `useTutorStudentStore`
- `src/views/tutor/TutorStudentListView.vue`
- `src/views/tutor/TutorStudentDetailView.vue`
- `src/types/tutorStudent.ts`

### Endpoints

| Priority | Method | Endpoint | Purpose | Filters/Params |
|----------|--------|----------|---------|----------------|
| 🔴 HIGH | GET | `/api/tutor/students` | List tutor's assigned students | `search`, `status`, `batch_id`, `has_open_issue`, `page`, `per_page` |
| 🔴 HIGH | GET | `/api/tutor/students/{id}` | Get detailed student info + nested data | — |
| 🔴 HIGH | PUT | `/api/tutor/students/{id}/status` | Update student's assignment status | Body: `{ "status": "Assigned|In Progress|Completed|Terminated" }` |

### Expected List Response Shape

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "student_code": "STU-001",
      "gender": "Male",
      "phone": "012345678",
      "batch": {
        "id": 1,
        "batch_name": "Batch 2024-A",
        "name": "Batch 2024-A",
        "year": 2024
      },
      "tutor": {
        "id": 1,
        "name": "Tutor Smith"
      },
      "status": "active",
      "photo": "http://example.com/photo.jpg",
      "assignment_status": "In Progress",
      "company_name": "Tech Corp",
      "position": "Backend Developer",
      "last_worklog_at": "2024-01-15T10:00:00Z",
      "feedback_given": true,
      "open_issues_count": 2,
      "next_followup": {
        "id": 1,
        "scheduled_at": "2024-01-20T14:00:00Z",
        "date_label": "Jan 20",
        "time_label": "2:00 PM",
        "type": "Online",
        "status": "Scheduled"
      },
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "total": 10,
    "per_page": 15,
    "current_page": 1,
    "last_page": 1,
    "from": 1,
    "to": 10
  }
}
```

### Expected Detail Response Shape

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "student_code": "STU-001",
    "phone": "012345678",
    "batch": { "id": 1, "batch_name": "Batch 2024-A" },
    "tutor": { "id": 1, "name": "Tutor Smith" },
    "status": "active",
    "assignment_status": "In Progress",
    "company_name": "Tech Corp",
    "position": "Backend Developer",
    "last_worklog_at": "2024-01-15T10:00:00Z",
    "open_issues_count": 2,
    "next_followup": { "id": 1, "scheduled_at": "2024-01-20T14:00:00Z", "date_label": "Jan 20", "time_label": "2:00 PM", "type": "Online", "status": "Scheduled" },
    "worklogs": [
      {
        "id": 1,
        "week_number": 1,
        "status": "Approved",
        "submitted_at": "2024-01-15T10:00:00Z",
        "created_at": "2024-01-15T10:00:00Z",
        "description": "Built API endpoints",
        "challenges": "Database optimization"
      }
    ],
    "issues": [
      {
        "id": 1,
        "title": "Database connection issue",
        "status": "Open",
        "priority": "High",
        "created_at": "2024-01-10T08:00:00Z"
      }
    ],
    "evaluations": []
  }
}
```

### Expected Status Update Response

```json
{
  "success": true,
  "message": "Student status updated.",
  "data": {
    "student_id": 1,
    "status": "In Progress",
    "company_id": 1,
    "student": { "... full student object ..." }
  }
}
```

### View Details
**TutorStudentDetailView.vue** shows tabs:
- **Overview** — Internship status (with dropdown to change), Student info card, Internship info card
- **Worklogs** — (placeholder, to be lazy-loaded)
- **Follow-ups** — (placeholder, to be lazy-loaded)
- **Issues** — (placeholder, to be lazy-loaded)

The **status update** selects from: `Assigned`, `In Progress`, `Completed`, `Terminated`.

---

## 3. Tutor Worklogs Review

**Base path:** `/api/tutor`

### Source files
- `src/services/tutorDashboard.ts` — `tutorWorklogService`
- `src/services/worklogService.ts` — `worklogService.getTutorWorklogs()`, `getTutorWorklog()`, `reviewWorklog()`
- `src/stores/tutorWorklog.ts` — `useTutorWorklogStore`
- `src/stores/worklogStore.ts` — `useWorklogStore`
- `src/views/tutor/worklog/TutorWorklogList.vue`
- `src/views/tutor/worklog/TutorWorklogList.vue` (in `src/views/tutor/`)
- `src/types/tutorWorklogs.ts`, `src/types/tutorWorklog.ts`, `src/types/worklog.ts`

### Endpoints

| Priority | Method | Endpoint | Purpose | Params/Body |
|----------|--------|----------|---------|-------------|
| 🔴 HIGH | GET | `/api/tutor/worklogs` | List worklogs from tutor's students | `student_id`, `week`, `status`, `page`, `per_page` |
| 🔴 HIGH | GET | `/api/tutor/worklogs/{id}` | Get single worklog detail | — |
| 🔴 HIGH | POST | `/api/tutor/worklogs/{id}` | Review/submit feedback on worklog | `{ "status": "Approved|Rejected|Reviewed", "feedback": "string" }` |

### Filters for List Endpoint

| Parameter | Type | Description |
|-----------|------|-------------|
| `student_id` | integer | Filter by specific student |
| `week` | integer | Filter by week number (1-52) |
| `status` | string | `"Submitted"`, `"Approved"`, `"Rejected"` |
| `page` | integer | Page number |
| `per_page` | integer | Items per page (default: 15) |

### Expected Worklog Response Shape

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "student_id": 1,
      "week_number": 3,
      "description": "Implemented user authentication module",
      "challenges": "Token refresh logic was tricky",
      "status": "Submitted",
      "submitted_at": "2024-01-15T10:00:00Z",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z",
      "submission_date": "2024-01-15",
      "can_edit": false,
      "student": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "012345678"
      },
      "tutor_review": {
        "id": 1,
        "feedback": "Good work, please add more details",
        "status": "Reviewed",
        "reviewed_at": "2024-01-16T10:00:00Z"
      },
      "attachments": [
        {
          "id": 1,
          "filename": "report.pdf",
          "file_type": "application/pdf",
          "url": "http://example.com/storage/report.pdf"
        }
      ]
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "last_page": 3,
      "per_page": 15,
      "total": 35
    }
  }
}
```

### Review Possible Status Values

| Status | Meaning |
|--------|---------|
| `"Reviewed"` | Request revision (needs changes) |
| `"Approved"` | Accept the worklog |
| `"Rejected"` | Reject the worklog |

### Worklog Status Lifecycle

```
Draft → Submitted → Reviewed → Approved
                   → Rejected
```

The frontend displays these statuses:
- **Pending/Submitted** — awaiting review
- **Reviewed** — tutor requested changes
- **Approved** — accepted
- **Rejected** — denied

### View Screens
**TutorWorklogList.vue** (both versions) shows:
- **4 StatCards** — Total Worklogs, Pending Review count, Approved count, Needs Revision count
- **Filters** — Student name search, Status dropdown, Week dropdown
- **Worklog Cards** — Student avatar/initials, name, week number, status badge, description, challenges, attachments count
- **Actions** — "View Details" button, "Approve" quick action
- **Detail Modal** — Student info, worklog info (week, date, status, description, challenges, attachments), feedback textarea, action buttons (Request Revision, Approve, Reject)

---

## 4. Tutor Follow-ups

**Base path:** `/api/tutor`

### Source files
- `src/services/api.ts` — direct `api.get/post/put` calls
- `src/stores/followupStore.ts` — `useFollowupStore`
- `src/views/followup/FollowupList.vue`
- `src/views/followup/FollowupForm.vue`
- `src/types/followup.ts`

### Endpoints

| Priority | Method | Endpoint | Purpose | Body/Params |
|----------|--------|----------|---------|-------------|
| 🔴 HIGH | GET | `/api/tutor/followups` | List follow-up records | `params` (search/filter) |
| 🔴 HIGH | POST | `/api/tutor/followups` | Create a new follow-up | `FollowupPayload` |
| 🔴 HIGH | PUT | `/api/tutor/followups/{id}` | Update a follow-up record | `FollowupPayload` |
| 🔴 HIGH | DELETE | `/api/tutor/followups/{id}` | Delete a follow-up record | — |

> **⚠️ NOTE:** The `DELETE` endpoint is called from `FollowupList.vue` but the `deleteFollowup()` action is **missing** from `followupStore.ts`. Both frontend and backend need this implemented.

### Expected List Response Shape

```json
{
  "data": [
    {
      "id": 1,
      "student_id": 1,
      "tutor_id": 1,
      "company_id": null,
      "meeting_type": "Online",
      "meeting_date": "2024-01-20",
      "notes": "Discussed progress on API development",
      "action_items": "Complete database schema by next week",
      "next_followup": "2024-01-27",
      "created_at": "2024-01-20T14:00:00Z",
      "updated_at": "2024-01-20T14:00:00Z",
      "student": {
        "id": 1,
        "name": "John Doe"
      },
      "company": null
    }
  ]
}
```

### Follow-up Payload

```json
{
  "student_id": 1,
  "company_id": null,
  "meeting_type": "In-Person | Online | Phone | Virtual",
  "meeting_date": "2024-01-20",
  "notes": "Meeting notes here",
  "action_items": "Action items here",
  "next_followup": "2024-01-27"
}
```

### Meeting Types (allowed values)

| Value | Label |
|-------|-------|
| `In-Person` | In-Person |
| `Online` | Online |
| `Phone` | Phone |
| `Virtual` | Virtual |

### View Screens
**FollowupList.vue** shows:
- **Header** with "New Follow-up" button
- **Search bar** with Search/Reset buttons
- **Follow-up Table** — columns: Student, Meeting Type, Meeting Date, Next Follow-up, Actions (Edit, Delete)
- **Mobile card view** — same data in card layout
- **Modal form** (via `FollowupForm.vue`) — Student dropdown, Company dropdown, Meeting Type select, Meeting Date picker, Notes textarea, Action Items textarea, Next Follow-up date picker

**FollowupForm.vue** also calls:
- `GET /api/tutor/students` — to populate student dropdown (can reuse from Section 2)
- `GET /api/tutor/companies` — to populate company dropdown (see Section 6)

---

## 5. Issues (Tutor-scoped)

**Base path:** `/api`

### Source files
- `src/services/issueService.ts` — `issueService`
- `src/stores/issueStore.ts` — `useIssueStore`
- `src/views/issue/IssueTrackerView.vue`
- `src/types/issue.ts`

The issues module is shared across roles (admin, tutor, student, company) with the same endpoints. Tutors access issues at `/tutor/issues` route.

### Endpoints

| Priority | Method | Endpoint | Purpose | Body/Params |
|----------|--------|----------|---------|-------------|
| 🔴 HIGH | GET | `/api/issues` | List issues (scoped to tutor's students) | `?search=`, `?status=`, `?priority=` |
| 🔴 HIGH | GET | `/api/issues/stats` | Get issue statistics | — |
| 🔴 HIGH | GET | `/api/issues/{id}` | Get single issue with history | — |
| 🔴 HIGH | POST | `/api/issues` | Create issue (multipart) | FormData: `title`, `description`, `priority`, `status`, `assigned_user_id`, `due_date`, `attachments[]` |
| 🔴 HIGH | PUT | `/api/issues/{id}` | Update issue | Partial issue fields |
| 🟡 MEDIUM | PATCH | `/api/issues/{id}/assign` | Assign issue to user | `{ "userId": 1 }` |
| 🟡 MEDIUM | PATCH | `/api/issues/{id}/resolve` | Resolve issue | — |

### Expected Issue Response Shape

```json
{
  "data": [
    {
      "id": "ISSUE-001",
      "title": "Database connection timeout",
      "description": "Student reports frequent timeout errors",
      "reporter": "John Doe",
      "studentName": "John Doe",
      "assignedTo": "Tutor Smith",
      "createdAt": "2024-01-10T08:00:00Z",
      "updatedAt": "2024-01-12T10:00:00Z",
      "status": "Open | In Progress | Resolved | Closed",
      "priority": "Low | Medium | High | Critical",
      "attachments": 2,
      "studentId": 1,
      "assignedUserId": 1,
      "history": [
        {
          "time": "2024-01-10T08:00:00Z",
          "user": "John Doe",
          "text": "Issue created"
        },
        {
          "time": "2024-01-11T09:00:00Z",
          "user": "Tutor Smith",
          "text": "Assigned to backend team"
        }
      ]
    }
  ],
  "meta": {
    "totalItems": 10,
    "totalPages": 2,
    "page": 1,
    "perPage": 6
  }
}
```

### Expected Stats Response

```json
{
  "total": 10,
  "open": 5,
  "inProgress": 3,
  "resolved": 2
}
```

### Issue Creation FormData Fields

| Field | Type | Required |
|-------|------|----------|
| `title` | string | yes |
| `description` | string | yes |
| `priority` | string | yes (Low/Medium/High/Critical) |
| `status` | string | no (defaults to Open) |
| `assigned_user_id` | integer | no |
| `due_date` | string (date) | no |
| `attachments[]` | file[] | no (accepts PDF, DOCX, PNG, ZIP) |

### Issue Statuses

| Status | Description |
|--------|-------------|
| `Open` | Newly created, not yet addressed |
| `In Progress` | Being worked on |
| `Resolved` | Fixed/resolved |
| `Closed` | Closed (can't be edited by company role) |

> **Note:** The frontend's `canReopenIssues` is `true` for all roles EXCEPT `company`.

### View Screens
**IssueTrackerView.vue** shows:
- **4 StatCards** — Total Issues, Open, In Progress, Resolved
- **Filters** — Search input, Status dropdown, Priority dropdown, Search/Reset buttons
- **Issue Cards** — Issue ID, status badge, title, description (2-line clamp), reporter, assignee, created date, updated date, priority badge, attachments count
- **Card Actions** — View, Update, Assign, Resolve buttons
- **Pagination**
- **Create/Update Modal** — Title, Description, Priority, Status, Assign To, Due Date, Attachments upload

---

## 6. Supporting Data Endpoints

### Called from `FollowupForm.vue`

| Priority | Method | Endpoint | Purpose | Expected Response |
|----------|--------|----------|---------|-------------------|
| 🟡 MEDIUM | GET | `/api/tutor/students` | Populate student dropdown in follow-up form | `{ "data": [{ "id": 1, "name": "John Doe" }] }` |
| 🟡 MEDIUM | GET | `/api/tutor/companies` | Populate company dropdown in follow-up form | `{ "data": [{ "id": 1, "company_name": "Tech Corp" }] }` |

> **Note:** `/api/tutor/students` can be the same endpoint as Section 2, but without pagination filters (or with different defaults). The `/api/tutor/companies` endpoint is called directly via `axios` in `FollowupForm.vue` — it's **not** in any service file.

---

## 7. Database Tables Required

For the Tutor module specifically, the backend needs these tables:

| Table | Purpose | Key Fields for Tutor Module |
|-------|---------|----------------------------|
| **users** | Authentication & base profile | `id`, `name`, `email`, `password`, `role` |
| **students** | Student-specific data | `id`, `user_id`, `student_code`, `batch_id`, `tutor_id`, `phone`, `gender`, `photo`, `status` |
| **batches** | Batch/cohort info | `id`, `batch_name`, `year` |
| **internship_assignments** | Student-Company-Tutor linkage | `id`, `student_id`, `company_id`, `tutor_id`, `position`, `start_date`, `end_date`, `status` |
| **worklogs** | Weekly submissions | `id`, `student_id`, `week_number`, `description`, `challenges`, `status`, `submitted_at` |
| **attachments** | File attachments | `id`, `worklog_id`, `filename`, `file_path`, `file_type`, `file_size` |
| **followups** | Tutor follow-up meetings | `id`, `student_id`, `tutor_id`, `company_id`, `meeting_type`, `meeting_date`, `notes`, `action_items`, `next_followup` |
| **issues** | Issue tracking | `id`, `title`, `description`, `reporter_id`, `assigned_user_id`, `student_id`, `status`, `priority`, `due_date` |
| **evaluations** | Company evaluations | `id`, `student_id`, `company_id`, `rating`, `remarks` |

---

## 8. Key Technical Notes

### Authentication & Authorization
- Use **Laravel Sanctum** for token-based auth
- Protect all tutor endpoints with `auth:sanctum` middleware
- Add a **tutor role middleware** to ensure only tutors access `/api/tutor/*` routes
- Tutor-scoped queries should filter by `tutor_id` matching the authenticated tutor's ID

### File Uploads
- Worklog attachments: `POST /api/tutor/worklogs/{id}` (for review — no file upload here)
- Issue attachments: `POST /api/issues` accepts `multipart/form-data` with `attachments[]`
- Student photos: through admin endpoints, not tutor

### Pagination Format
All list endpoints should return:
```json
{
  "data": [],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 0,
    "from": 1,
    "to": 15
  }
}
```
The `meta` structure for some endpoints uses `pagination` nested inside `meta`:
```json
{
  "meta": {
    "pagination": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 15,
      "total": 0
    }
  }
}
```
Both formats are used in the frontend — be consistent or support both.

### Validation Error Format (422)
```json
{
  "message": "Validation failed.",
  "errors": {
    "field_name": ["Error message 1", "Error message 2"]
  }
}
```

### Error Response Format (500, 403, 401)
```json
{
  "message": "Error description"
}
```

### Response Envelope
Some endpoints wrap data in `{ "success": true, "data": {...} }`. Others return data directly. The frontend handles both. Recommend using consistent format:
- List endpoints: `{ "data": [...], "meta": {...} }` or `{ "success": true, "data": [...], "meta": {...} }`
- Single endpoints: `{ "data": {...} }` or `{ "success": true, "data": {...} }`
- Mutation endpoints: `{ "data": {...}, "message": "Success message" }`

### CORS Configuration
- Frontend dev server: `http://localhost:5173`
- Backend API: `http://127.0.0.1:8000/api`
- Ensure CORS allows the frontend origin and the required headers (Authorization, Content-Type, Accept, X-Requested-With, X-CSRF-TOKEN)

### Frontend Issues to Note
| Issue | File | Description |
|-------|------|-------------|
| ⚠️ | `followupStore.ts` | Missing `deleteFollowup()` action — `FollowupList.vue` calls it but store doesn't have it |
| ⚠️ | `TutorStudentDetailView.vue` | Worklogs, Follow-ups, and Issues tabs are placeholders — need to lazy-load data |

