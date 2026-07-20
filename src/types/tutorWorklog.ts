export interface TutorWorklogReviewPayload {
  status: 'Pending' | 'Reviewed' | 'Approved' | 'Rejected'
  feedback?: string
}
