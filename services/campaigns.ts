import { supabase } from './supabase';
import type { ActiveCampaign } from '../types';

export const campaignsApi = {
  async create(campaign: Omit<ActiveCampaign, 'id'>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('campaigns').insert({
      name: campaign.name, participants: Array.from(campaign.participantIds),
      targets: Array.from(campaign.targetIds), commanders: Array.from(campaign.commanderIds),
      start_time: campaign.startTime, is_active: true, created_by: user?.id
    });
  },

  async getActive(): Promise<ActiveCampaign | null> {
    const { data, error } = await supabase.from('campaigns').select('*').eq('is_active', true).limit(1).maybeSingle();
    if (error || !data) return null;
    return {
      id: data.id, name: data.name, status: 'active',
      participantIds: new Set(data.participants || []), targetIds: new Set(data.targets || []),
      commanderIds: new Set(data.commanders || []), startTime: data.start_time, createdBy: data.created_by
    };
  },

  async end(id: string): Promise<void> {
    await supabase.from('campaigns').update({ is_active: false }).eq('id', id);
  },

  async update(id: string, updates: any): Promise<void> {
    const dbUpdates: any = {};
    if (updates.targetIds) dbUpdates.targets = Array.from(updates.targetIds);
    await supabase.from('campaigns').update(dbUpdates).eq('id', id);
  }
};
