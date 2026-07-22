- [ ] Improve search behavior on `src/views/student/StudentListView.vue`:
  - [ ] Debounce/handle typing so results update automatically without needing a Search button.
  - [ ] Start searching only after 2 characters; if less than 2 show existing list (don’t show "No students found").
  - [ ] If search is cleared, show full list again.
  - [ ] Ensure empty state shows "No students found" when search term length >= 2 and results are empty.
  - [ ] Avoid unnecessary server calls by not coupling `searchQuery` directly to pagination dependency triggering.
- [ ] Build/test (`npm run build`) after code changes.

