import { UserRole, UserPermissions } from '../types';

export const ROLE_HIERARCHY: UserRole[] = [
  'super_admin', 'governorate_admin', 'center_admin', 'admin', 'officer', 'judicial', 'user', 'source', 'banned'
];

export const ADMIN_ROLES: UserRole[] = ['super_admin', 'governorate_admin', 'center_admin', 'admin'];
export const OFFICER_ROLES: UserRole[] = ['super_admin', 'governorate_admin', 'center_admin', 'admin', 'officer'];
export const COMMANDER_ROLES: UserRole[] = ['officer', 'judicial', 'center_admin', 'governorate_admin', 'super_admin'];

export const isAdmin = (role?: string) => ADMIN_ROLES.includes(role as UserRole);
export const isOfficerOrAbove = (role?: string) => OFFICER_ROLES.includes(role as UserRole);

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

export const DEFAULT_PERMISSIONS: UserPermissions = {
  can_create: true,
  can_see_others: true,
  can_navigate: true,
  can_edit_users: false,
  can_dispatch: false,
  can_view_logs: true,
  can_manage_content: false
};
