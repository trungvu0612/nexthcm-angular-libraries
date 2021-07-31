import { Process } from './process';

export interface LeaveType {
  id?: string;
  orgId?: string;
  name?: string | undefined;
  deleted: number;
  createdDate?: string;
  status?: number;
  createBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
  processId?: string;
  process?: Process;
}

export interface SearchLeaveType {
  name: string;
}
