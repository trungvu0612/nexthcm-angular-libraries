import { WorkflowStatus } from '@nexthcm/cdk';

export interface Status extends WorkflowStatus {
  description?: string;
  previousStates?: string[];
  nextStates?: string[];
  allState?: boolean;
}
