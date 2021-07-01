import { State, Transition } from '../../../../processes/src/lib/models/process';

export interface LeaveType {
  id?: string;
  orgId: string;
  name?: string | undefined;
  deleted: number;
  createdDate?: string;
  status?: number;
  createBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

export interface SearchLeaveType {
  name: string;
}

export interface Process {
  id?: string;
  name?: string;
  description?: string;
  template?: string;
  states?: State[];
  transitions?: Transition[];
  removingStates?: string[];
  removingTransitions?: string[];
}
