import { EmployeeInfo } from '@nexthcm/cdk';

import { PartialDays } from '../../enums';
import { BaseRequest } from './base-request';

export interface LeaveRequest extends BaseRequest {
  reason: string;
  duration: number;
  fromDate: number;
  toDate: number;
  partialDayType?: PartialDaysType;
  leaveType: LeaveRequestLeaveType;
  items: TimeItem[];
  durationInDay: number;
  employeeDTO: EmployeeInfo;
  sendToDTO: EmployeeInfo;
  escalateDTO: EmployeeInfo;
  dateRange?: string;
}

export interface LeaveRequestLeaveType {
  id: string;
  name: string;
  description: string;
  workflowId: string;
  status: number;
  orgId: string;
}

export interface TimeItem {
  morning?: boolean;
  afternoon?: boolean;
  fullDay?: boolean;
  fromTime?: number;
  toTime?: number;
}

export interface PartialDaysType {
  id: string;
  status: number;
  name: string;
  type: PartialDays;
}
