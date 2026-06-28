import { supabase } from './supabase';
import type { Assignment } from '../types';

export const assignmentsApi = {
  async create(assignment: any): Promise<void> {
    await supabase.from('assignments').insert({
      target_user_id: assignment.targetUserId, location_id: assignment.locationId,
      location_name: assignment.locationName, lat: assignment.lat, lng: assignment.lng,
      instructions: assignment.instructions, created_by: assignment.createdBy, created_at: Date.now()
    });
  },

  async getMy(userId: string): Promise<Assignment[]> {
    const { data } = await supabase.from('assignments').select('*').eq('target_user_id', userId).neq('status', 'completed');
    return (data || []).map((row: any) => ({
      id: row.id, targetUserId: row.target_user_id, locationId: row.location_id,
      locationName: row.location_name, lat: row.lat, lng: row.lng,
      instructions: row.instructions, status: row.status, createdBy: row.created_by, createdAt: row.created_at
    }));
  },

  async updateStatus(id: string, status: string): Promise<void> {
    await supabase.from('assignments').update({ status }).eq('id', id);
  }
};
