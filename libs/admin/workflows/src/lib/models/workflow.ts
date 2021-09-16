import { WorkflowStatusType } from '@nexthcm/cdk';
import { Status } from './status';
import { Transition } from './transition';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  template: string;
  states: Status[];
  transitions: Transition[];
}

export interface InitWorkflow {
  processName: string;
  processDescription: string;
  stateName: string;
  stateDescription?: string;
  stateType: WorkflowStatusType;
  initStatus: Status;
}
