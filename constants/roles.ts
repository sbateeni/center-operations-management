import { UserRole, UserPermissions } from '../types';

export const ROLE_HIERARCHY: UserRole[] = [
  'super_admin', 'governorate_admin', 'center_admin', 'admin', 'officer', 'judicial', 'user', 'source', 'banned'
];

export const ADMIN_ROLES: UserRole[] = ['super_admin', 'governorate_admin', 'center_admin', 'admin'];
export const OFFICER_ROLES: UserRole[] = ['super_admin', 'governorate_admin', 'center_admin', 'admin', 'officer'];
export const COMMANDER_ROLES: UserRole[] = ['officer', 'judicial', 'center_admin', 'governorate_admin', 'super_admin'];

export const isAdmin = (role?: string | null) => ADMIN_ROLES.includes(role as UserRole);
export const isOfficerOrAbove = (role?: string | null) => OFFICER_ROLES.includes(role as UserRole);

export const ROLE_LABELS: Record<string, string> = {
  super_admin: 'قائد عام',
  governorate_admin: 'مدير محافظة',
  center_admin: 'مدير مركز',
  judicial: 'ضابط قضائية',
  officer: 'ضابط',
  user: 'عنصر',
  admin: 'مسؤول',
  source: 'مصدر مؤقت',
  banned: 'محظور'
};

export const FULL_PERMS: UserPermissions = {
  can_create: true, can_see_others: true, can_navigate: true,
  can_edit_users: true, can_dispatch: true, can_view_logs: true,
  can_manage_content: true, can_manage_campaigns: true,
};

export const DEFAULT_PERMISSIONS: UserPermissions = {
  can_create: true, can_see_others: true, can_navigate: true,
  can_edit_users: false, can_dispatch: false, can_view_logs: true,
  can_manage_content: false, can_manage_campaigns: false,
};

export const ROLE_DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  super_admin: FULL_PERMS,
  governorate_admin: { ...FULL_PERMS, can_edit_users: false },
  center_admin: { ...FULL_PERMS, can_edit_users: false, can_dispatch: false },
  admin: { ...FULL_PERMS, can_edit_users: true, can_manage_campaigns: false },
  officer: { ...FULL_PERMS, can_edit_users: false, can_manage_campaigns: false, can_manage_content: false },
  judicial: { ...DEFAULT_PERMISSIONS, can_manage_campaigns: true, can_see_others: false, can_dispatch: false, can_create: false },
  user: { ...DEFAULT_PERMISSIONS, can_edit_users: false, can_dispatch: false, can_manage_content: false },
  source: { can_create: false, can_see_others: false, can_navigate: true, can_edit_users: false, can_dispatch: false, can_view_logs: false, can_manage_content: false, can_manage_campaigns: false },
  banned: { can_create: false, can_see_others: false, can_navigate: false, can_edit_users: false, can_dispatch: false, can_view_logs: false, can_manage_content: false, can_manage_campaigns: false },
};
