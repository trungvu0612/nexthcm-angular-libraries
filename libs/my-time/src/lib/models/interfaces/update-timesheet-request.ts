import { EmployeeInfo } from '@nexthcm/cdk';
import { BaseRequest } from './base-request';

export interface UpdateTimesheetRequest extends BaseRequest {
  optCounter: number;
  newInTime: number;
  newOutTime: number;
  oldInTime: number;
  oldOutTime: number;
  comments: string;
  day: string;
  totalHourUpdate: number;
  updateTotalTime: string;
  userInfo: EmployeeInfo;
  timeSheetTracking: UpdateTimesheetRequestTimeSheetTracking;
}

export interface UpdateTimesheetRequestTimeSheetTracking {
  id: string;
  userId: string;
  trackingDate: number;
  inTime: number;
  outTime: number;
  checkinFrom: string;
  checkoutFrom: string;
  lastAction: string;
  totalWorkingTime: string;
}
