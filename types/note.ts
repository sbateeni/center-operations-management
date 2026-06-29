export type WantedStatus = 'new' | 'tracking' | 'in_campaign' | 'closed';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  locationName: string;
  details: string;
  sources: GroundingSource[];
}

export interface MapNote {
  id: string;
  lat: number;
  lng: number;
  userNote: string;
  locationName: string;
  aiAnalysis: string;
  createdAt: number;
  sources?: GroundingSource[];
  status?: WantedStatus | 'caught' | 'not_caught';
  governorate?: string | null;
  center?: string | null;
  createdBy?: string;
  accessCode?: string;
  visibility?: 'public' | 'private';
}
