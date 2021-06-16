export interface Process {
  name: string;
  description: string;
  template: string;
}

export interface State {
  stateValueId: string;
  name: string;
  description?: string;
  previousStates?: string[];
  nextStates?: string[];
  stateTypeId?: string;
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

export interface Transition {
  transitionValueId: string;
  name: string;
  fromStateId?: string;
  toStateId: string;
  activities?: Activity[];
  conditions?: Condition[];
  actions?: Action[];
  description?: string;
}

export interface Workflow {
  id?: string;
  process?: Process;
  states?: State[];
  transitions?: Transition[];
}
