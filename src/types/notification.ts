export interface Notification {
  id: number;
  user_id: number;
  sender_id: number | null;
  sender_type: 'system' | 'company' | 'tutor' | 'student' | null;
  event: string;
  category: 'general' | 'evaluation';
  title: string;
  message: string;
  reference_type: 'worklog' | 'assignment' | 'issue' | 'evaluation' | 'followup' | null;
  reference_id: number | null;
  action_url: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  icon: string | null;
  color: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  sender?: {
    id: number;
    name: string;
    role?: string;
    avatar?: string;
  } | null;
  reference?: Record<string, any> | null;
}

export interface NotificationFilters {
  search?: string;
  category?: 'general' | 'evaluation';
  event?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  is_read?: boolean;
  reference_type?: string;
  date_from?: string;
  date_to?: string;
  sort: 'newest' | 'oldest';
  page: number;
  per_page: number;
}

export interface NotificationListResponse {
  data: Notification[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
  };
}