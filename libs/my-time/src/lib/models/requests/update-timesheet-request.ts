import { EmployeeInfo } from '@nexthcm/cdk';
import { BaseRequest } from './base-request';

export interface UpdateTimesheetRequest extends BaseRequest {
  newInTime: number;
  newOutTime: number;
  oldInTime: number;
  oldOutTime: number;
  day: string;
  totalHourUpdate: number;
  updateTotalTime: number;
  updateWorkingDay: number;
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
