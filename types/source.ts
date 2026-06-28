export interface AccessCode {
  code: string;
  created_by: string;
  created_at: number;
  expires_at: number;
  label?: string;
  is_active: boolean;
  device_id?: string;
}

export interface SourceSession {
  code: string;
  expiresAt: number;
  label?: string;
}
