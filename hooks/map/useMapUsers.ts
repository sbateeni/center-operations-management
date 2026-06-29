


import React, { useEffect, useRef } from 'react';
import { MapUser } from '../../types';
import { createUserIconHtml } from '../../utils/mapHelpers';

function shouldSeeUser(currentRole: string | undefined | null, currentGov: string | undefined | null, user: MapUser): boolean {
  if (!currentRole) return true;
  if (currentRole === 'central_operations') return true;
  if (currentRole === 'source') return false;
  if (currentRole === 'governorate_police' || currentRole === 'center' || currentRole === 'officer') {
    return currentGov != null && user.governorate === currentGov;
  }
  return true;
}

export function useMapUsers(
    mapInstanceRef: React.MutableRefObject<any>,
    otherUsers: MapUser[],
    onUserClick: ((user: MapUser) => void) | undefined,
    canSeeOthers: boolean,
    userRole?: string | null,
    userGovernorate?: string | null
) {
  const userMarkersRef = useRef<{ [key: string]: any }>({});

  useEffect(() => {
      if (!mapInstanceRef.current) return;
      const map = mapInstanceRef.current;

      const visibleUsers = otherUsers.filter(u => shouldSeeUser(userRole, userGovernorate, u));
      const activeIds = new Set(visibleUsers.map(u => u.id));

      // Remove old
      Object.keys(userMarkersRef.current).forEach(id => {
          if (!activeIds.has(id)) {
              map.removeLayer(userMarkersRef.current[id]);
              delete userMarkersRef.current[id];
          }
      });

      // Add/Update
      visibleUsers.forEach(user => {
          if (!canSeeOthers) return;
          if (user.lat == null || user.lng == null) return;

          const html = createUserIconHtml(user);
          const icon = window.L.divIcon({
              className: 'custom-div-icon',
              html: html,
              iconSize: [34, 34],
              iconAnchor: [17, 17]
          });

          if (userMarkersRef.current[user.id]) {
              const marker = userMarkersRef.current[user.id];
              marker.setLatLng([user.lat, user.lng]);
              marker.setIcon(icon);
              marker.setZIndexOffset(100);
          } else {
              const marker = window.L.marker([user.lat, user.lng], { icon, zIndexOffset: 100 }).addTo(map);
              marker.on('click', () => {
                  if (onUserClick) onUserClick(user);
              });
              userMarkersRef.current[user.id] = marker;
          }
      });

      if (!canSeeOthers) {
           Object.keys(userMarkersRef.current).forEach(id => {
              map.removeLayer(userMarkersRef.current[id]);
              delete userMarkersRef.current[id];
           });
      }

  }, [otherUsers, canSeeOthers, onUserClick, userRole, userGovernorate]);
}
