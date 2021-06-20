export enum WorkflowEvent {
  onSelectStatus = 'onSelectStatus',
  onSelectTransition = 'onSelectTransition',
  onDeleteStatus = 'onDeleteStatus',
  onDeleteTransition = 'onDeleteTransition',
  onUnSelectCell = 'onUnSelectCell',
  onAddTransition = 'onAddTransition',
  onChangeTransition = 'onChangeTransition',
}

export type WorkflowEventType =
  | { event: WorkflowEvent.onSelectStatus; value: string }
  | { event: WorkflowEvent.onUnSelectCell }
  | { event: WorkflowEvent.onDeleteStatus; value: string }
  | { event: WorkflowEvent.onSelectTransition; value: string }
  | { event: WorkflowEvent.onDeleteTransition; value: string }
  | { event: WorkflowEvent.onAddTransition; value: { transitionId: string; sourceId: string; targetId: string } }
  | {
      event: WorkflowEvent.onChangeTransition;
      value: { transitionId: string; sourceId: string; targetId: string; previousId: string };
    };
