export interface WorkflowTransition {
  id: string;
  name: string;
  fromStateId?: string;
  toStateId: string;
}
