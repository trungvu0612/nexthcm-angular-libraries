import { EmployeeInfo } from '@nexthcm/cdk';

export interface RequestComment {
  id: string;
  createdDate: number;
  objectId: string;
  comment: string;
  type: string;
  userInfo: EmployeeInfo;
}
