import { supabase } from './supabase';

export interface ApprovedCenter {
  id: string;
  governorate: string;
  center_name: string;
  created_at: number;
}

export const approvedCentersApi = {
  async getAll(): Promise<ApprovedCenter[]> {
    const { data, error } = await supabase.from('approved_centers').select('*').order('center_name', { ascending: true });
    if (error || !data) return [];
    return data.map((r: any) => ({
      id: r.id,
      governorate: r.governorate,
      center_name: r.center_name,
      created_at: r.created_at,
    }));
  },

  async getByGovernorate(governorate: string): Promise<ApprovedCenter[]> {
    const { data, error } = await supabase.from('approved_centers').select('*').eq('governorate', governorate).order('center_name', { ascending: true });
    if (error || !data) return [];
    return data.map((r: any) => ({
      id: r.id,
      governorate: r.governorate,
      center_name: r.center_name,
      created_at: r.created_at,
    }));
  },

  async ensure(governorate: string, centerName: string): Promise<void> {
    if (!governorate || !centerName) return;
    const { data } = await supabase.from('approved_centers').select('id').eq('governorate', governorate).eq('center_name', centerName).maybeSingle();
    if (data) return;
    await supabase.from('approved_centers').insert({
      governorate,
      center_name: centerName,
      created_at: Date.now(),
    });
  },
};
