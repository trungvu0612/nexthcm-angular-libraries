import { TuiDayRange, TuiTime } from '@taiga-ui/cdk';
import { DurationType } from '../../enums';
import { PartialDaysType } from './leave-request';

export interface LeaveRequestPayload {
  fromDate: number;
  toDate: number;
  leaveTypeId: string;
  comment: string;
  sendTo: string;
  partialDayTypeId: string;
  items: PayloadTimeItem[];
}

export interface LeaveRequestForm extends LeaveRequestPayload {
  leaveType?: [RemainingLeaveEntitlement];
  fromTo?: TuiDayRange;
  partialDays?: PartialDaysType;
  startDay?: SingleDayItem;
  endDay?: SingleDayItem;
}

export interface RemainingLeaveEntitlement {
  leaveTypeId: string;
  leaveTypeName: string;
  remainingEntitlement: number;
}

export type SingleDayItem =
  | { type: DurationType.FullDay }
  | { type: DurationType.HalfDay; value: { morning: true } | { afternoon: true } }
  | { type: DurationType.SpecifyTime; time: { from: TuiTime; to: TuiTime } };

export interface PayloadTimeItem {
  morning?: boolean;
  afternoon?: boolean;
  fullDay?: boolean;
  fromTime?: number;
  toTime?: number;
}
