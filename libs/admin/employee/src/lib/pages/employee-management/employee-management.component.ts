import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from '@nexthcm/core';
import { PromptService } from '@nexthcm/ui';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
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
export class EmployeeManagementComponent {
  @ViewChild('table') table!: BaseComponent;

  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
  };
  columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_EMPLOYEE_MANAGEMENT_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'cif', title: result.cif },
        { key: 'name', title: result.name },
        { key: 'currentStatus', title: result.currentStatus },
        { key: 'roles', title: result.roles },
        { key: 'organization', title: result.organization },
        { key: 'jobTitle', title: result.jobTitle },
        { key: 'directReport', title: result.directReport },
        { key: 'actions', title: result.actions },
      ])
    );
  readonly loading$ = this.state.$.pipe(map((value) => !value));
  readonly data$ = this.state.select('items');
  readonly total$ = this.state.select('totalElements');
  private readonly queryParams$ = new BehaviorSubject(new HttpParams().set('page', '0').set('size', 10));
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
    state.connect(this.request$);
  }

  readonly employee = (item: BaseEmployee) => item;

  onSize(size: number): void {
    this.queryParams$.next(this.queryParams$.value.set('size', size.toString()));
  }

  onPage(page: number): void {
    this.queryParams$.next(this.queryParams$.value.set('page', page.toString()));
  }

  onAddEmployee(): void {
    this.dialogService
      .open<EmployeeGeneralInformation>(new PolymorpheusComponent(InitEmployeeDialogComponent, this.injector), {
        label: this.translocoService.translate('addNewEmployee'),
      })
      .pipe(
        switchMap((data) => this.adminEmployeesService.initEmployee(data)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        () => {
          this.promptService.open({
            icon: 'success',
            text: this.translocoService.translate('initEmployeeSuccessful'),
          } as SweetAlertOptions);
          this.queryParams$.next(this.queryParams$.value);
        },
        (err) => this.promptService.open({ icon: 'error', text: err.error.message } as SweetAlertOptions)
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
          switchMap(() =>
            this.adminEmployeesService
              .removeEmployee(id)
              .pipe(tap(() => this.queryParams$.next(this.queryParams$.value)))
          ),
          catchError((err) => this.promptService.open({ icon: 'error', text: err.error.message })),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
  }
}
