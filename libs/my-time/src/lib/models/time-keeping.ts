export interface TimeKeepingLog {
  id: string;
  inTime?: number;
}

export interface CheckInOutPayload {
  typeCheckInOut: 'web-app';
}
