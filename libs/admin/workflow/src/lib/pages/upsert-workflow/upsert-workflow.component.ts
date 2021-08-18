import { ChangeDetectionStrategy, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService } from '@nexthcm/cdk';
import {
  WorkflowAPI,
  WorkflowAPIDefinition,
  WorkflowEvent,
  WorkflowEventType,
  WorkflowStatus,
} from '@nexthcm/workflow-designer';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { deleteProp, dictionaryToArray, patch, RxState, setProp, toDictionary } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import * as clone_ from 'rfdc';
import { Observable, of, Subject } from 'rxjs';
import { filter, map, share, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { UpsertStatusDialogComponent } from '../../components/upsert-status-dialog/upsert-status-dialog.component';
import { UpsertTransitionDialogComponent } from '../../components/upsert-transition-dialog/upsert-transition-dialog.component';
import { Status, Transition, Workflow } from '../../models';
import { AdminWorkflowService } from '../../services/admin-workflow.service';
import { generateWorkflowTransition } from '../../utils/generate-workflow-transition';
import { slice } from '../../utils/slice';

const clone = clone_;

interface WorkflowState {
  addedStatuses: { [p: string]: Status };
  addedTransitions: { [p: string]: Transition };
  selectedCell: Status | Transition | null;
}

@Component({
  selector: 'hcm-upsert-workflow',
  templateUrl: './upsert-workflow.component.html',
  styleUrls: ['./upsert-workflow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class UpsertWorkflowComponent implements OnInit {
  @ViewChild('workflowDesigner', { static: true }) workflowDesigner!: WorkflowAPIDefinition;

  readonly workflowId = this.activatedRoute.snapshot.params.workflowId as string;
  readonly editMode = this.activatedRoute.snapshot.data.edit as boolean;
  form = this.fb.group<Workflow>({
    removingStates: new Array<string>(),
    removingTransitions: new Array<string>(),
  } as Workflow);
  model = {} as Workflow;
  fields: FormlyFieldConfig[] = [
    { key: 'id', defaultValue: this.workflowId },
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
        'templateOptions.iconTitle': this.translocoService.selectTranslate('editName'),
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
  readonly selectCell$ = new Subject<Status | Transition | null>();
  readonly workflowId$ = new Subject<string>();
  readonly upsertStatus$ = new Subject<Status>();
  readonly upsertTransition$ = new Subject<Transition>();
  readonly deleteStatus$ = new Subject<string>();
  readonly deleteTransitions$ = new Subject<string[]>();
  readonly selectedCell$ = this.state.select('selectedCell');
  readonly addedStatuses$ = this.state.select('addedStatuses').pipe(map((data) => dictionaryToArray(data)));
  readonly state$ = this.state.select();
  private readonly request$ = this.workflowId$.pipe(
    switchMap((id) => this.workflowService.getWorkflow(id).pipe(startWith(null))),
    share()
  );
  readonly initHandler$ = this.request$.pipe(filter(isPresent));
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    private fb: FormBuilder,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private activatedRoute: ActivatedRoute,
    private workflowService: AdminWorkflowService,
    private state: RxState<WorkflowState>,
    private destroy$: TuiDestroyService,
    private router: Router,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    state.connect('addedStatuses', this.initHandler$, (_, data) => toDictionary(data.states, 'id'));
    state.connect('addedTransitions', this.initHandler$, (_, data) => toDictionary(data.transitions, 'id'));
    state.connect('selectedCell', this.selectCell$);
    state.connect(this.upsertStatus$, (state, status) =>
      setProp(state, 'addedStatuses', patch(state.addedStatuses, { [status.id]: status }))
    );
    state.connect(this.upsertTransition$, (state, transition) =>
      setProp(state, 'addedTransitions', patch(state.addedTransitions, { [transition.id]: transition }))
    );
    state.connect(
      this.deleteStatus$.pipe(
        tap((status) => this.form.controls.removingStates.setValue(this.form.value.removingStates.concat(status)))
      ),
      (state, status) => setProp(state, 'addedStatuses', deleteProp(state.addedStatuses, status))
    );
    state.connect(
      this.deleteTransitions$.pipe(
        tap((transition) =>
          this.form.controls.removingTransitions.setValue(this.form.value.removingTransitions.concat(transition))
        )
      ),
      (state, transitions) =>
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
  }

  ngOnInit(): void {
    this.workflowId$.next(this.workflowId);
  }

  onEditStatus(data: Status): void {
    this.openUpsertStatusDialog(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.workflowDesigner.apiEvent({
          type: WorkflowAPI.updateStatus,
          value: new WorkflowStatus(state.id, state.name, state.stateType.color, state.stateType.color),
        });
        this.upsertStatus$.next(state);
      });
  }

  onUpsertTransition(transition?: Transition, isNew = true): void {
    this.dialogService
      .open<Transition>(new PolymorpheusComponent(UpsertTransitionDialogComponent, this.injector), {
        label: this.translocoService.translate(isNew ? 'createNewTransition' : 'editTransition'),
        data: { states: dictionaryToArray(this.state.get('addedStatuses')), transition, isNew },
      })
      .subscribe((transition) => {
        this.workflowDesigner.apiEvent({
          type: isNew ? WorkflowAPI.drawTransition : WorkflowAPI.updateTransition,
          value: generateWorkflowTransition(transition),
        });
        this.upsertTransition$.next(transition);
      });
  }

  onWorkflowEvent($event: WorkflowEventType): void {
    switch ($event.event) {
      case WorkflowEvent.onSelectStatus:
        this.selectCell$.next(this.state.get('addedStatuses')[$event.value]);
        break;
      case WorkflowEvent.onSelectTransition:
        this.selectCell$.next(this.state.get('addedTransitions')[$event.value]);
        break;
      case WorkflowEvent.onUnSelectCell:
        this.selectCell$.next(null);
        break;
      case WorkflowEvent.onAddTransition:
        this.onUpsertTransition({
          id: uuidv4(),
          name: '',
          fromStateId: $event.value.sourceId,
          toStateId: $event.value.targetId,
        });
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
        this.onEditStatus(selectedCell);
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
        cellId = (selectedCell as Status).id;
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
      const processModel = { ...this.form.value };

      processModel.states = dictionaryToArray(this.state.get('addedStatuses'));
      processModel.transitions = dictionaryToArray(this.state.get('addedTransitions'));
      processModel.template = this.workflowDesigner.apiEvent({ type: WorkflowAPI.getXML });
      this.workflowService
        .upsertWorkflow(this.workflowId, processModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.promptService.handleResponse('updateWorkflowSuccessfully'));
    }
  }

  onAddStatus(status: Status): void {
    (status.id ? of(status) : this.openUpsertStatusDialog(status)).pipe(takeUntil(this.destroy$)).subscribe((state) => {
      this.workflowDesigner.apiEvent({
        type: WorkflowAPI.drawStatus,
        value: new WorkflowStatus(state.id, state.name, state.stateType.color, state.stateType.color),
      });
      this.upsertStatus$.next(state);
    });
  }

  private openUpsertStatusDialog(status: Status): Observable<Status> {
    return this.dialogService.open<Status>(new PolymorpheusComponent(UpsertStatusDialogComponent, this.injector), {
      label: this.translocoService.translate(status.id ? 'editStatus' : 'createNewStatus'),
      data: status,
    });
  }

  private drawInitialState(initialState: Status): void {
    const initialTransition: Transition = { id: uuidv4(), name: 'Create', toStateId: initialState.id };

    this.workflowDesigner.apiEvent({ type: WorkflowAPI.setInitial });
    this.workflowDesigner.apiEvent({
      type: WorkflowAPI.drawStatus,
      value: new WorkflowStatus(initialState.id, initialState.name, '#42526e', '#42526e'),
    });
    this.upsertTransition$.next(initialTransition);
    this.workflowDesigner.apiEvent({
      type: WorkflowAPI.drawTransition,
      value: generateWorkflowTransition(initialTransition),
    });
  }

  private onChangeTransition(value: {
    transitionId: string;
    sourceId: string;
    targetId: string;
    previousId: string;
  }): void {
    let direction = '';
    let newStatusId = '';
    const newTransition = clone({ proto: true })(this.state.get('addedTransitions')[value.transitionId]);

    if (newTransition.fromStateId === value.previousId) {
      direction = 'MESSAGES.changeSourceOfTransition';
      newTransition.fromStateId = value.sourceId;
      newStatusId = value.sourceId;
    } else if (newTransition.toStateId === value.previousId) {
      direction = 'MESSAGES.changeTargetOfTransition';
      newTransition.toStateId = value.targetId;
      newStatusId = value.targetId;
    }
    const nextStatus = this.state.get('addedStatuses')[newStatusId];

    if (nextStatus) {
      this.promptService
        .open({
          icon: 'warning',
          html: this.translocoService.translate(direction, { transition: newTransition.name, status: nextStatus.name }),
          showCancelButton: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.upsertTransition$.next(newTransition);
          } else {
            this.workflowDesigner.apiEvent({ type: WorkflowAPI.removeCell, value: value.transitionId });
            this.workflowDesigner.apiEvent({
              type: WorkflowAPI.drawTransition,
              value: generateWorkflowTransition(this.state.get('addedTransitions')[value.transitionId]),
            });
          }
        });
    }
  }
}
