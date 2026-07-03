import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const serviceKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

export const isAdminConfigured = Boolean(supabaseUrl && serviceKey);

export const supabaseAdmin = isAdminConfigured
  ? createClient(supabaseUrl, serviceKey)
  : null;
