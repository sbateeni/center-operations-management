import React, { useEffect, useRef } from 'react';
import { GeofenceZone } from '../../types';

function isPointInPolygon(lat: number, lng: number, points: { lat: number; lng: number }[]): boolean {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].lng, yi = points[i].lat;
    const xj = points[j].lng, yj = points[j].lat;
    if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function isUserInZone(userLat: number, userLng: number, zone: GeofenceZone): boolean {
  if (zone.type === 'circle' && zone.radius) {
    const R = 6371000;
    const dLat = ((userLat - zone.lat) * Math.PI) / 180;
    const dLng = ((userLng - zone.lng) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((zone.lat * Math.PI) / 180) * Math.cos((userLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return dist <= zone.radius;
  }
  if (zone.type === 'polygon' && zone.points && zone.points.length >= 3) {
    return isPointInPolygon(userLat, userLng, zone.points);
  }
  return false;
}

export function useMapGeofence(
  mapInstanceRef: React.MutableRefObject<any>,
  zones: GeofenceZone[],
  userLocation: { lat: number; lng: number } | null,
  userId: string | undefined,
  userName: string | undefined,
  onZoneEvent?: (zone: GeofenceZone, eventType: 'enter' | 'exit') => void,

  // Drawing mode
  isDrawingPolygon?: boolean,
  drawingPoints?: { lat: number; lng: number }[],
  drawingColor?: string,
) {
  const layersRef = useRef<{ [key: string]: any }>({});
  const prevInZoneRef = useRef<Set<string>>(new Set());
  const drawingLayerRef = useRef<any>(null);
  const vertexMarkersRef = useRef<any[]>([]);

  // Render zones on map
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const map = mapInstanceRef.current;
    Object.keys(layersRef.current).forEach(id => {
      if (!zones.find(z => z.id === id)) {
        map.removeLayer(layersRef.current[id]);
        delete layersRef.current[id];
      }
    });

    zones.forEach(zone => {
      if (!zone.isActive) return;
      const color = zone.color || '#ef4444';
      if (layersRef.current[zone.id!]) {
        map.removeLayer(layersRef.current[zone.id!]);
      }
      let layer: any;
      if (zone.type === 'circle' && zone.radius) {
        layer = window.L.circle([zone.lat, zone.lng], {
          radius: zone.radius, color, fillColor: color, fillOpacity: 0.08, weight: 2, opacity: 0.6,
        }).addTo(map);
      } else if (zone.type === 'polygon' && zone.points && zone.points.length >= 3) {
        const latlngs = zone.points.map(p => [p.lat, p.lng]);
        layer = window.L.polygon(latlngs, { color, fillColor: color, fillOpacity: 0.08, weight: 2, opacity: 0.6 }).addTo(map);
      }
      if (layer) {
        layer.bindTooltip(zone.name, {
          permanent: true, direction: 'center',
          className: 'bg-slate-900/80 text-white px-2 py-1 rounded border border-slate-700 text-[10px] font-bold',
        });
        layersRef.current[zone.id!] = layer;
      }
    });

    return () => {
      Object.values(layersRef.current).forEach(l => map.removeLayer(l));
      layersRef.current = {};
    };
  }, [zones, mapInstanceRef]);

  // Render drawing preview
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const map = mapInstanceRef.current;

    // Clear previous drawing
    if (drawingLayerRef.current) {
      map.removeLayer(drawingLayerRef.current);
      drawingLayerRef.current = null;
    }
    vertexMarkersRef.current.forEach(m => map.removeLayer(m));
    vertexMarkersRef.current = [];

    if (!isDrawingPolygon || !drawingPoints || drawingPoints.length === 0) return;

    const color = drawingColor || '#10b981';

    // Draw polygon preview (if >= 3 points, fill it; otherwise draw a polyline)
    const latlngs = drawingPoints.map(p => [p.lat, p.lng]);
    if (drawingPoints.length >= 3) {
      drawingLayerRef.current = window.L.polygon(latlngs, {
        color, fillColor: color, fillOpacity: 0.12, weight: 3, opacity: 0.8, dashArray: '8, 8',
      }).addTo(map);
    } else {
      drawingLayerRef.current = window.L.polyline(latlngs, {
        color, weight: 3, opacity: 0.8, dashArray: '8, 8',
      }).addTo(map);
    }

    // Vertex markers — first point is larger (close target)
    drawingPoints.forEach((p, i) => {
      const isFirst = i === 0;
      const marker = window.L.circleMarker([p.lat, p.lng], {
        radius: isFirst ? 10 : 6, color: 'white', fillColor: isFirst ? '#f59e0b' : color, fillOpacity: 1, weight: isFirst ? 3 : 2,
      }).addTo(map);
      marker.bindTooltip(isFirst && drawingPoints.length >= 3 ? 'اضغط للإغلاق' : `نقطة ${i + 1}`, {
        permanent: false, direction: 'top',
        className: `bg-slate-900 text-white px-1.5 py-0.5 rounded text-[9px] font-bold ${isFirst ? 'border border-amber-400' : ''}`,
      });
      vertexMarkersRef.current.push(marker);
    });

    // Closing hint line from last point back to first
    if (drawingPoints.length >= 2) {
      const closingLine = window.L.polyline([
        [drawingPoints[drawingPoints.length - 1].lat, drawingPoints[drawingPoints.length - 1].lng],
        [drawingPoints[0].lat, drawingPoints[0].lng],
      ], { color, weight: 1.5, opacity: 0.25, dashArray: '4, 6' }).addTo(map);
      vertexMarkersRef.current.push(closingLine);
    }

    return () => {
      if (drawingLayerRef.current) map.removeLayer(drawingLayerRef.current);
      vertexMarkersRef.current.forEach(m => map.removeLayer(m));
    };
  }, [isDrawingPolygon, drawingPoints, drawingColor, mapInstanceRef]);

  // Detect enter/exit
  useEffect(() => {
    if (!userLocation || !userId || !onZoneEvent) return;
    const nowInZone = new Set<string>();
    zones.forEach(zone => {
      if (!zone.isActive) return;
      const inside = isUserInZone(userLocation.lat, userLocation.lng, zone);
      if (inside) nowInZone.add(zone.id!);
      const wasInside = prevInZoneRef.current.has(zone.id!);
      if (inside && !wasInside) {
        onZoneEvent(zone, 'enter');
      } else if (!inside && wasInside) {
        onZoneEvent(zone, 'exit');
      }
    });
    prevInZoneRef.current = nowInZone;
  }, [userLocation, zones, userId, userName, onZoneEvent]);
}
