import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { HashMap, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { EMPTY, from, iif, Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { CreateWorkflowDialogComponent } from '../../components/create-workflow-dialog/create-workflow-dialog.component';
import { Workflow } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';
import { TRANSLATION_SCOPE } from '../../translation-scope';

@Component({
  selector: 'hcm-workflow-management',
  templateUrl: './workflow-management.component.html',
  styleUrls: ['./workflow-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class WorkflowManagementComponent extends AbstractServerSortPaginationTableComponent<Workflow> {
  @ViewChild('table') table!: BaseComponent;

  columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('ADMIN_WORKFLOW_TABLE_COLUMNS', {}, TRANSLATION_SCOPE)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: 'functions', title: result.functions, orderEnabled: false },
      ])
    );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.workflowService.getWorkflows(this.queryParams$.value).pipe(startWith(null))),
    shareReplay(1)
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly state: RxState<Pagination<Workflow>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly workflowService: AdminWorkflowsService,
    private readonly destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onCreateWorkflow(): void {
    this.dialogService
      .open<string>(new PolymorpheusComponent(CreateWorkflowDialogComponent, this.injector), {
        label: this.translocoService.translate('WORKFLOW.createNewWorkflow'),
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => this.router.navigate(['..', res, 'edit'], { relativeTo: this.activatedRoute }));
  }

  onRemoveWorkflow(id: string): void {
    this.workflowService
      .checkWorkflowInUse(id)
      .pipe(
        switchMap((used) =>
          from(
            this.promptService.open({
              icon: used ? 'warning' : 'question',
              html: this.translocoService.translate(used ? 'WORKFLOW.deleteUsedWorkflow' : 'WORKFLOW.deleteWorkflow'),
              showCancelButton: true,
            })
          )
        ),
        switchMap((result: SweetAlertResult) =>
          iif(() => result.isConfirmed, this.workflowService.deleteWorkflow(id), EMPTY)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('WORKFLOW.removeWorkflowSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
