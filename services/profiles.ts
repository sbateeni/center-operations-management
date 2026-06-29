import { supabase } from './supabase';
import type { UserProfile, UserRole } from '../types';
import { DEFAULT_PERMISSIONS, ROLE_DEFAULT_PERMISSIONS } from '../constants/roles';

const ROLE_MIGRATION: Record<string, UserRole> = {
  super_admin: 'central_operations',
  governorate_admin: 'governorate_police',
  center_admin: 'center',
  admin: 'central_operations',
  judicial: 'officer',
  user: 'source',
};

const mapProfile = (row: any): UserProfile => {
  const mappedRole = ROLE_MIGRATION[row.role] || row.role;
  const rolePerms = ROLE_DEFAULT_PERMISSIONS[mappedRole as keyof typeof ROLE_DEFAULT_PERMISSIONS] || DEFAULT_PERMISSIONS;
  return {
    id: row.id, username: row.username || 'Unknown', role: mappedRole,
    isApproved: row.is_approved === true, email: row.email,
    permissions: { ...rolePerms, ...(row.permissions || {}) },
    governorate: row.governorate, center: row.center, last_seen: row.last_seen
  };
};

export const profiles = {
  async get(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error || !data) return null;
    return mapProfile(data);
  },

  async getAll(): Promise<UserProfile[]> {
    const { data, error } = await supabase.from('profiles').select('*').order('role', { ascending: true });
    if (error) return [];
    return (data || []).map(mapProfile);
  },

  async updateLastSeen(userId: string, lat?: number, lng?: number): Promise<void> {
    const updates: any = { last_seen: Date.now() };
    if (lat !== undefined) updates.lat = lat;
    if (lng !== undefined) updates.lng = lng;
    await supabase.from('profiles').update(updates).eq('id', userId);
  },

  async update(id: string, updates: any): Promise<void> {
    const { error } = await supabase.from('profiles').update(updates).eq('id', id);
    if (error) throw error;
  },

  async getRecentlyActive(): Promise<any[]> {
    const cutoff = Date.now() - (30 * 60 * 1000);
    const { data } = await supabase.from('profiles').select('*').gt('last_seen', cutoff);
    return data || [];
  }
};
