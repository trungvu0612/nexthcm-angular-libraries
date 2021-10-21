import { NextWorkflowStatus, WorkflowStatus } from '@nexthcm/cdk';
import { RequestStatus } from '../../enums';

export interface BaseRequest {
  id: string;
  comment: string;
  status: RequestStatus;
  currentState: WorkflowStatus;
  nextStates: NextWorkflowStatus[];
}
