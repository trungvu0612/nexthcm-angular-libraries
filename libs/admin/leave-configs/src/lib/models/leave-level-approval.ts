import { BaseObject } from '@nexthcm/cdk';

export interface LeaveLevelApproval {
  id: string;
  leaveType: BaseObject;
  totalLeave: number;
  tenantId: string;
  jobTitle?: string[];
  jobTitleDTOList: BaseObject[];
}

