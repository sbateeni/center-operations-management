export interface UserPermissions {
  can_create: boolean;
  can_see_others: boolean;
  can_navigate: boolean;
  can_edit_users: boolean;
  can_dispatch: boolean;
  can_view_logs: boolean;
  can_manage_content: boolean;
  can_manage_campaigns: boolean;
}

export type UserRole = 'central_operations' | 'governorate_police' | 'center' | 'officer' | 'source' | 'banned';

export interface UserProfile {
  id: string;
  username: string;
  role: UserRole;
  isApproved: boolean;
  email?: string;
  permissions: UserPermissions;
  governorate?: string | null;
  center?: string | null;
  last_seen?: number;
}

export type UnitStatus = 'patrol' | 'busy' | 'pursuit' | 'offline';

export interface MapUser {
  id: string;
  username: string;
  lat: number;
  lng: number;
  color: string;
  lastUpdated: number;
  status: UnitStatus;
  isSOS: boolean;
  isOnline?: boolean;
  governorate?: string | null;
  center?: string | null;
}
