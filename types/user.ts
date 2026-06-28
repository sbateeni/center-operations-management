export interface UserPermissions {
  can_create: boolean;
  can_see_others: boolean;
  can_navigate: boolean;
  can_edit_users: boolean;
  can_dispatch: boolean;
  can_view_logs: boolean;
  can_manage_content: boolean;
}

export type UserRole = 'super_admin' | 'admin' | 'governorate_admin' | 'center_admin' | 'judicial' | 'officer' | 'user' | 'banned' | 'source';

export interface UserProfile {
  id: string;
  username: string;
  role: UserRole;
  isApproved: boolean;
  email?: string;
  permissions: UserPermissions;
  governorate?: string;
  center?: string;
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
}
