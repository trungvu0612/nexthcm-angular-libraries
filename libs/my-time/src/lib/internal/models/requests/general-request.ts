import { BaseObject, EmployeeInfo } from '@nexthcm/cdk';

import { LeaveRequestLeaveType } from '../../../models/leave-request';
import { BaseRequest } from './base-request';
import { UpdateTimesheetRequestTimeSheetTracking } from './update-timesheet-request';

export interface GeneralRequest extends BaseRequest {
  employeeDTO?: EmployeeInfo;
  user?: EmployeeInfo;
  userInfo?: EmployeeInfo;
  escalateDTO?: EmployeeInfo | null;
  escalateInfo?: EmployeeInfo | null;
  sendToDTOs?: EmployeeInfo[];
  sendToUsers?: EmployeeInfo[];
  durationInDay?: number;
  totalDay?: number;
  duration?: number;
  fromDate: number;
  toDate: number;
  dateRange?: string;
  leaveType?: LeaveRequestLeaveType;
  timeSheetTracking?: UpdateTimesheetRequestTimeSheetTracking;
  newInTime?: number;
  newOutTime?: number;
  reason: string;
  updateWorkingDay: number;
  updateTotalTime: number;
  officeDTO?: BaseObject;
}
