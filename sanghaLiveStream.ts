export type SanghaLiveStreamStatus = 'scheduled' | 'live' | 'ended' | 'cancelled';

export interface SanghaLiveStream {
  id: string;
  title: string;
  group: {
    id: string;
    name: string;
  };
  host: {
    id: string;
    name: string;
  };
  status: SanghaLiveStreamStatus;
  scheduledAt: string;
  startedAt?: string;
  endedAt?: string;
  hasRecording: boolean;
}