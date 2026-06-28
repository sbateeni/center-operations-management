import { supabase } from './supabase';
import type { AccessCode } from '../types';

const getDeviceId = () => {
  let id = localStorage.getItem('ops_device_id');
  if (!id) { id = crypto.randomUUID(); localStorage.setItem('ops_device_id', id); }
  return id;
};

export const accessCodesApi = {
  async verify(code: string): Promise<{ valid: boolean; error?: string; expiresAt?: number; label?: string }> {
    try {
      const deviceId = getDeviceId();
      const { data, error } = await supabase.rpc('claim_access_code', { p_code: code, p_device_id: deviceId });
      if (error) return { valid: false, error: 'تعذر التحقق من الكود حالياً' };
      if (data && data.success) return { valid: true, expiresAt: data.expires_at, label: data.label };
      return { valid: false, error: data?.message || 'كود غير صالح أو مستخدم على جهاز آخر' };
    } catch {
      return { valid: false, error: 'خطأ أمني في النظام' };
    }
  },

  async create(label: string): Promise<AccessCode> {
    const code = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
    const { data: { user } } = await supabase.auth.getUser();
    const newCode = { code, created_by: user?.id, created_at: Date.now(), expires_at: Date.now() + (30 * 60 * 1000), is_active: true, label };
    await supabase.from('access_codes').insert(newCode);
    return newCode as any;
  },

  async getMine(): Promise<AccessCode[]> {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase.from('access_codes').select('*').eq('created_by', user?.id);
    return data || [];
  },

  async getAll(): Promise<AccessCode[]> {
    const { data } = await supabase.from('access_codes').select('*');
    return data || [];
  },

  async revoke(code: string): Promise<void> {
    await supabase.from('access_codes').update({ is_active: false }).eq('code', code);
  },

  async renew(code: string): Promise<void> {
    await supabase.from('access_codes').update({ is_active: true, expires_at: Date.now() + (30 * 60 * 1000) }).eq('code', code);
  }
};
