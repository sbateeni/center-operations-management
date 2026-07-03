export interface GeofenceZone {
  id?: string;
  name: string;
  type: 'circle' | 'polygon';
  lat: number;
  lng: number;
  radius?: number;
  points?: { lat: number; lng: number }[];
  color: string;
  createdBy?: string;
  createdAt: number;
  isActive: boolean;
}

export interface GeofenceEvent {
  id?: string;
  zoneId: string;
  zoneName: string;
  userId: string;
  userName: string;
  eventType: 'enter' | 'exit';
  timestamp: number;
}
