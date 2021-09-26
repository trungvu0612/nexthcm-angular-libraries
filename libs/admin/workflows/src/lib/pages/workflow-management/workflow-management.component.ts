import { ChangeDetectionStrategy, Component, Inject, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { HashMap, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { ProviderScope, TranslocoScope } from '@ngneat/transloco/lib/types';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
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
  @ViewChild('table') table!: BaseComponent;

  columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('ADMIN_WORKFLOW_TABLE_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: 'functions', title: result.functions, orderEnabled: false },
      ])
    );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.workflowService.getWorkflows(this.queryParams$.value).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly scope: TranslocoScope,
    readonly state: RxState<Pagination<Workflow>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private workflowService: AdminWorkflowsService,
    private destroy$: TuiDestroyService,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onCreateWorkflow(): void {
    this.dialogService
      .open<string>(new PolymorpheusComponent(CreateWorkflowDialogComponent, this.injector), {
        label: this.translocoService.translate('createNewWorkflow'),
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => this.router.navigate(['..', res, 'edit'], { relativeTo: this.activatedRoute }));
  }

  onRemoveWorkflow(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('deleteWorkflow'),
        showCancelButton: true,
      })
    )
      .pipe(
        filter((result) => result.isConfirmed),
        switchMap(() => this.workflowService.deleteWorkflow(id)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('removeWorkflowSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
