export interface Assignment {
  id: string;
  targetUserId: string;
  locationId: string;
  locationName: string;
  lat: number;
  lng: number;
  instructions?: string;
  status: 'pending' | 'accepted' | 'completed';
  createdBy: string;
  createdAt: number;
}
