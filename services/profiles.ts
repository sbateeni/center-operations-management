import { supabase } from './supabase';
import type { UserProfile, UserPermissions } from '../types';

const DEFAULT_PERMISSIONS: UserPermissions = {
  can_create: true, can_see_others: true, can_navigate: true,
  can_edit_users: false, can_dispatch: false, can_view_logs: true, can_manage_content: false
};

const mapProfile = (row: any): UserProfile => ({
  id: row.id, username: row.username || 'Unknown', role: row.role,
  isApproved: row.is_approved === true, email: row.email,
  permissions: { ...DEFAULT_PERMISSIONS, ...(row.permissions || {}) },
  governorate: row.governorate, center: row.center, last_seen: row.last_seen
});

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
    await supabase.from('profiles').update(updates).eq('id', id);
  },

  async getRecentlyActive(): Promise<any[]> {
    const cutoff = Date.now() - (30 * 60 * 1000);
    const { data } = await supabase.from('profiles').select('*').gt('last_seen', cutoff);
    return data || [];
  }
};
