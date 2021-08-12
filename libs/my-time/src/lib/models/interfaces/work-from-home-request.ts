import { EmployeeInfo } from '@nexthcm/cdk';
import { BaseRequest } from './base-request';

export interface WorkFromHomeRequest extends BaseRequest {
  fromDate: number;
  toDate: number;
  userId: string;
  userInfo: EmployeeInfo;
  totalDay: number;
}
