-- ============================================
-- Gemini House Navigator - SQL Setup
-- Run ALL statements in your Supabase SQL Editor
-- ============================================

-- 1. NOTES
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'note',
  title TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  content TEXT NOT NULL,
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
  updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_notes" ON notes FOR ALL USING (auth.role() = 'authenticated');

-- 2. LOGS
CREATE TABLE IF NOT EXISTS logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  username TEXT,
  action TEXT NOT NULL,
  details TEXT,
  timestamp BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_logs" ON logs FOR ALL USING (auth.role() = 'authenticated');

-- 3. ASSIGNMENTS
CREATE TABLE IF NOT EXISTS assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'patrol',
  status TEXT NOT NULL DEFAULT 'pending',
  target_user_id UUID NOT NULL,
  created_by UUID,
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  location_name TEXT
);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_assignments" ON assignments FOR ALL USING (auth.role() = 'authenticated');

-- 4. CAMPAIGNS
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
  ends_at BIGINT,
  metadata JSONB
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_campaigns" ON campaigns FOR ALL USING (auth.role() = 'authenticated');

-- 5. ACCESS CODES
CREATE TABLE IF NOT EXISTS access_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  label TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
  expires_at BIGINT
);

ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_access_codes" ON access_codes FOR ALL USING (auth.role() = 'authenticated');

-- 6. GEOFENCE ZONES
CREATE TABLE IF NOT EXISTS geofence_zones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'circle',
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  radius DOUBLE PRECISION,
  points JSONB,
  color TEXT DEFAULT '#ef4444',
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

ALTER TABLE geofence_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_geofence_zones" ON geofence_zones FOR ALL USING (auth.role() = 'authenticated');

-- 7. GEOFENCE EVENTS
CREATE TABLE IF NOT EXISTS geofence_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id UUID,
  zone_name TEXT,
  user_id UUID,
  user_name TEXT,
  event_type TEXT NOT NULL,
  timestamp BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

ALTER TABLE geofence_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_geofence_events" ON geofence_events FOR ALL USING (auth.role() = 'authenticated');

-- 8. APPROVED CENTERS (جديد)
CREATE TABLE IF NOT EXISTS approved_centers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  governorate TEXT NOT NULL,
  center_name TEXT NOT NULL,
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
  created_by UUID,
  UNIQUE(governorate, center_name)
);

ALTER TABLE approved_centers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_read_approved_centers" ON approved_centers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "allow_insert_approved_centers" ON approved_centers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
