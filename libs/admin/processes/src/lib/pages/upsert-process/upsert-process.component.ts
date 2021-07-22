import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService } from '@nexthcm/ui';
import {
  WorkflowAPI,
  WorkflowAPIDefinition,
  WorkflowEvent,
  WorkflowEventType,
  WorkflowStatus,
} from '@nexthcm/workflow-designer';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { deleteProp, dictionaryToArray, patch, RxState, setProp, stateful, toDictionary } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import * as clone_ from 'rfdc';
import { of, Subject } from 'rxjs';
import { catchError, filter, map, mapTo, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { UpsertStatusDialogComponent } from '../../components/upsert-status-dialog/upsert-status-dialog.component';
import { UpsertTransitionDialogComponent } from '../../components/upsert-transition-dialog/upsert-transition-dialog.component';
import { Process, State, Transition } from '../../models/process';
import { ProcessesService } from '../../services/processes.service';
import { createWorkflowTransition } from '../../utils/create-workflow-transition';
import { slice } from '../../utils/slice';

const clone = clone_;

interface ProcessState {
  addedStates: { [p: string]: State };
  addedTransitions: { [p: string]: Transition };
  selectedCell: State | Transition | null;
}

@Component({
  selector: 'hcm-upsert-process',
  templateUrl: './upsert-process.component.html',
  styleUrls: ['./upsert-process.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class UpsertProcessComponent implements AfterViewInit {
  @ViewChild('workflowDesigner') workflowDesigner!: WorkflowAPIDefinition;

  processId: string = this.activatedRoute.snapshot.params.processId;
  editMode: boolean = this.activatedRoute.snapshot.data.edit;
  form: FormGroup<Process> = this.fb.group({ removingStates: [], removingTransitions: [] });
  fields: FormlyFieldConfig[] = [
    { key: 'id' },
    {
      className: 'tui-text_h3 tui-form__header tui-form__header_margin-top_none block',
      key: 'name',
      type: 'input-inline',
      templateOptions: {
        translate: true,
        required: true,
        disabled: !this.editMode,
      },
      expressionProperties: {
        'templateOptions.iconTitle': this.translocoService.selectTranslate('ADMIN_PROCESSES.editName'),
      },
    },
    {
      className: 'mt-5 block',
      key: 'description',
      type: 'input',
      templateOptions: {
        translate: true,
        label: 'description',
        disabled: !this.editMode,
      },
    },
  ];
  model: Process = { id: this.processId };
  readonly selectCell$ = new Subject<State | Transition | null>();
  readonly init$ = new Subject<string>();
  readonly upsertStatus$ = new Subject<State>();
  readonly upsertTransition$ = new Subject<Transition>();
  readonly deleteStatus$ = new Subject<string>();
  readonly deleteTransitions$ = new Subject<string[]>();
  readonly initHandler$ = this.init$.pipe(
    stateful(
      switchMap((id) => this.processesService.getProcess(id)),
      map((res) => res.data)
    )
  );
  readonly state$ = this.state.select();
  readonly loading$ = this.state.$.pipe(
    startWith(undefined),
    map((value) => !value)
  );
  readonly selectedCell$ = this.state.select('selectedCell');

  constructor(
    private fb: FormBuilder,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private activatedRoute: ActivatedRoute,
    private processesService: ProcessesService,
    private state: RxState<ProcessState>,
    private destroy$: TuiDestroyService,
    private router: Router,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    state.connect(
      'addedStates',
      this.initHandler$.pipe(
        map((data) => data.states),
        filter(isPresent)
      ),
      (_, states) => toDictionary(states, 'id')
    );
    state.connect(
      'addedTransitions',
      this.initHandler$.pipe(
        map((data) => data.transitions),
        filter(isPresent)
      ),
      (_, transitions) => toDictionary(transitions, 'id')
    );
    state.connect('selectedCell', this.selectCell$);
    state.connect(this.upsertStatus$, (state, status) =>
      setProp(state, 'addedStates', patch(state.addedStates, { [status.id]: status }))
    );
    state.connect(this.upsertTransition$, (state, transition) =>
      setProp(state, 'addedTransitions', patch(state.addedTransitions, { [transition.id]: transition }))
    );
    state.connect(this.deleteStatus$, (state, status) =>
      setProp(state, 'addedStates', deleteProp(state.addedStates, status))
    );
    state.connect(this.deleteTransitions$, (state, transitions) =>
      setProp(
        state,
        'addedTransitions',
        slice(
          state.addedTransitions,
          Object.keys(state.addedTransitions).filter((key) => !transitions.includes(key))
        )
      )
    );
    state.hold(this.initHandler$, (data) => {
      this.model = { ...this.model, ...data };
      if (data.template) {
        this.workflowDesigner.apiEvent({ type: WorkflowAPI.decodeXML, value: data.template });
      } else if (data.states?.length) {
        this.drawInitialState(data.states[0]);
      }
    });
    state.hold(this.deleteStatus$, (status) =>
      this.form.controls.removingStates?.setValue((this.form.value.removingStates || []).concat(status))
    );
    state.hold(this.deleteTransitions$, (transitions) =>
      this.form.controls.removingTransitions?.setValue((this.form.value.removingTransitions || []).concat(transitions))
    );
  }

  ngAfterViewInit(): void {
    this.init$.next(this.processId);
  }

  onUpsertStatus(state?: State, isNew = true): void {
    this.dialogService
      .open<State>(new PolymorpheusComponent(UpsertStatusDialogComponent, this.injector), {
        label: this.translocoService.translate(
          isNew ? 'ADMIN_PROCESSES.createNewStatus' : 'ADMIN_PROCESSES.editStatus'
        ),
        data: state,
      })
      .subscribe((state) => {
        const workflowStatus = new WorkflowStatus(state.id, state.name, state.stateType?.color, state.stateType?.color);
        if (isNew) {
          this.workflowDesigner.apiEvent({ type: WorkflowAPI.drawStatus, value: workflowStatus });
        } else {
          this.selectCell$.next(state);
          this.workflowDesigner.apiEvent({ type: WorkflowAPI.updateStatus, value: workflowStatus });
        }
        this.upsertStatus$.next(state);
      });
  }

  onUpsertTransition(transition?: Transition, isNew = true): void {
    this.dialogService
      .open<Transition>(new PolymorpheusComponent(UpsertTransitionDialogComponent, this.injector), {
        label: this.translocoService.translate(
          isNew ? 'ADMIN_PROCESSES.createNewTransition' : 'ADMIN_PROCESSES.editTransition'
        ),
        data: { states: dictionaryToArray(this.state.get('addedStates')), transition, isNew },
      })
      .subscribe((transition) => {
        const workflowTransition = createWorkflowTransition(transition);
        if (isNew) {
          this.workflowDesigner.apiEvent({ type: WorkflowAPI.drawTransition, value: workflowTransition });
        } else {
          this.selectCell$.next(transition);
          this.workflowDesigner.apiEvent({ type: WorkflowAPI.updateTransition, value: workflowTransition });
        }
        this.upsertTransition$.next(transition);
      });
  }

  onWorkflowEvent($event: WorkflowEventType): void {
    switch ($event.event) {
      case WorkflowEvent.onSelectStatus:
        this.selectCell$.next(this.state.get('addedStates')[$event.value]);
        break;
      case WorkflowEvent.onSelectTransition:
        this.selectCell$.next(this.state.get('addedTransitions')[$event.value]);
        break;
      case WorkflowEvent.onUnSelectCell:
        this.selectCell$.next(null);
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
      case WorkflowEvent.onEditCell:
        this.onEditCell();
        break;
      default:
        break;
    }
  }

  onEditCell(): void {
    const selectedCell = this.state.get('selectedCell');
    if (selectedCell) {
      if ('toStateId' in selectedCell) {
        this.onUpsertTransition(selectedCell, false);
      } else {
        this.onUpsertStatus(selectedCell, false);
      }
    }
  }

  onRemoveCell(): void {
    const selectedCell = this.state.get('selectedCell');
    if (selectedCell) {
      let cellId: string;
      if ('toStateId' in selectedCell) {
        cellId = (selectedCell as Transition).id;
        this.deleteTransitions$.next([cellId]);
      } else {
        cellId = (selectedCell as State).id;
        const relatedTransitions = Object.entries(this.state.get('addedTransitions'))
          .filter(([, value]) => value.fromStateId === cellId || value.toStateId === cellId)
          .map(([key]) => key);
        this.deleteStatus$.next(cellId);
        this.deleteTransitions$.next(relatedTransitions);
      }
      this.workflowDesigner.apiEvent({ type: WorkflowAPI.removeCell, value: cellId });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const processModel = this.form.value;
      processModel.states = dictionaryToArray(this.state.get('addedStates'));
      processModel.transitions = dictionaryToArray(this.state.get('addedTransitions'));
      processModel.template = this.workflowDesigner.apiEvent({ type: WorkflowAPI.getXML });
      this.processesService
        .upsertProcess(this.processId, processModel)
        .pipe(
          mapTo({ icon: 'success', text: 'Updating this process successfully!' } as SweetAlertOptions),
          takeUntil(this.destroy$),
          catchError((err) =>
            of({
              icon: 'error',
              text: err.error.message,
              showCancelButton: true,
              showConfirmButton: false,
            } as SweetAlertOptions)
          ),
          switchMap((options) => this.promptService.open(options)),
          filter((result) => result.isConfirmed),
          takeUntil(this.destroy$)
        )
        .subscribe(() => this.router.navigate(['../..'], { relativeTo: this.activatedRoute }));
    }
  }

  private drawInitialState(initialState: State): void {
    const initialTransition: Transition = { id: uuidv4(), name: 'Create', toStateId: initialState.id };
    this.workflowDesigner.apiEvent({ type: WorkflowAPI.setInitial });
    this.workflowDesigner.apiEvent({
      type: WorkflowAPI.drawStatus,
      value: new WorkflowStatus(initialState.id, initialState.name, '#42526e', '#42526e'),
    });
    this.upsertTransition$.next(initialTransition);
    this.workflowDesigner.apiEvent({
      type: WorkflowAPI.drawTransition,
      value: createWorkflowTransition(initialTransition),
    });
  }

  private onChangeTransition(value: {
    transitionId: string;
    sourceId: string;
    targetId: string;
    previousId: string;
  }): void {
    let direction = '';
    const newTransition = clone({ proto: true })(this.state.get('addedTransitions')[value.transitionId]);
    let newStatusId = '';
    if (newTransition.fromStateId === value.previousId) {
      direction = 'ADMIN_PROCESSES.MESSAGES.changeSourceOfTransition';
      newTransition.fromStateId = value.sourceId;
      newStatusId = value.sourceId;
    } else if (newTransition.toStateId === value.previousId) {
      direction = 'ADMIN_PROCESSES.MESSAGES.changeTargetOfTransition';
      newTransition.toStateId = value.targetId;
      newStatusId = value.targetId;
    }
    const nextStatus = this.state.get('addedStates')[newStatusId];
    if (nextStatus) {
      this.promptService
        .open({
          icon: 'warning',
          text: this.translocoService.translate(direction, { transition: newTransition.name, status: nextStatus.name }),
          showCancelButton: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.upsertTransition$.next(newTransition);
          } else {
            this.workflowDesigner.apiEvent({ type: WorkflowAPI.removeCell, value: value.transitionId });
            this.workflowDesigner.apiEvent({
              type: WorkflowAPI.drawTransition,
              value: createWorkflowTransition(this.state.get('addedTransitions')[value.transitionId]),
            });
          }
        });
    }
  }
}
