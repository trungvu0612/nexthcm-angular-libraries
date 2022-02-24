import { WorkflowStatus, WorkflowTransition } from '@nexthcm/workflow-designer';

import { Status, Transition } from '../models';

export class AdminWorkflowsUtils {
  static generateWorkflowStatus(status: Status): WorkflowStatus {
    return new WorkflowStatus(status.id, status.name, status.stateType.color, status.stateType.color);
  }

  static generateWorkflowTransition(transition: Transition): WorkflowTransition {
    return new WorkflowTransition(
      transition.id,
      transition.name,
      transition.toStateId,
      transition.fromStateId,
      transition.allState
    );
  }

  static isAllStatuesTransition(transition: Transition, status: Status): boolean {
    return !!(transition.allState && transition.toStateId === status.id && !transition.fromStateId);
  }
}
