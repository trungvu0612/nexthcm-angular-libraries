import { WorkflowTransition } from './workflow-transition';

export interface WorkflowStatusType {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface WorkflowStatus<T extends WorkflowStatusType = WorkflowStatusType> {
  id: string;
  name: string;
  stateType: T;
}

export interface NextWorkflowStatus {
  transition: WorkflowTransition;
}
