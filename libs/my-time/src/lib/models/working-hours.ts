import { BaseWorkingHours } from '../internal/models';

export interface WorkingHours extends BaseWorkingHours {
  id: string;
  trackingDate: number;
  inTime: number;
  outTime: number;
  checkinFrom: string;
  checkoutFrom: string;
  lastAction: string;
  lastModifiedDate: number;
  leave: WorkingHoursLeave;
  leaveType: string;
  holidayName: string;
  isWeekend: boolean;
  leaveDuration: number;
  addressCheckOut: string;
  addressCheckIn: string;
}

export interface WorkingHoursLeave {
  id: string;
  leaveType: WorkingHourLeaveLeaveType;
  fromDate: number;
  toDate: number;
  comment: string;
  items: any[];
  duration: number;
  status: number;
}

export interface WorkingHourLeaveLeaveType {
  id: string;
  name: string;
  description: string;
  workflowId: string;
  status: number;
  orgId: string;
}

export interface WorkingInfoCurrentMonth {
  workingDay: number;
  totalWorkingDay: number;
}
