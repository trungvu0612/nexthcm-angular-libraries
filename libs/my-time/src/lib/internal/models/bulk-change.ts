import { WorkflowStatus } from '@nexthcm/cdk';

export interface StatusTransition {
  targetStatus: WorkflowStatus;
  requests: { id: string }[];
}

export interface WorkflowStatusTransition {
  name: string | string[];
  data: StatusTransition[];
}

export interface RequestChange {
  id: string;
  request: {
    nextState: string;
  };
}
