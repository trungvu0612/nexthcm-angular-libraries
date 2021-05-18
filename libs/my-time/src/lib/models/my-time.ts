export interface MyRequestData {
  office?: string;
  date?: string | Date;
  fromDate?: string | Date;
  toDate?: string | Date;
  spentTime?: number;
  day?: number;
  timeIn?: string;
  timeOut?: string;
  totalTime?: number;
  status: string;
  reason?: string;
  comment?: string;
  sentTo?: string;
  title?: string;
  group?: string;
}
