export type CampaignStatus = 'planned' | 'active' | 'paused' | 'completed';

export interface ActiveCampaign {
  id?: string;
  name: string;
  status?: CampaignStatus;
  participantIds: Set<string>;
  targetIds: Set<string>;
  commanderIds: Set<string>;
  startTime: number;
  createdBy?: string;
}
