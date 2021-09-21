import { BaseObject, BaseUser } from '@nexthcm/cdk';

export interface LeaveEntitlement {
  id: string;
  status: boolean | number;
  statusCov?: boolean;
  entitlement: number;
  leaveType?: BaseObject;
  period?: BaseObject;
  employee?: BaseUser;
  employeeId?: string;
  jobTitle?: string[];
  orgId: string | any;
  org?: Org;
  jobTitleDTOList?: BaseObject[];
  fromDate: number;
  toDate: number;
}

export interface Org {
  orgId: string;
  name?: string;
}
