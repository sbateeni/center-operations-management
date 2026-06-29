import { UserRole, UserPermissions } from '../types';

export const ROLE_HIERARCHY: UserRole[] = [
  'central_operations', 'governorate_police', 'center', 'officer', 'source', 'banned'
];

export const ADMIN_ROLES: UserRole[] = ['central_operations', 'governorate_police', 'center'];
export const OFFICER_ROLES: UserRole[] = ['central_operations', 'governorate_police', 'center', 'officer'];
export const COMMANDER_ROLES: UserRole[] = ['officer', 'center', 'governorate_police', 'central_operations'];

export const isAdmin = (role?: string | null) => ADMIN_ROLES.includes(role as UserRole);
export const isOfficerOrAbove = (role?: string | null) => OFFICER_ROLES.includes(role as UserRole);

export const ROLE_LABELS: Record<string, string> = {
  central_operations: 'العمليات المركزية',
  governorate_police: 'شرطة المحافظة',
  center: 'المركز',
  officer: 'ضابط',
  source: 'مصدر',
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
  central_operations: FULL_PERMS,
  governorate_police: { ...FULL_PERMS, can_edit_users: false },
  center: { ...FULL_PERMS, can_edit_users: false, can_dispatch: false },
  officer: { ...FULL_PERMS, can_edit_users: false, can_dispatch: false, can_manage_content: false, can_manage_campaigns: false },
  source: { can_create: true, can_see_others: false, can_navigate: true, can_edit_users: false, can_dispatch: false, can_view_logs: false, can_manage_content: false, can_manage_campaigns: false },
  banned: { can_create: false, can_see_others: false, can_navigate: false, can_edit_users: false, can_dispatch: false, can_view_logs: false, can_manage_content: false, can_manage_campaigns: false },
};
