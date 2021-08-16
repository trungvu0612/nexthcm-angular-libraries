import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, Observable } from 'rxjs';
import { filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { CreateWorkflowDialogComponent } from '../../components/create-workflow-dialog/create-workflow-dialog.component';
import { InitWorkflow, Workflow } from '../../models/workflow';
import { WorkflowService } from '../../services/workflow.service';

@Component({
  selector: 'hcm-workflow-management',
  templateUrl: './workflow-management.component.html',
  styleUrls: ['./workflow-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class WorkflowManagementComponent extends AbstractServerPaginationTableComponent<Workflow> {
  @ViewChild('table') table!: BaseComponent;

  columns$: Observable<Columns[]> = this.translocoService.selectTranslateObject('ADMIN_WORKFLOW_TABLE_COLUMNS').pipe(
    map((result) => [
      { key: 'name', title: result.name },
      { key: 'description', title: result.description },
      { key: 'createdBy', title: result.createdBy },
      { key: 'operations', title: result.operations },
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
    private workflowService: WorkflowService,
    private destroy$: TuiDestroyService,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onCreateWorkflow(): void {
    this.dialogService
      .open<InitWorkflow>(new PolymorpheusComponent(CreateWorkflowDialogComponent, this.injector), {
        label: 'Create new process',
      })
      .pipe(
        switchMap((data) => this.workflowService.initWorkflow(data)),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        this.router.navigate([res.data.id, 'edit'], { relativeTo: this.activatedRoute });
      });
  }

  onRemoveWorkflow(id?: string): void {
    if (id) {
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
}
