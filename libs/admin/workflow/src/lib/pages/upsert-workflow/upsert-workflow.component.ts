import { ChangeDetectionStrategy, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService, slice } from '@nexthcm/cdk';
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
import { TransitionDetailDialogComponent } from '../../components/transition-detail-dialog/transition-detail-dialog.component';
import { UpsertStatusDialogComponent } from '../../components/upsert-status-dialog/upsert-status-dialog.component';
import { UpsertTransitionDialogComponent } from '../../components/upsert-transition-dialog/upsert-transition-dialog.component';
import { TransitionOptionIndex } from '../../enums';
import {
  CellType,
  SelectedCell,
  Status,
  Transition,
  TransitionDetailData,
  UpsertTransitionData,
  Workflow,
} from '../../models';
import { AdminWorkflowService } from '../../services/admin-workflow.service';
import { generateWorkflowStatus, generateWorkflowTransition } from '../../utils';

const clone = clone_;

interface WorkflowState {
  addedStatuses: { [p: string]: Status };
  addedTransitions: { [p: string]: Transition };
  selectedCell: SelectedCell | null;
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
  readonly TransitionOptionIndex = TransitionOptionIndex;
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
  readonly selectCell$ = new Subject<SelectedCell | null>();
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
  readonly CellType = CellType;

  constructor(
    private fb: FormBuilder,
    private dialogService: TuiDialogService,
    private injector: Injector,
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
        data: {
          addedStatuses: dictionaryToArray(this.state.get('addedStatuses')),
          transition,
          isNew,
        } as UpsertTransitionData,
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
    const addedStatuses = this.state.get('addedStatuses');
    switch ($event.event) {
      case WorkflowEvent.onSelectStatus:
        this.selectCell$.next({ type: CellType.Status, cell: addedStatuses[$event.value] });
        break;
      case WorkflowEvent.onSelectTransition:
        this.selectCell$.next({ type: CellType.Transition, cell: this.state.get('addedTransitions')[$event.value] });
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
          conditions: [],
          validators: [],
          postFunctions: [],
        });
        break;
      case WorkflowEvent.onChangeTransition:
        this.onChangeTransition($event.value).then();
        break;
      case WorkflowEvent.onEditCell:
        this.onEditCell();
        break;
    }
  }

  onEditCell(): void {
    const selectedCell = this.state.get('selectedCell');

    switch (selectedCell?.type) {
      case CellType.Status:
        this.onEditStatus(selectedCell.cell);
        break;
      case CellType.Transition:
        this.onUpsertTransition(selectedCell.cell, false);
        break;
    }
  }

  onRemoveCell(): void {
    const selectedCell = this.state.get('selectedCell');

    if (selectedCell) {
      if (selectedCell.type === CellType.Transition) {
        this.deleteTransitions$.next([selectedCell.cell.id]);
      } else if (selectedCell.type === CellType.Status) {
        const relatedTransitions = Object.entries(this.state.get('addedTransitions'))
          .filter(
            ([, value]) => value.fromStateId === selectedCell.cell.id || value.toStateId === selectedCell.cell.id
          )
          .map(([key]) => key);
        this.deleteStatus$.next(selectedCell.cell.id);
        this.deleteTransitions$.next(relatedTransitions);
      }
      this.workflowDesigner.apiEvent({ type: WorkflowAPI.removeCell, value: selectedCell.cell.id });
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

  private openUpsertStatusDialog(status: Status): Observable<Status> {
    return this.dialogService.open<Status>(new PolymorpheusComponent(UpsertStatusDialogComponent, this.injector), {
      label: this.translocoService.translate(status.id ? 'editStatus' : 'createNewStatus'),
      data: status,
    });
  }

  onViewTransitionConditions(transition: Transition, index: TransitionOptionIndex): void {
    this.dialogService
      .open(new PolymorpheusComponent(TransitionDetailDialogComponent, this.injector), {
        label: this.translocoService.translate(''),
        data: { index, transition } as TransitionDetailData,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  private drawInitialState(initialState: Status): void {
    const initialTransition: Transition = {
      id: uuidv4(),
      name: 'Create',
      toStateId: initialState.id,
      conditions: [],
      validators: [],
      postFunctions: [],
    };

    this.workflowDesigner.apiEvent({ type: WorkflowAPI.setInitial });
    this.workflowDesigner.apiEvent({
      type: WorkflowAPI.drawStatus,
      value: generateWorkflowStatus(initialState),
    });
    this.upsertTransition$.next(initialTransition);
    this.workflowDesigner.apiEvent({
      type: WorkflowAPI.drawTransition,
      value: generateWorkflowTransition(initialTransition),
    });
  }

  private async onChangeTransition(value: {
    transitionId: string;
    sourceId: string;
    targetId: string;
    previousId: string;
  }): Promise<void> {
    const newTransition = clone({ proto: true })(this.state.get('addedTransitions')[value.transitionId]);
    const addedStatuses = this.state.get('addedStatuses');
    let changeTransitionMessage = '';
    let newStatus: Status | null = null;

    if (newTransition.fromStateId === value.previousId) {
      changeTransitionMessage = 'MESSAGES.changeSourceOfTransition';
      newStatus = addedStatuses[value.sourceId];
      newTransition.fromStateId = value.sourceId;
    } else if (newTransition.toStateId === value.previousId) {
      changeTransitionMessage = 'MESSAGES.changeTargetOfTransition';
      newStatus = addedStatuses[value.targetId];
      newTransition.toStateId = value.targetId;
    }

    if (newStatus) {
      const result = await this.promptService.open({
        icon: 'warning',
        html: this.translocoService.translate(changeTransitionMessage, {
          transition: newTransition.name,
          status: newStatus.name,
        }),
        showCancelButton: true,
      });
      if (result.isConfirmed) {
        this.upsertTransition$.next(newTransition);
      } else {
        this.workflowDesigner.apiEvent({ type: WorkflowAPI.removeCell, value: value.transitionId });
        this.workflowDesigner.apiEvent({
          type: WorkflowAPI.drawTransition,
          value: generateWorkflowTransition(this.state.get('addedTransitions')[value.transitionId]),
        });
      }
    }
  }
}
