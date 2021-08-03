import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerPaginationTableComponent, PromptService, ServerPaginationTableComponent } from '@nexthcm/cdk';
import { Pagination } from '@nexthcm/core';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Columns } from 'ngx-easy-table';
import { from, Observable } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { InitEmployeeDialogComponent } from '../../components/init-employee-dialog/init-employee-dialog.component';
import { BaseEmployee, EmployeeGeneralInformation } from '../../models';
import { AdminEmployeeService } from '../../services/admin-employee.service';

@Component({
  selector: 'hcm-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class EmployeeManagementComponent
  extends AbstractServerPaginationTableComponent<BaseEmployee>
  implements ServerPaginationTableComponent<BaseEmployee>
{
  columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_EMPLOYEE_MANAGEMENT_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'cif', title: result.cif },
        { key: 'name', title: result.name },
        { key: 'username', title: result.username },
        { key: 'currentStatus', title: result.currentStatus },
        { key: 'roles', title: result.roles },
        { key: 'organization', title: result.organization },
        { key: 'jobTitle', title: result.jobTitle },
        { key: 'directReport', title: result.directReport },
        { key: 'actions', title: result.functions },
      ])
    );
  readonly loading$ = this.state.$.pipe(map((value) => !value));
  readonly data$ = this.state.select('items');
  readonly total$ = this.state.select('totalElements');
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminEmployeesService.getEmployees(this.queryParams$.value)),
    map((res) => res.data)
  );

  constructor(
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private adminEmployeesService: AdminEmployeeService,
    private destroy$: TuiDestroyService,
    private state: RxState<Pagination<BaseEmployee>>,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    super();
    state.connect(this.request$);
  }

  onAddEmployee(): void {
    this.dialogService
      .open<EmployeeGeneralInformation>(new PolymorpheusComponent(InitEmployeeDialogComponent, this.injector), {
        label: this.translocoService.translate('addNewEmployee'),
        size: 'l',
      })
      .pipe(
        switchMap((data) => this.adminEmployeesService.initEmployee(data)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('initEmployeeSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }

  tableEventEmitted(tableEvent: { event: string; value: any }): void {
    if (tableEvent.event === 'onOrder') {
      this.queryParams$.next(this.queryParams$.value.set('sort', `${tableEvent.value.key},${tableEvent.value.order}`));
    }
  }

  onRemoveEmployee(id?: string): void {
    if (id) {
      from(
        this.promptService.open({
          icon: 'question',
          text: this.translocoService.translate('deleteEmployee'),
          showCancelButton: true,
        })
      )
        .pipe(
          filter((result) => result.isConfirmed),
          switchMap(() => this.adminEmployeesService.removeEmployee(id)),
          takeUntil(this.destroy$)
        )
        .subscribe(
          this.promptService.handleResponse('removeEmployeeSuccessfully', () =>
            this.queryParams$.next(this.queryParams$.value)
          )
        );
    }
  }
}
