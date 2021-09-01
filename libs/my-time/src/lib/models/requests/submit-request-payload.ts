import { TuiDay, TuiDayRange, TuiTime } from '@taiga-ui/cdk';
import { RequestStatus } from '../../enums';

export interface SubmitRequestPayload {
  fromDate: number | TuiDay | undefined;
  toDate: number | TuiDay | undefined;
  comment: string;
  userId?: string;
  duration?: number;
  sendTo?: string;
  reason?: string;
  fromTo?: TuiDayRange;
  status?: RequestStatus;
  createdDate?: number | TuiDay;
  newInTime?: number | TuiTime;
  newOutTime?: number | TuiTime;
}
