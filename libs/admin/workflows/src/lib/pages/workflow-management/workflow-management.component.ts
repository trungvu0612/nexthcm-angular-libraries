import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Columns } from 'ngx-easy-table';
import { EMPTY, from, iif, Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { CreateWorkflowDialogComponent } from '../../components/create-workflow-dialog/create-workflow-dialog.component';
import { Workflow } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';

@Component({
  selector: 'hcm-workflow-management',
  templateUrl: './workflow-management.component.html',
  styleUrls: ['./workflow-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class WorkflowManagementComponent extends AbstractServerSortPaginationTableComponent<Workflow> {
  columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_WORKFLOW_TABLE_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: 'functions', title: result.functions, orderEnabled: false },
      ])
    );
  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.workflowService.getWorkflows(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    override readonly state: RxState<Pagination<Workflow>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    private readonly router: Router,
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly workflowService: AdminWorkflowsService,
    private readonly destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService
  ) {
    super(state, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onCreateWorkflow(): void {
    this.dialogService
      .open<string>(new PolymorpheusComponent(CreateWorkflowDialogComponent, this.injector), {
        label: this.translocoService.translate(`${this.translocoScope.scope}.createNewWorkflow`),
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
              html: this.translocoService.translate(
                `${this.translocoScope.scope}.${used ? 'deleteUsedWorkflow' : 'deleteWorkflow'}`
              ),
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
        this.promptService.handleResponse(`${this.translocoScope.scope}.removeWorkflowSuccessfully`, () =>
          this.fetch$.next()
        )
      );
  }
}
