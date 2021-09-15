export interface StatusType {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Status {
  id: string;
  name: string;
  stateType: StatusType;
  description?: string;
  previousStates?: string[];
  nextStates?: string[];
  allState?: boolean;
}
