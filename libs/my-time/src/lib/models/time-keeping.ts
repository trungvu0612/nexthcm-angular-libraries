export interface TimeKeepingAction {
  id: string;
  inTime?: number;
}

export interface CheckInPayload {
  trackingDate: number;
  inTime: number;
  checkinFrom: 'web-app';
  lastAction: 'checked-in';
}

export interface CheckOutPayload {
  trackingDate: number;
  outTime: number;
  checkoutFrom: 'web-app';
  lastAction: 'checked-out';
}
