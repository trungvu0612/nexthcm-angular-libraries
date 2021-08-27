import { UserDto } from '@nexthcm/cdk';

export interface LevelApprove {
  id: string;
  leaveType: LeaveType;
  totalLeave: number;
  tenantId?: string;
  jobTitle?: string[];
  jobTitleDTOList: JobTitle[];
  createdUserDTO?: UserDto;
  jobTitlesName?: string;
}

export interface LeaveType {
  id?: string;
  name: string;
}

export interface JobTitle {
  id: string;
  name: string;
}

export interface ResLevelApprove {
  code?: string;
  data?: LevelApprove;
}

