import { BaseObject } from '@nexthcm/cdk';

export interface LeaveType {
  id: string;
  orgId?: string;
  name?: string | undefined;
  description?: string;
  deleted: number;
  createdDate?: string;
  status?: number;
  paidLeave?: boolean;
  createBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
  workflowId?: string;
  process?: BaseObject;
}
