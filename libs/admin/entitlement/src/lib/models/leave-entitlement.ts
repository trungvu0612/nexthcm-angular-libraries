export interface LeaveEntitlement {
  id: string;
  status: boolean | number;
  statusCov?: boolean;
  entitlement: number;
  leaveType?: LeaveType;
  period?: Period;
  employeeId?: string;
  jobTitle?: string[];
  orgId: string;
  org?: Org;
  jobTitleDTOList?: JobTitle[];
  fromDate: number;
  toDate: number;
}

export interface Org {
  orgId: string;
  name?: string;
}

export interface JobTitle {
  id: string;
}

export interface LeaveType {
  id: string;
  name: string;
}

export interface Period {
  id: string;
  name: string;
}
