import { CommonStatus } from '@nexthcm/cdk';

export interface LeaveType {
  id: string;
  orgId: string;
  name: string;
  description: string;
  status: CommonStatus;
  paidLeave?: boolean;
  paidLeaveTransfer?: boolean;
  workflowId?: string;
  statusBoolean?: boolean;
}
