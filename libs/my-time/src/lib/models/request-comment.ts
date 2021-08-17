import { EmployeeInfo } from '@nexthcm/cdk';

export interface RequestComment {
  id?: string;
  createdDate?: Date | number;
  objectId?: string;
  comment?: string;
  type?: string;
  userInfo?: EmployeeInfo;
}
