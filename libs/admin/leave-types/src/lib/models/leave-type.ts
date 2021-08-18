import { Process } from './process';

export interface LeaveType {
  id?: string;
  orgId?: string;
  name?: string | undefined;
  description?: string;
  deleted: number;
  createdDate?: string;
  status?: number;
  createBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
  workflowId?: string;
  process?: Process;
}

export interface SearchLeaveType {
  name: string;
}
