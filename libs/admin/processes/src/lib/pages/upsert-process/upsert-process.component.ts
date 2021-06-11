import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { State, Transition } from '../../models/workflow';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { UpsertStatusDialogComponent } from '../../components/upsert-status-dialog/upsert-status-dialog.component';
import {
  WorkflowAPI,
  WorkflowAPIDefinition,
  WorkflowEvent,
  WorkflowStatus,
  WorkflowTransition,
} from '@nexthcm/workflow-editor';
import { UpsertTransitionDialogComponent } from '../../components/upsert-transition-dialog/upsert-transition-dialog.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'hcm-upsert-process',
  templateUrl: './upsert-process.component.html',
  styleUrls: ['./upsert-process.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertProcessComponent implements AfterViewInit {
  @ViewChild('workflowEditor') workflowEditor!: WorkflowAPIDefinition;

  addedStates: State[] = [];
  addedTransitions: Transition[] = [];
  selectedCell?: State | Transition;

  constructor(private readonly dialogService: TuiDialogService, private readonly injector: Injector) {}

  ngAfterViewInit(): void {
    this.drawInitialState();
  }

  onUpsertStatus(state?: State): void {
    this.dialogService
      .open<State>(new PolymorpheusComponent(UpsertStatusDialogComponent, this.injector), {
        label: state ? 'Edit Status' : 'Create New Status',
        data: state,
      })
      .subscribe((state) => {
        this.addedStates.push(state);
        this.workflowEditor.apiEvent({
          type: WorkflowAPI.drawStatus,
          value: new WorkflowStatus(state.stateValueId, state.name, '#0052cc', '#0052cc'),
        });
      });
  }

  onUpsertTransition(transition?: Transition): void {
    this.dialogService
      .open<Transition>(new PolymorpheusComponent(UpsertTransitionDialogComponent, this.injector), {
        label: transition ? 'Edit Transition' : 'Add Transition',
        data: { states: this.addedStates, transition },
      })
      .subscribe((transition) => {
        this.addedTransitions.push(transition);
        this.workflowEditor.apiEvent({
          type: WorkflowAPI.drawTransition,
          value: new WorkflowTransition(
            transition.transitionValueId,
            transition.name,
            transition.toStateId,
            transition.fromStateId
          ),
        });
      });
  }

  onWorkflowEditorEvent($event: { event: WorkflowEvent; value?: string }): void {
    if ($event.event === WorkflowEvent.onSelectStatus) {
      this.selectedCell = this.addedStates.find((state) => state.stateValueId === $event.value);
    }
    if ($event.event === WorkflowEvent.onSelectTransition) {
      this.selectedCell = this.addedTransitions.find((state) => state.transitionValueId === $event.value);
    }
    if ($event.event === WorkflowEvent.onUnSelectCell) {
      this.selectedCell = undefined;
    }
  }

  onEditCell(): void {
    if (this.selectedCell) {
      if ('stateValueId' in this.selectedCell) {
        this.onUpsertStatus(this.selectedCell);
      }
      if ('transitionValueId' in this.selectedCell) {
        this.onUpsertTransition(this.selectedCell);
      }
    }
  }

  onRemoveCell(): void {
    if (this.selectedCell) {
      let cellId = '';
      if ('stateValueId' in this.selectedCell) {
        cellId = (this.selectedCell as State).stateValueId;
        this.addedStates = this.addedStates.filter((state) => state.stateValueId === cellId);
      }
      if ('transitionValueId' in this.selectedCell) {
        cellId = (this.selectedCell as Transition).transitionValueId;
        this.addedTransitions = this.addedTransitions.filter((transition) => transition.transitionValueId === cellId);
      }
      this.workflowEditor.apiEvent({
        type: WorkflowAPI.removeCell,
        value: cellId,
      });
    }
  }

  private drawInitialState(): void {
    const initialState: State = {
      stateValueId: uuidv4(),
      name: 'OPEN',
      stateTypeId: '8bfb9539-5106-4243-93c3-0a137c3a7e20',
    };
    const initialTransition: Transition = {
      transitionValueId: uuidv4(),
      name: 'Begin',
      toStateId: initialState.stateValueId,
    };
    this.addedStates.push(initialState);
    this.workflowEditor.apiEvent({ type: WorkflowAPI.setInitial });
    this.workflowEditor.apiEvent({
      type: WorkflowAPI.drawStatus,
      value: new WorkflowStatus(initialState.stateValueId, initialState.name, '#42526e', '#42526e'),
    });
    this.addedTransitions.push(initialTransition);
    this.workflowEditor.apiEvent({
      type: WorkflowAPI.drawTransition,
      value: new WorkflowTransition(
        initialTransition.transitionValueId,
        initialTransition.name,
        initialTransition.toStateId
      ),
    });
  }
}
