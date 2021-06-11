import { WorkflowStatus } from './workflow-status';
import { WorkflowTransition } from './workflow-transtition';

export enum WorkflowAPI {
  drawStatus = 'drawStatus',
  drawTransition = 'drawTransition',
  getXML = 'getXML',
  setInitial = 'setInitial',
  removeCell = 'removeCell',
}

export type WorkflowAPIType =
  | { type: WorkflowAPI.drawStatus; value: WorkflowStatus }
  | { type: WorkflowAPI.drawTransition; value: WorkflowTransition }
  | { type: WorkflowAPI.removeCell; value: string }
  | { type: WorkflowAPI.getXML }
  | { type: WorkflowAPI.setInitial };

export interface WorkflowAPIDefinition {
  apiEvent<T extends WorkflowAPIType>(api: T): WorkflowAPIReturn<T>;
}

export type WorkflowAPIReturn<T> = T extends { type: WorkflowAPI.getXML } ? string : void;
