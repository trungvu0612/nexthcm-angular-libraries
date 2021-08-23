import { WorkflowStatus } from '@nexthcm/workflow-designer';
import { Status } from '../models';

export function generateWorkflowStatus(status: Status): WorkflowStatus {
  return new WorkflowStatus(status.id, status.name, status.stateType.color, status.stateType.color);
}
