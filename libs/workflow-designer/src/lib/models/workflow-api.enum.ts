import { WorkflowStatus } from './workflow-status';
import { WorkflowTransition } from './workflow-transtition';

export enum WorkflowAPI {
  drawStatus = 'drawStatus',
  drawTransition = 'drawTransition',
  drawAllStatusesTransition = 'drawAllStatusesTransition',
  getXML = 'getXML',
  setInitial = 'setInitial',
  removeStatus = 'removeStatus',
  removeTransition = 'removeTransition',
  updateStatus = 'updateStatus',
  decodeXML = 'decodeXML',
  updateTransition = 'updateTransition',
  selectCell = 'selectCell',
  zoomIn = 'zoomIn',
  zoomOut = 'zoomOut',
}

export type WorkflowAPIType =
  | { type: WorkflowAPI.drawStatus; value: WorkflowStatus }
  | { type: WorkflowAPI.updateStatus; value: WorkflowStatus }
  | { type: WorkflowAPI.drawTransition; value: WorkflowTransition }
  | { type: WorkflowAPI.drawAllStatusesTransition; value: WorkflowTransition }
  | { type: WorkflowAPI.updateTransition; value: WorkflowTransition }
  | { type: WorkflowAPI.removeStatus; value: string }
  | { type: WorkflowAPI.removeTransition; value: string }
  | { type: WorkflowAPI.getXML }
  | { type: WorkflowAPI.decodeXML; value: string }
  | { type: WorkflowAPI.setInitial }
  | { type: WorkflowAPI.selectCell; value: string }
  | { type: WorkflowAPI.zoomIn }
  | { type: WorkflowAPI.zoomOut };

export interface WorkflowAPIDefinition {
  apiEvent<T extends WorkflowAPIType>(api: T): WorkflowAPIReturn<T>;
}

export type WorkflowAPIReturn<T> = T extends { type: WorkflowAPI.getXML } ? string : void;
