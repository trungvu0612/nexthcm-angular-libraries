import { WorkflowTransition } from '@nexthcm/workflow-designer';
import { Transition } from '../models';

export function createWorkflowTransition(transition: Transition): WorkflowTransition {
  return new WorkflowTransition(transition.id, transition.name, transition.toStateId, transition.fromStateId);
}
