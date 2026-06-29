export interface LogEntry {
  id: string;
  message: string;
  type: 'alert' | 'info' | 'dispatch' | 'status' | 'user_joined' | 'user_banned';
  userId?: string;
  timestamp: number;
  governorate?: string | null;
  center?: string | null;
}
