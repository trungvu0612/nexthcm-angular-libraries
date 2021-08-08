import { EmployeeInfo } from '@nexthcm/cdk';
import { BaseRequest } from './base-request';

export interface LeaveRequest extends BaseRequest {
  reason: string;
  duration: number;
  fromDate: number;
  toDate: number;
  leaveType: LeaveRequestLeaveType;
  items: unknown[];
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
  processId: string;
  status: number;
  orgId: string;
}
