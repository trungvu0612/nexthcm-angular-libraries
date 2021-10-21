import { EmployeeInfo } from '@nexthcm/cdk';
import { RequestCommentStatus } from '../enums';

export interface RequestComment {
  id: string;
  createdDate: number;
  objectId: string;
  comment: string;
  type: string;
  userInfo: EmployeeInfo;
  state: RequestCommentStatus;
}
