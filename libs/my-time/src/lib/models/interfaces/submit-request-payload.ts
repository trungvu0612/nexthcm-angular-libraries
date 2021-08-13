import { TuiDay, TuiDayRange, TuiTime } from '@taiga-ui/cdk';

export interface SubmitRequestPayload {
  fromDate: number | Date | TuiDay;
  toDate: number | Date | TuiDay;
  comment: string;
  userId?: string;
  duration?: TuiTime | number;
  sendTo?: string;
  reason?: string;
  fromTo?: TuiDayRange;
}
