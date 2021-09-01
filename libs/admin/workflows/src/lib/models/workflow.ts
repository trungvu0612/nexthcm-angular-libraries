import { Status, StatusType } from './status';
import { Transition } from './transition';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  template: string;
  states: Status[];
  transitions: Transition[];
  removingStates: string[];
  removingTransitions: string[];
}

export interface InitWorkflow {
  processName: string;
  processDescription: string;
  stateName: string;
  stateDescription?: string;
  stateType: StatusType;
  initStatus: Status;
}
