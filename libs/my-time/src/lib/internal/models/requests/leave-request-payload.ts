import { TuiTime } from '@taiga-ui/cdk';
import { DurationType } from '../../enums';

export interface LeaveRequestPayload {
  employeeId: string;
  fromDate: number;
  toDate: number;
  leaveTypeId: string;
  comment: string;
  sendTo: string;
  partialDayTypeId: string;
  items: PayloadTimeItem[];
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
