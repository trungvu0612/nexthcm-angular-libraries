import { WorkflowTransition } from '@nexthcm/workflow-designer';
import { Transition } from '../models/process';

export function createWorkflowTransition(transition: Transition): WorkflowTransition {
  return new WorkflowTransition(transition.id, transition.name, transition.toStateId, transition.fromStateId);
}