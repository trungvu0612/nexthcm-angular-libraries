import { TuiDay, TuiDayRange, TuiTime } from '@taiga-ui/cdk';
import { RequestStatus } from '../../enums';

export interface SubmitRequestPayload {
  fromDate: number | TuiDay;
  toDate: number | TuiDay;
  comment: string;
  userId?: string;
  duration?: any;
  sendTo?: string;
  reason?: string;
  fromTo?: TuiDayRange;
  status?: RequestStatus;
  createdDate?: number | TuiDay;
  newInTime?: number | TuiTime;
  newOutTime?: number | TuiTime;
}
