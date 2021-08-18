import { EmployeeInfo } from '@nexthcm/cdk';

export interface BaseWorkingHours {
  userId: string;
  totalWorkingTime: number;
  workingDay: number;
  userInfo: EmployeeInfo;
  ot: number;
  wfh: number;
  onsiteDay: number;
}

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
}

export interface WorkingHoursGroup extends BaseWorkingHours {
  countLeave: number;
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

export interface SearchWorkingHour {
  search: string | null;
  month: number | null;
  year: number | null;
  week: WeekInfo | null;
}

export interface RequestUpdateTime {
  timeSheetId: string;
  createdDate: string;
  sendTo: string;
  newInTime: string;
  newOutTime: string;
  comments: string;
  status: 0;
}

export interface WeekInfo {
  week: number;
  weekStart: number;
  weekEnd: number;
}

export interface WorkingInfoCurrentMonth {
  workingDay: number;
  totalWorkingDay: number;
}
