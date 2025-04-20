export interface HistoryRecord {
    deviceName: 'den' | 'maybom';
    action: 'on' | 'off';
    triggeredBy: 'User' | 'System';
    reason: string;
    timestamp: Date;
  }