export interface HCMRequest {
  office: string;
  date: Date;
  fromDate: Date;
  toDate: Date;
  spentTime: number;
  day: number;
  inTime: string;
  outTime?: any;
  totalTime: number;
  status: string;
  reason: string;
  comment: string;
  sentTo: string;
}
