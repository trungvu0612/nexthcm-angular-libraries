export interface LeaveType {
  id?: string;
  orgId?: string;
  name?: string | undefined;
  deleted: number;
  createdDate?: string;
  createBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

export interface SearchLeaveType {
  name: string;
}
