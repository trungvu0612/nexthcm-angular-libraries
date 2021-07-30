import { TuiDay, TuiTime } from '@taiga-ui/cdk';

// export interface SubmitLeave {
//   id: number;
//   image: string;
//   name: string;
// }

export interface LeaveSubmit {
  leaveTypes?: LeaveType[]; // for form
  durationHold?: number;
  durationEnd?: number;
  status?: number;
  comments?: string;
  leaveType?: LeaveType;
  sendTo?: string;
  duration?: Duration;

  startTime?: TuiDay;
  endTime?: TuiDay;

  //
  specialTimeTo?: TuiTime;
  specialTimeFrom?: TuiTime;
  specialTimeTo2?: TuiTime;
  specialTimeFrom2?: TuiTime;

  //for convert
  coSpecialTimeTo?: number;
  coSpecialTimeFrom?: number;
  coSpecialTimeTo2?: number;
  coSpecialTimeFrom2?: number;

  halfDay?: number;
  halfDay2?: number;
  partialDays?: number | undefined;
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

export interface BodyTemp {
  partialDayTypeId?: string,
  fromDate?: number,
  toDate?: number,
  leaveTypeId?: string,
  comment?: string;
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

export interface Duration {
  id?: string;
}

export interface LeaveType {
  id?: string;
  leaveTypeId?: string;
  leaveTypeName?: string;
  remainingEntitlement?: string;
}

export interface PartialDays {
  value?: number;
  label?: string;
}

export interface durationValues {
  value?: number;
  label?: string;
  idPartial?: string;
}
