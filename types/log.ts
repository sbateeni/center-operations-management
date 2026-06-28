export interface LogEntry {
  id: string;
  message: string;
  type: 'alert' | 'info' | 'dispatch' | 'status';
  userId?: string;
  timestamp: number;
  governorate?: string;
  center?: string;
}
