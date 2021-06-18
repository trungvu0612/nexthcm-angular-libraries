import { TuiDay } from '@taiga-ui/cdk';

export interface Requests {
  id?: string;
  type?: string;
  userId?: string;
  state?: number;
  assignedName?: string;
  fromDate?: number | Date | TuiDay;
  toDate?: number | Date | TuiDay;
  lastModifiedDate?: Date;
  duration?: Duration;
  sendTo?: Employee;
  comments?: string;
  reason?: string;
}

export interface TimeSheetUpdateReq extends Requests {
  newInTime: number | string;
  newOutTime: number | string;
  oldInTime: number | string;
  oldOutTime: number | string;
  updateTotalTime: number;
  timeSheetTracking: TimeSheetTracking;
  emailCc: string;
}

export interface TimeSheetTracking {
  id: string;
  trackingDate: number;
  inTime: number | string;
  outTime: number | string;
}

export interface Duration {
  id: string;
}

export interface Employee {
  id: string;
}

export interface SearchRequest {
  fromDate?: number | Date | TuiDay | string;
  toDate?: number | Date | TuiDay | string;
}
