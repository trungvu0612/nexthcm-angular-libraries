import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { HashMap, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, Observable } from 'rxjs';
import { filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { InitWorkflowDialogComponent } from '../../components/create-workflow-dialog/init-workflow-dialog.component';
import { Workflow } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';

@Component({
  selector: 'hcm-workflow-management',
  templateUrl: './workflow-management.component.html',
  styleUrls: ['./workflow-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class WorkflowManagementComponent extends AbstractServerPaginationTableComponent<Workflow> {
  @ViewChild('table') table!: BaseComponent;

  columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('ADMIN_WORKFLOW_TABLE_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: 'createdBy', title: result.createdBy },
        { key: 'functions', title: result.functions },
      ])
    );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.workflowService.getWorkflows(this.queryParams$.value).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    public state: RxState<Pagination<Workflow>>,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private workflowService: AdminWorkflowsService,
    private destroy$: TuiDestroyService,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onCreateWorkflow(): void {
    this.dialogService
      .open<string>(new PolymorpheusComponent(InitWorkflowDialogComponent, this.injector), {
        label: this.translocoService.translate('createNewWorkflow'),
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.router.navigate([res, 'edit'], { relativeTo: this.activatedRoute });
      });
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
        this.promptService.handleResponse('deleteWorkflowSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
