import { EmployeeInfo } from '@nexthcm/cdk';
import { BaseRequest } from './base-request';
import { LeaveRequestLeaveType } from './leave-request';
import { UpdateTimesheetRequestTimeSheetTracking } from './update-timesheet-request';

export interface GeneralRequest extends BaseRequest {
  employeeDTO?: EmployeeInfo;
  user?: EmployeeInfo;
  userInfo?: EmployeeInfo;
  escalateDTO?: EmployeeInfo;
  sendToDTO?: EmployeeInfo;
  sendToUser?: EmployeeInfo;
  durationInDay?: number;
  duration?: number;
  fromDate: number;
  toDate: number;
  dateRange?: string;
  leaveType?: LeaveRequestLeaveType;
  timeSheetTracking?: UpdateTimesheetRequestTimeSheetTracking;
  newInTime?: number;
  newOutTime?: number;
  reason: string;
}