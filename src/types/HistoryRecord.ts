export interface HistoryRecord {
    device: 'Đèn' | 'Máy bơm';
    action: 'on' | 'off';
    triggeredBy: 'user' | 'system';
    reason?: string;
    timeStart: Date;
  }