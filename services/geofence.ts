import { supabase } from './supabase';
import type { GeofenceZone, GeofenceEvent } from '../types';

export const geofenceApi = {
  async getAll(): Promise<GeofenceZone[]> {
    const { data, error } = await supabase.from('geofence_zones').select('*');
    if (error || !data) return [];
    return data.map((z: any) => ({
      id: z.id,
      name: z.name,
      type: z.type,
      lat: z.lat,
      lng: z.lng,
      radius: z.radius,
      points: z.points,
      color: z.color,
      createdBy: z.created_by,
      createdAt: z.created_at,
      isActive: z.is_active,
    }));
  },

  async create(zone: Omit<GeofenceZone, 'id' | 'createdAt'>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('geofence_zones').insert({
      name: zone.name,
      type: zone.type,
      lat: zone.lat,
      lng: zone.lng,
      radius: zone.radius,
      points: zone.points,
      color: zone.color,
      is_active: zone.isActive,
      created_by: user?.id,
      created_at: Date.now(),
    });
  },

  async update(id: string, updates: Partial<GeofenceZone>): Promise<void> {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.color !== undefined) dbUpdates.color = updates.color;
    if (updates.radius !== undefined) dbUpdates.radius = updates.radius;
    if (updates.points !== undefined) dbUpdates.points = updates.points;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
    await supabase.from('geofence_zones').update(dbUpdates).eq('id', id);
  },

  async remove(id: string): Promise<void> {
    await supabase.from('geofence_zones').delete().eq('id', id);
  },

  // Geofence Events
  async getEvents(limit = 50): Promise<GeofenceEvent[]> {
    const { data, error } = await supabase.from('geofence_events').select('*').order('timestamp', { ascending: false }).limit(limit);
    if (error || !data) return [];
    return data.map((e: any) => ({
      id: e.id,
      zoneId: e.zone_id,
      zoneName: e.zone_name,
      userId: e.user_id,
      userName: e.user_name,
      eventType: e.event_type,
      timestamp: e.timestamp,
    }));
  },

  async logEvent(event: Omit<GeofenceEvent, 'id'>): Promise<void> {
    await supabase.from('geofence_events').insert({
      zone_id: event.zoneId,
      zone_name: event.zoneName,
      user_id: event.userId,
      user_name: event.userName,
      event_type: event.eventType,
      timestamp: event.timestamp,
    });
  },
};
