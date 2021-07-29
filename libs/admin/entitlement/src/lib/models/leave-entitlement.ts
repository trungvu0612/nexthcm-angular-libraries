
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
}

export interface Org {
  id?: string;
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
