export interface Task {
  id: string; // UUID from backend
  title: string;
  description?: string;
  complete: boolean;
  user_id: string; // UUID from backend
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}