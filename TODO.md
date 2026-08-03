# Task: Enable searching issues by student name across all issue views

## Objective
Enable searching/filtering issues by student name (e.g., "Vicheka") in the TutorIssuesView and StudentIssuesView, since the backend API (`IssueController::index`) already supports searching by student name via the `search` parameter (it searches `CONCAT(first_name, ' ', last_name)`).

## Plan

### Step 1: ✅ Update IssueTrackerView.vue search placeholder
- Updated placeholder from "Search by title..." to "Search by title or student name..."

### Step 2: ✅ Update TutorIssuesView.vue
- Modified `fetchAllIssues()` to pass the actual search/status/priority filter values to the API instead of always sending empty strings
- Updated debounced search watch to call `fetchAllIssues()` with current filter values
- Updated `onFilterChange()`, `clearSearch()`, and `resetFilters()` to re-fetch from API with proper filter params
- Updated placeholder to "Search by title or student name..."

### Step 3: ✅ Update StudentIssuesView.vue
- Modified `fetchAllIssues()` to pass the actual search/status/priority filter values to the API instead of always sending empty strings
- Updated debounced search watch to call `fetchAllIssues()` with current filter values
- Updated `onFilterChange()`, `clearSearch()`, and `resetFilters()` to re-fetch from API with proper filter params

### Step 4: 🔄 Verification
- [ ] Test that typing "Vicheka" in the search bar returns issues related to "Vicheka Hav"

