import { BaseObject, UserDto } from '@nexthcm/cdk';

export interface LeaveApprovalLevel {
  id: string;
  leaveType: BaseObject;
  totalLeave: number;
  tenantId?: string;
  jobTitle?: string[];
  jobTitleDTOList: BaseObject[];
  createdUserDTO?: UserDto;
  jobTitlesName?: string;
}

