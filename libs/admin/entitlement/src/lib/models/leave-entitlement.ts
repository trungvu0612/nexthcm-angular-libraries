

export interface ResLeaveEntitlement {
  code?: string;
  data: LeaveEntitlement;
}

export interface LeaveEntitlement {
  status?: number;
  statusCov?: boolean;
  entitlement?: number
  fromDate?: number;
  toData?: number;
  leaveType?: LeaveType;
  period?: Period;
  employeeId?: string;
  jobTitle?: JobTitle[];
  orgId?: string;
  org?: Org;
  jobTitleDTOList?: JobTitle[];
}

export interface Org {
  orgId?: string;
  name?: string;
}

export interface JobTitle {
  id?: string;
}

export interface LeaveType {
  id?: string;
}

export interface Period {
  id?: string;
}
