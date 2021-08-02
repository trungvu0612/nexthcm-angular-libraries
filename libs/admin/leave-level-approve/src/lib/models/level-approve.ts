export interface LevelApprove {
  leaveType?: LeaveType;
  totalLeave?: number;
  tenantId?: string;
  jobTitles?: JobTitle[];
  jobTitleDTOList?: JobTitle[];
}

export interface LeaveType {
  id?: string;
}

export interface JobTitle {
  id?: string;
}

export interface ResLevelApprove {
  code?: string;
  data?: LevelApprove;
}

