import { useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import { notifications } from '../services/notifications';
import { MapUser } from '../types';

export function useNotifications(
  userId: string | undefined,
  userRole: string | null,
  onlineUsers: MapUser[],
) {
  const subscribedRef = useRef(false);
  const prevSosIdsRef = useRef<Set<string>>(new Set());

  // Request permission on mount
  useEffect(() => {
    if (!userId) return;
    notifications.requestPermission();
  }, [userId]);

  // Watch for new SOS activations
  useEffect(() => {
    if (!userId || !userRole) return;
    const currentSosIds = new Set(onlineUsers.filter(u => u.isSOS).map(u => u.id));
    currentSosIds.forEach(id => {
      if (!prevSosIdsRef.current.has(id) && id !== userId) {
        const user = onlineUsers.find(u => u.id === id);
        if (user) notifications.showSOS(user.username, user.lat, user.lng);
      }
    });
    prevSosIdsRef.current = currentSosIds;
  }, [onlineUsers, userId, userRole]);

  // Subscribe to new assignments
  useEffect(() => {
    if (!userId || subscribedRef.current) return;
    subscribedRef.current = true;

    const channel = supabase
      .channel('assignments-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'assignments',
        filter: `target_user_id=eq.${userId}`,
      }, (payload: any) => {
        const record = payload.new;
        notifications.showAssignment(record.title, 'العمليات المركزية');
      })
      .subscribe();

    return () => {
      subscribedRef.current = false;
      supabase.removeChannel(channel);
    };
  }, [userId]);
}
