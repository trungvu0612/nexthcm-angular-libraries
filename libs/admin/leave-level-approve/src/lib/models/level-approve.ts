export interface LevelApprove {
  leaveType?: LeaveType;
  totalLeave?: number;
  tenantId?: string;
  jobTitles?: JobTitle[];
}

export interface LeaveType {
  id?: string;
}

export interface JobTitle {
  id?: string;
}
