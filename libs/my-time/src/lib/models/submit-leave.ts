import { TuiDay, TuiDayRange, TuiTime } from '@taiga-ui/cdk';
import { PartialDayType } from './requests';

export interface LeaveSubmit {
  leaveTypes?: LeavesRemaining[]; // for form
  durationHold?: number;
  durationEnd?: number;
  status?: number;
  comments?: string;
  leaveType?: LeaveType;
  sendTo?: string;
  duration?: Duration;
  fromTo?: TuiDayRange;
  startTime?: TuiDay | number;
  endTime?: TuiDay | number;
  specialTimeTo?: TuiTime | number;
  specialTimeFrom?: TuiTime | number;
  specialTimeTo2?: TuiTime | number;
  specialTimeFrom2?: TuiTime | number;
  halfDay?: number;
  halfDay2?: number;
  partialDays?: PartialDayType;
  name?: string;
  userName?: string
}

export interface Body {
  leaveTypeId?: string;
  partialDayTypeId?: string;
  comment?: string;
  fromDate?: number;
  toDate?: number;
  sendTo?: string;
  leaveItems?: DurationType[];
  resultDays?: number;
}

export interface SubmitLeavePayLoad {
  partialDayTypeId?: string;
  fromDate: number;
  toDate: number;
  leaveTypeId?: string;
  items?: [] | null;
  itemEnds?: unknown[];
  comment?: string;
  sendTo?: string;
}

export interface DurationType {
  durationTypeId?: string;
  fromTime?: number;
  toTime?: number;
  fullDay?: boolean;
  morning?: boolean;
  afternoon?: boolean;
  resultTime: number;
}

interface Duration {
  id?: string;
}

interface LeaveType {
  id?: string;
  leaveTypeId?: string;
  leaveTypeName?: string;
  remainingEntitlement?: string;
}

export interface LeavesRemaining {
  leaveTypeId?: string;
  leaveTypeName?: string;
  remainingEntitlement?: number;
}

export interface PartialDays {
  value?: number;
  label?: string;
}

export interface DurationValues {
  value?: number;
  label?: string;
  idPartial?: string;
  boolValue?: boolean;
}
