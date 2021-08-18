import { StatusType } from './status-type';

export interface Status {
  id: string;
  name: string;
  stateType: StatusType;
  description?: string;
  previousStates?: string[];
  nextStates?: string[];
}

export interface Transition {
  id: string;
  name: string;
  fromStateId?: string;
  toStateId: string;
  activities?: Activity[];
  conditions?: Condition[];
  actions?: Action[];
  description?: string;
}

export interface Activity {
  activityValueId: string;
  name: string;
  description: string;
  activityTypeId: string;
}

export interface Condition {
  conditionValueId: string;
  conditionTypeId: string;
  name: string;
  description: string;
}

export interface Action {
  actionValueId: string;
  actionTypeId: string;
  name: string;
  description: string;
}

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
