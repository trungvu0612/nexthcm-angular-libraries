import { Status } from './status';
import { Transition } from './transtition';

export enum WorkflowAPI {
  drawStatus = 'drawStatus',
  drawTransition = 'drawTransition',
  getXML = 'getXML',
}

export type WorkflowAPIType =
  | { type: WorkflowAPI.drawStatus; value: Status }
  | { type: WorkflowAPI.drawTransition; value: Transition }
  | { type: WorkflowAPI.getXML };

export interface WorkflowAPIDefinition {
  apiEvent<T extends WorkflowAPIType>(api: T): WorkflowAPIReturn<T>;
}

export type WorkflowAPIReturn<T> = T extends { type: WorkflowAPI.getXML } ? string : void;
