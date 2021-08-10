import { EmployeeInfo } from '@nexthcm/cdk';
import { BaseRequest } from './base-request';

export interface WorkingOutsideRequest extends BaseRequest {
  fromDate: number;
  toDate: number;
  userId: string;
  duration: number;
  userInfo: EmployeeInfo;
  dayWorking: number;
  reason: string;
}
