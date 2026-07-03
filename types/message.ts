export type MessageChannel = 'general' | 'urgent' | 'command';

export interface ChatMessage {
  id?: string;
  channel: MessageChannel;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: number;
  readBy: string[];
  isPreset?: boolean;
}
