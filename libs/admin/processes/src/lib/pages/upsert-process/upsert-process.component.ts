import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PromptService } from '@nexthcm/ui';
import { WorkflowAPI, WorkflowAPIDefinition, WorkflowEvent, WorkflowStatus } from '@nexthcm/workflow-designer';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import * as clone_ from 'rfdc';
import { Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { UpsertStatusDialogComponent } from '../../components/upsert-status-dialog/upsert-status-dialog.component';
import { UpsertTransitionDialogComponent } from '../../components/upsert-transition-dialog/upsert-transition-dialog.component';
import { Process, State, Transition } from '../../models/process';
import { ProcessesService } from '../../services/processes.service';
import { convertTransition } from '../../utils/convert-transition';

const clone = clone_;

@Component({
  selector: 'hcm-upsert-process',
  templateUrl: './upsert-process.component.html',
  styleUrls: ['./upsert-process.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class UpsertProcessComponent {
  @ViewChild('workflowDesigner', { static: true }) workflowDesigner!: WorkflowAPIDefinition;

  processId = this.activatedRoute.snapshot.params.processId;
  form = new FormGroup<Process>({});
  fields: FormlyFieldConfig[] = [
    { key: 'id' },
    {
      className: 'tui-text_h3 tui-form__header tui-form__header_margin-top_none block',
      key: 'name',
      type: 'input-inline',
      templateOptions: {
        translate: true,
        required: true,
        iconTitle: 'Edit name',
      },
    },
    {
      className: 'mt-5 block',
      key: 'description',
      type: 'input',
      templateOptions: {
        translate: true,
        label: 'Description',
      },
    },
  ];
  model: Process = { id: this.processId };
  addedStates: State[] = [];
  addedTransitions: Transition[] = [];
  selectedCell?: State | Transition;
  readonly state$ = this.state.select();
  readonly loading$ = this.state$.pipe(
    startWith(undefined),
    map((value) => !value)
  );
  readonly init$ = new Subject<string>();
  readonly initHandler$ = this.init$.pipe(
    switchMap((id) => this.processesService.getProcess(id)),
    map((res) => res.data),
    tap((data) => {
      this.model = { ...this.model, ...data };
      this.addedStates = data.states || [];
      this.addedTransitions = data.transitions || [];
      if (data.template) {
        this.workflowDesigner.apiEvent({ type: WorkflowAPI.decodeXML, value: data.template });
      } else if (data.states?.length) {
        this.drawInitialState(data.states[0]);
      }
    })
  );

  constructor(
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private activatedRoute: ActivatedRoute,
    private processesService: ProcessesService,
    private state: RxState<Process>,
    private destroy$: TuiDestroyService,
    private promptService: PromptService
  ) {
    this.state.connect(this.initHandler$);
    this.init$.next(this.processId);
  }

  onUpsertStatus(state?: State, isNew = true): void {
    this.dialogService
      .open<State>(new PolymorpheusComponent(UpsertStatusDialogComponent, this.injector), {
        label: isNew ? 'Create New Status' : 'Edit Status',
        data: state,
      })
      .subscribe((state) => {
        const workflowStatus = new WorkflowStatus(state.id, state.name, state.stateType?.color, state.stateType?.color);
        if (isNew) {
          this.addedStates.push(state);
          this.workflowDesigner.apiEvent({
            type: WorkflowAPI.drawStatus,
            value: workflowStatus,
          });
        } else {
          const index = this.addedStates.findIndex((addedState) => addedState.id === state.id);
          if (index !== -1) {
            this.addedStates[index] = state;
            this.selectedCell = state;
            this.workflowDesigner.apiEvent({ type: WorkflowAPI.updateStatus, value: workflowStatus });
          }
        }
      });
  }

  onUpsertTransition(transition?: Transition, isNew = true): void {
    this.dialogService
      .open<Transition>(new PolymorpheusComponent(UpsertTransitionDialogComponent, this.injector), {
        label: isNew ? 'Add Transition' : 'Edit Transition',
        data: { states: this.addedStates, transition, isNew },
      })
      .subscribe((transition) => {
        const workflowTransition = convertTransition(transition);
        if (isNew) {
          this.addedTransitions.push(transition);
          this.workflowDesigner.apiEvent({ type: WorkflowAPI.drawTransition, value: workflowTransition });
        } else {
          const index = this.addedTransitions.findIndex((addedTransition) => addedTransition.id === transition.id);
          if (index !== -1) {
            this.addedTransitions[index] = transition;
            this.selectedCell = transition;
            this.workflowDesigner.apiEvent({ type: WorkflowAPI.updateTransition, value: workflowTransition });
          }
        }
      });
  }

  onWorkflowEvent($event: { event: WorkflowEvent; value?: any }): void {
    switch ($event.event) {
      case WorkflowEvent.onSelectStatus:
        this.selectedCell = this.addedStates.find((state) => state.id === $event.value);
        break;
      case WorkflowEvent.onSelectTransition:
        this.selectedCell = this.addedTransitions.find((state) => state.id === $event.value);
        break;
      case WorkflowEvent.onUnSelectCell:
        this.selectedCell = undefined;
        break;
      case WorkflowEvent.onAddTransition:
        this.onUpsertTransition(
          {
            id: uuidv4(),
            name: '',
            fromStateId: $event.value.sourceId,
            toStateId: $event.value.targetId,
          },
          true
        );
        break;
      case WorkflowEvent.onChangeTransition:
        this.onChangeTransition($event.value);
        break;
      default:
        break;
    }
  }

  onEditCell(): void {
    if (this.selectedCell) {
      if ('toStateId' in this.selectedCell) {
        this.onUpsertTransition(this.selectedCell, false);
      } else {
        this.onUpsertStatus(this.selectedCell, false);
      }
    }
  }

  onRemoveCell(): void {
    if (this.selectedCell) {
      let cellId = '';
      if ('toStateId' in this.selectedCell) {
        cellId = (this.selectedCell as Transition).id;
        this.addedTransitions = this.addedTransitions.filter((transition) => transition.id === cellId);
      } else {
        cellId = (this.selectedCell as State).id;
        this.addedStates = this.addedStates.filter((state) => state.id === cellId);
      }
      this.workflowDesigner.apiEvent({ type: WorkflowAPI.removeCell, value: cellId });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const processModel = this.form.value;
      processModel.states = this.addedStates;
      processModel.transitions = this.addedTransitions;
      processModel.template = this.workflowDesigner.apiEvent({ type: WorkflowAPI.getXML });
      this.processesService.upsertProcess(this.processId, processModel).pipe(takeUntil(this.destroy$)).subscribe();
    }
  }

  private drawInitialState(initialState: State): void {
    const initialTransition: Transition = { id: uuidv4(), name: 'Create', toStateId: initialState.id };
    this.workflowDesigner.apiEvent({ type: WorkflowAPI.setInitial });
    this.workflowDesigner.apiEvent({
      type: WorkflowAPI.drawStatus,
      value: new WorkflowStatus(initialState.id, initialState.name, '#42526e', '#42526e'),
    });
    this.addedTransitions.push(initialTransition);
    this.workflowDesigner.apiEvent({
      type: WorkflowAPI.drawTransition,
      value: convertTransition(initialTransition),
    });
  }

  private onChangeTransition(value: {
    transitionId: string;
    sourceId: string;
    targetId: string;
    previousId: string;
  }): void {
    const currentTransitionIndex = this.addedTransitions.findIndex(
      (transition) => transition.id === value.transitionId
    );
    if (currentTransitionIndex !== -1) {
      let direction = '';
      const newTransition = clone({ proto: true })(this.addedTransitions[currentTransitionIndex]);
      let newStateId = '';
      if (newTransition.fromStateId === value.previousId) {
        // change the source
        direction = 'source';
        newTransition.fromStateId = value.sourceId;
        newStateId = value.sourceId;
      } else if (newTransition.toStateId === value.previousId) {
        // change the destination
        direction = 'destination';
        newTransition.toStateId = value.targetId;
        newStateId = value.targetId;
      }
      const newState = this.addedStates.find((state) => state.id === newStateId);
      if (newState) {
        this.promptService
          .open<boolean>(
            `Are you sure you want to change the ${direction} of '${newTransition.name}' to '${newState.name}'?`
          )
          .subscribe((confirmed) => {
            if (confirmed) {
              this.addedTransitions[currentTransitionIndex] = newTransition;
            } else {
              this.workflowDesigner.apiEvent({ type: WorkflowAPI.removeCell, value: value.transitionId });
              this.workflowDesigner.apiEvent({
                type: WorkflowAPI.drawTransition,
                value: convertTransition(this.addedTransitions[currentTransitionIndex]),
              });
            }
          });
      }
    }
  }
}
