import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
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
export class WorkflowManagementComponent {
  @ViewChild('table') table!: BaseComponent;

  configuration: Config = {
    ...DefaultConfig,
    checkboxes: true,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
  };
  columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_PROCESSES.PROCESSES_MANAGEMENT_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: 'createdBy', title: result.createdBy },
        { key: 'operations', title: result.operations },
      ])
    );
  allSelected: boolean | null = false;
  readonly selected = new Set<string>();
  readonly loading$ = this.state.$.pipe(map((value) => !value));
  readonly data$ = this.state.select('items');
  readonly total$ = this.state.select('totalElements');

  private readonly queryParams$ = new BehaviorSubject(new HttpParams().set('page', '0').set('size', 10));
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.workflowService.getProcesses(this.queryParams$.value)),
    map((res) => res.data)
  );

  constructor(
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private workflowService: WorkflowService,
    private destroy$: TuiDestroyService,
    private state: RxState<Pagination<Workflow>>,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    state.connect(this.request$);
  }

  readonly process = (item: Workflow) => item;

  onSize(size: number): void {
    this.queryParams$.next(this.queryParams$.value.set('size', size.toString()));
  }

  onPage(page: number): void {
    this.queryParams$.next(this.queryParams$.value.set('page', page.toString()));
  }

  onCreateProcess(): void {
    this.dialogService
      .open<InitWorkflow>(new PolymorpheusComponent(CreateWorkflowDialogComponent, this.injector), {
        label: 'Create new process',
      })
      .pipe(switchMap((data) => this.workflowService.initProcess(data)))
      .subscribe((res) => {
        this.router.navigate([res.data.id, 'edit'], { relativeTo: this.activatedRoute });
      });
  }

  tableEventEmitted(tableEvent: { event: string; value: any }): void {
    if (tableEvent.event === 'onSelectAll') {
      this.selected.clear();
      this.allSelected = !this.allSelected;
      if (this.allSelected) {
        this.table.data.forEach((row) => this.selected.add(row.id));
      }
    }
    if (tableEvent.event === 'onOrder') {
      this.queryParams$.next(this.queryParams$.value.set('sort', `${tableEvent.value.key},${tableEvent.value.order}`));
    }
  }

  rowSelected(row: Workflow, value: boolean): void {
    if (row.id) {
      value ? this.selected.add(row.id) : this.selected.delete(row.id);
    }
    if (!this.selected.size) {
      this.allSelected = false;
    } else {
      this.allSelected = this.selected.size !== this.table.data.length ? null : true;
    }
  }

  onRemoveProcess(id?: string): void {
    if (id) {
      from(
        this.promptService.open({
          icon: 'question',
          html: this.translocoService.translate('ADMIN_PROCESSES.MESSAGES.deleteProcess'),
          showCancelButton: true,
        })
      )
        .pipe(
          filter((result) => result.isConfirmed),
          switchMap(() =>
            this.workflowService.deleteProcess(id).pipe(tap(() => this.queryParams$.next(this.queryParams$.value)))
          ),
          catchError((err) => this.promptService.open({ icon: 'error', text: err.error.message })),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
  }
}
