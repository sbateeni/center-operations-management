import { supabase } from './supabase';
import type { LogEntry } from '../types';

export const logsApi = {
  async create(entry: Omit<LogEntry, 'id'>): Promise<void> {
    await supabase.from('logs').insert({
      message: entry.message, type: entry.type,
      user_id: entry.userId, timestamp: entry.timestamp,
      governorate: entry.governorate, center: entry.center,
      lat: entry.lat ?? null, lng: entry.lng ?? null
    });
  },

  async getRecent(): Promise<LogEntry[]> {
    const { data, error } = await supabase.from('logs').select('*').order('timestamp', { ascending: false }).limit(50);
    if (error) return [];
    return (data || []).map((row: any) => ({
      id: row.id, message: row.message, type: row.type,
      userId: row.user_id, timestamp: row.timestamp,
      governorate: row.governorate, center: row.center,
      lat: row.lat ?? undefined, lng: row.lng ?? undefined
    }));
  },

  async clearAll(): Promise<void> {
    await supabase.from('logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  }
};
