import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { Process, State, Transition } from '../../models/process';
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
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { Subject } from 'rxjs';
import { ProcessesService } from '../../services/processes.service';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'hcm-upsert-process',
  templateUrl: './upsert-process.component.html',
  styleUrls: ['./upsert-process.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class UpsertProcessComponent {
  @ViewChild('workflowEditor', { static: true }) workflowEditor!: WorkflowAPIDefinition;

  form = new FormGroup<Process>({});
  fields: FormlyFieldConfig[] = [
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
  model: Process = {};
  addedStates: State[] = [];
  addedTransitions: Transition[] = [];
  selectedCell?: State | Transition;
  readonly state$ = this.state.select();
  readonly template$ = this.state.select('template');
  readonly loading$ = this.state$.pipe(map((value) => !value));
  readonly init$ = new Subject<string>();
  readonly initHandler$ = this.init$.pipe(
    switchMap((id) => this.processesService.getProcess(id)),
    map((res) => res.data),
    tap((data) => {
      this.model = { ...this.model, ...data };
      if (!data.template && data.states?.length) {
        this.drawInitialState(data.states[0]);
      }
    })
  );

  constructor(
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private activatedRoute: ActivatedRoute,
    private processesService: ProcessesService,
    private state: RxState<Process>
  ) {
    this.state.connect(this.initHandler$);
    this.init$.next(this.activatedRoute.snapshot.params.processId);
  }

  onUpsertStatus(state?: State, isNew = false): void {
    this.dialogService
      .open<State>(new PolymorpheusComponent(UpsertStatusDialogComponent, this.injector), {
        label: isNew ? 'Create New Status' : 'Edit Status',
        data: state,
      })
      .subscribe((state) => {
        const workflowStatus = new WorkflowStatus(state.id, state.name, state.stateType?.color, state.stateType?.color);
        if (isNew) {
          this.addedStates.push(state);
          this.workflowEditor.apiEvent({
            type: WorkflowAPI.drawStatus,
            value: workflowStatus,
          });
        } else {
          const index = this.addedStates.findIndex((addedState) => addedState.id === state.id);
          if (index !== -1) {
            this.addedStates[index] = state;
            this.workflowEditor.apiEvent({
              type: WorkflowAPI.updateStatus,
              value: workflowStatus,
            });
          }
        }
      });
  }

  onUpsertTransition(transition?: Transition, isNew = false): void {
    this.dialogService
      .open<Transition>(new PolymorpheusComponent(UpsertTransitionDialogComponent, this.injector), {
        label: isNew ? 'Add Transition' : 'Edit Transition',
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

  onWorkflowEvent($event: { event: WorkflowEvent; value?: any }): void {
    switch ($event.event) {
      case WorkflowEvent.onSelectStatus:
        this.selectedCell = this.addedStates.find((state) => state.id === $event.value);
        break;
      case WorkflowEvent.onSelectTransition:
        this.selectedCell = this.addedTransitions.find((state) => state.transitionValueId === $event.value);
        break;
      case WorkflowEvent.onUnSelectCell:
        this.selectedCell = undefined;
        break;
      case WorkflowEvent.onAddTransition:
        this.onUpsertTransition(
          {
            transitionValueId: uuidv4(),
            name: '',
            fromStateId: $event.value.sourceId,
            toStateId: $event.value.targetId,
          },
          true
        );
        break;
      default:
        break;
    }
  }

  onEditCell(): void {
    if (this.selectedCell) {
      if ('id' in this.selectedCell) {
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
      if ('id' in this.selectedCell) {
        cellId = (this.selectedCell as State).id;
        this.addedStates = this.addedStates.filter((state) => state.id === cellId);
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

  private drawInitialState(initialState: State): void {
    const initialTransition: Transition = {
      transitionValueId: uuidv4(),
      name: '',
      toStateId: initialState.id,
    };
    this.addedStates.push(initialState);
    this.workflowEditor.apiEvent({ type: WorkflowAPI.setInitial });
    this.workflowEditor.apiEvent({
      type: WorkflowAPI.drawStatus,
      value: new WorkflowStatus(initialState.id, initialState.name, '#42526e', '#42526e'),
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

  onSubmit(): void {
    if (this.form.valid) {
      const workflowModel = this.form.value;
    }
  }
}
