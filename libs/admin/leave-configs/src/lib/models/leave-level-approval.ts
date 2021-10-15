import { BaseObject } from '@nexthcm/cdk';

export interface LeaveLevelApproval {
  id: string;
  leaveTypes: BaseObject[];
  totalLeave: number;
  tenantId: string;
  jobTitle?: string[];
  jobTitleDTOList: BaseObject[];
}

