import { BaseObject, EmployeeInfo } from '@nexthcm/cdk';
import { BaseRequest } from './base-request';

export interface WorkingOnsiteRequest extends BaseRequest {
  totalDay: number;
  fromDate: number;
  toDate: number;
  userId: string;
  duration: number;
  userInfo: EmployeeInfo;
  dayWorking: number;
  reason: string;
  officeDTO?: BaseObject;
}
