import { UserDto } from "@nexthcm/core";

export interface LevelApprove {
  id?: string;
  leaveType?: LeaveType;
  totalLeave?: number;
  tenantId?: string;
  jobTitle?: string[];
  jobTitleDTOList?: JobTitle[];
  createdUserDTO?: UserDto;

  // Frontend attribute
  jobTitlesName?: string;
}

export interface LeaveType {
  id?: string;
  name: string;
}

export interface JobTitle {
  id?: string;
  name: string;

}

export interface ResLevelApprove {
  code?: string;
  data?: LevelApprove;
}

