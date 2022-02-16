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
import { deleteProp, dictionaryToArray, patch, setProp, slice, toDictionary } from '@rx-angular/cdk/transformations';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import clone from 'rfdc';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
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
import { AddStatusData } from '../../models/add-status-data';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';
import { TRANSLATION_SCOPE } from '../../translation-scope';
import { AdminWorkflowsUtils } from '../../utils/admin-workflows-utils';

interface WorkflowState {
  addedStatuses: Record<string, Status>;
  addedTransitions: Record<string, Transition>;
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
  form = this.fb.group<Workflow>({} as Workflow);
  model = {} as Workflow;
  fields: FormlyFieldConfig[] = [
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
        'templateOptions.iconTitle': this.translocoService.selectTranslate('editName', {}, TRANSLATION_SCOPE),
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
    { key: 'id', defaultValue: this.workflowId },
  ];
  readonly selectedCell$ = new BehaviorSubject<SelectedCell | null>(null);
  readonly workflowId$ = new Subject<string>();
  readonly upsertStatus$ = new Subject<Status>();
  readonly upsertTransition$ = new Subject<Transition>();
  readonly deleteStatus$ = new Subject<string>();
  readonly deleteTransitions$ = new Subject<string[]>();
  readonly addedStatuses$ = this.state.select('addedStatuses').pipe(map((data) => dictionaryToArray(data)));
  readonly publishWorkflow$ = new Subject<Workflow>();
  readonly publishWorkflowHandler$ = this.publishWorkflow$.pipe(
    switchMap((payload) => this.workflowService.upsertWorkflow(this.workflowId, payload).pipe(startWith(null))),
    share()
  );
  readonly publishingWorkflow$ = this.publishWorkflowHandler$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );
  readonly state$ = this.state.select();
  readonly CellType = CellType;
  private readonly request$ = this.workflowId$.pipe(
    switchMap((id) => this.workflowService.getWorkflow(id).pipe(startWith(null))),
    share()
  );
  readonly initHandler$ = this.request$.pipe(filter(isPresent));
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly activatedRoute: ActivatedRoute,
    private readonly workflowService: AdminWorkflowsService,
    private readonly state: RxState<WorkflowState>,
    private readonly destroy$: TuiDestroyService,
    private readonly router: Router,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService
  ) {
    state.connect('addedStatuses', this.initHandler$, (_, data) => toDictionary(data.states, 'id'));
    state.connect('addedTransitions', this.initHandler$, (_, data) => toDictionary(data.transitions, 'id'));
    state.connect(this.upsertStatus$, (state, status) =>
      setProp(state, 'addedStatuses', patch(state.addedStatuses, { [status.id]: status }))
    );
    state.connect(this.upsertTransition$, (state, transition) =>
      setProp(state, 'addedTransitions', patch(state.addedTransitions, { [transition.id]: transition }))
    );
    state.connect(this.deleteStatus$, (state, status) =>
      setProp(state, 'addedStatuses', deleteProp(state.addedStatuses, status))
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
    state.hold(this.publishWorkflowHandler$);
  }

  get addedStatuses(): Record<string, Status> {
    return this.state.get('addedStatuses');
  }

  get addedTransitions(): Record<string, Transition> {
    return this.state.get('addedTransitions');
  }

  get selectedCell(): SelectedCell | null {
    return this.selectedCell$.value;
  }

  ngOnInit(): void {
    this.workflowId$.next(this.workflowId);
  }

  onAddStatus(data: AddStatusData): void {
    (data.status.id ? of(data.status) : this.openUpsertStatusDialog(data.status))
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.upsertStatus$.next(status);
        this.workflowDesigner.apiEvent({
          type: WorkflowAPI.drawStatus,
          value: new WorkflowStatus(status.id, status.name, status.stateType.color, status.stateType.color),
        });
        if (data.allowAll) {
          this.drawAllStatusesTransition(status);
        }
      });
  }

  onEditStatus(data: Status): void {
    this.openUpsertStatusDialog(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.upsertStatus$.next(status);
        this.workflowDesigner.apiEvent({
          type: WorkflowAPI.updateStatus,
          value: AdminWorkflowsUtils.generateWorkflowStatus(status),
        });
      });
  }

  onUpsertTransition(transition?: Transition, isNew = true): void {
    this.dialogService
      .open<Transition>(new PolymorpheusComponent(UpsertTransitionDialogComponent, this.injector), {
        label: this.translocoService.translate(isNew ? 'WORKFLOW.createNewTransition' : 'WORKFLOW.editTransition'),
        data: {
          addedStatuses: dictionaryToArray(this.addedStatuses),
          transition,
          isNew,
        } as UpsertTransitionData,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((transition) => {
        this.upsertTransition$.next(transition);
        this.workflowDesigner.apiEvent({
          type: isNew ? WorkflowAPI.drawTransition : WorkflowAPI.updateTransition,
          value: AdminWorkflowsUtils.generateWorkflowTransition(transition),
        });
      });
  }

  onWorkflowEvent($event: WorkflowEventType): void {
    switch ($event.event) {
      case WorkflowEvent.onSelectStatus:
        if (this.addedStatuses[$event.value]) {
          this.selectedCell$.next({ type: CellType.Status, cell: this.addedStatuses[$event.value] });
        }
        break;
      case WorkflowEvent.onSelectTransition:
        if (this.addedTransitions[$event.value]) {
          this.selectedCell$.next({ type: CellType.Transition, cell: this.addedTransitions[$event.value] });
        }
        break;
      case WorkflowEvent.onUnSelectCell:
        this.selectedCell$.next(null);
        break;
      case WorkflowEvent.onAddTransition:
        this.onUpsertTransition({
          id: uuidv4(),
          name: '',
          fromStateId: $event.value.sourceId,
          toStateId: $event.value.targetId,
          conditionOperator: 'AND',
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
    switch (this.selectedCell?.type) {
      case CellType.Status:
        this.onEditStatus(this.selectedCell.cell);
        break;
      case CellType.Transition:
        this.onUpsertTransition(this.selectedCell.cell, false);
        break;
    }
  }

  onRemoveCell(): void {
    if (this.selectedCell$.value) {
      const cellId = this.selectedCell$.value.cell.id;

      if (this.selectedCell$.value.type === CellType.Transition) {
        this.handleRemoveTransition(cellId);
      } else if (this.selectedCell$.value.type === CellType.Status) {
        this.handleRemoveStatus(cellId);
      }
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const processModel = { ...this.form.value };

      processModel.states = dictionaryToArray(this.addedStatuses);
      processModel.transitions = dictionaryToArray(this.state.get('addedTransitions'));
      processModel.template = this.workflowDesigner.apiEvent({ type: WorkflowAPI.getXML });
      this.publishWorkflow$.next(processModel);
    }
  }

  onViewTransitionOptions(transition: Transition, index: TransitionOptionIndex): void {
    this.dialogService
      .open(new PolymorpheusComponent(TransitionDetailDialogComponent, this.injector), {
        size: 'l',
        label: `${this.translocoService.translate('WORKFLOW.transition')}: ${transition.name}`,
        data: { index, transition } as TransitionDetailData,
        required: true,
      })
      .pipe(
        catchError(() => of(null)),
        takeUntil(this.destroy$)
      )
      .subscribe(() =>
        this.selectedCell$.next({
          type: CellType.Transition,
          cell: this.addedTransitions[(this.selectedCell$.value as SelectedCell).cell.id],
        })
      );
  }

  onAllowAllStatus(allowAllStatus: boolean, status: Status): void {
    status.allState = allowAllStatus;
    this.upsertStatus$.next(status);
    if (allowAllStatus) {
      this.drawAllStatusesTransition(status);
    } else {
      const allStatusesTransitionId = Object.keys(this.addedTransitions).find((transitionId) =>
        AdminWorkflowsUtils.isAllStatuesTransition(this.addedTransitions[transitionId], status)
      );

      if (allStatusesTransitionId) {
        this.handleRemoveTransition(allStatusesTransitionId);
      }
    }
    this.workflowDesigner.apiEvent({ type: WorkflowAPI.selectCell, value: status.id });
  }

  private drawAllStatusesTransition(status: Status): void {
    const transitionAll: Transition = {
      id: uuidv4(),
      name: status.name,
      toStateId: status.id,
      conditionOperator: 'AND',
      conditions: [],
      validators: [],
      postFunctions: [],
      allState: true,
    };
    this.upsertTransition$.next(transitionAll);
    this.workflowDesigner.apiEvent({
      type: WorkflowAPI.drawAllStatusesTransition,
      value: AdminWorkflowsUtils.generateWorkflowTransition(transitionAll),
    });
  }

  private openUpsertStatusDialog(status: Status): Observable<Status> {
    return this.dialogService.open<Status>(new PolymorpheusComponent(UpsertStatusDialogComponent, this.injector), {
      label: this.translocoService.translate(status.id ? 'WORKFLOW.editStatus' : 'WORKFLOW.createNewStatus'),
      data: status,
    });
  }

  private drawInitialState(initialState: Status): void {
    const initialTransition: Transition = {
      id: uuidv4(),
      name: 'Create',
      toStateId: initialState.id,
      conditionOperator: 'AND',
      conditions: [],
      validators: [],
      postFunctions: [],
    };

    this.workflowDesigner.apiEvent({ type: WorkflowAPI.setInitial });
    this.workflowDesigner.apiEvent({
      type: WorkflowAPI.drawStatus,
      value: AdminWorkflowsUtils.generateWorkflowStatus(initialState),
    });
    this.upsertTransition$.next(initialTransition);
    this.workflowDesigner.apiEvent({
      type: WorkflowAPI.drawTransition,
      value: AdminWorkflowsUtils.generateWorkflowTransition(initialTransition),
    });
  }

  private async onChangeTransition(value: {
    transitionId: string;
    sourceId: string;
    targetId: string;
    previousId: string;
  }): Promise<void> {
    const newTransition = clone({ proto: true })(this.state.get('addedTransitions', value.transitionId));
    const addedStatuses = this.addedStatuses;
    let changeTransitionMessage = '';
    let newStatus: Status | null = null;

    if (newTransition.fromStateId === value.previousId) {
      changeTransitionMessage = 'WORKFLOW.chaWORKFLOW.ngeSourceOfTransition';
      newStatus = addedStatuses[value.sourceId];
      newTransition.fromStateId = value.sourceId;
    } else if (newTransition.toStateId === value.previousId) {
      changeTransitionMessage = 'WORKFLOW.changeTargetOfTransition';
      newStatus = addedStatuses[value.targetId];
      newTransition.toStateId = value.targetId;
    }

    if (newStatus) {
      const result = await this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate(changeTransitionMessage, {
          transition: newTransition.name,
          status: newStatus.name,
        }),
        showCancelButton: true,
      });

      if (result.isConfirmed) {
        this.upsertTransition$.next(newTransition);
      } else {
        this.workflowDesigner.apiEvent({ type: WorkflowAPI.removeTransition, value: value.transitionId });
        this.workflowDesigner.apiEvent({
          type: WorkflowAPI.drawTransition,
          value: AdminWorkflowsUtils.generateWorkflowTransition(this.state.get('addedTransitions', value.transitionId)),
        });
      }
    }
  }

  private handleRemoveTransition(transitionId: string): void {
    if (this.isInitialTransition(transitionId)) {
      this.promptService.open({ icon: 'error', html: this.translocoService.translate('WORKFLOW.readonlyTransition') });
    } else {
      this.deleteTransitions$.next([transitionId]);
      this.workflowDesigner.apiEvent({ type: WorkflowAPI.removeTransition, value: transitionId });
    }
  }

  private isInitialTransition(transitionId: string): boolean {
    const transition = this.state.get('addedTransitions', transitionId);

    return !transition.fromStateId && !transition.allState;
  }

  private handleRemoveStatus(statusId: string): void {
    const relatedTransitions = Object.entries(this.state.get('addedTransitions'))
      .filter(([, value]) => [value.fromStateId, value.toStateId].includes(statusId))
      .map(([key]) => key);
    const isInitialStatus = relatedTransitions.some((transitionId) => this.isInitialTransition(transitionId));

    if (isInitialStatus) {
      this.promptService.open({ icon: 'error', html: this.translocoService.translate('WORKFLOW.readonlyStatus') });
    } else {
      this.deleteStatus$.next(statusId);
      this.deleteTransitions$.next(relatedTransitions);
      this.workflowDesigner.apiEvent({ type: WorkflowAPI.removeStatus, value: statusId });
    }
  }
}
