import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { ActivatedRoute, Params, UrlSerializer } from '@angular/router';
import { Actions } from '@datorama/akita-ng-effects';
import {
  BaseObject,
  BaseOption,
  CommonStatus,
  EmployeeInfo,
  loadRoles,
  NewAbstractServerSortPaginationTableComponent,
  Pagination,
  PromptService,
  RolesQuery,
} from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import {
  isPresent,
  TuiContextWithImplicit,
  TuiDayRange,
  TuiDestroyService,
  tuiPure,
  TuiStringHandler,
} from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { endOfDay, startOfDay } from 'date-fns';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { from, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  share,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { EditEmployeeDialogComponent } from '../../components/edit-employee-dialog/edit-employee-dialog.component';
import { InitEmployeeDialogComponent } from '../../components/init-employee-dialog/init-employee-dialog.component';
import { AdminEmployeesService } from '../../services/admin-employees.service';
import { TRANSLATION_SCOPE } from '../../translation-scope';

@Component({
  selector: 'hcm-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class EmployeeManagementComponent
  extends NewAbstractServerSortPaginationTableComponent<EmployeeInfo>
  implements AfterViewInit
{
  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
    orderEnabled: false,
  };
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_EMPLOYEE_MANAGEMENT_COLUMNS', {}, TRANSLATION_SCOPE)
    .pipe(
      map((result) => [
        { key: 'cif', title: result.cif },
        { key: 'fullName', title: result.fullName },
        { key: 'organization', title: result.department },
        { key: 'jobTitle', title: result.jobTitle },
        { key: 'directReport', title: result.directReport },
        { key: 'roles', title: result.roles },
        { key: 'status', title: result.activeStatus },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  readonly CommonStatus = CommonStatus;
  readonly search$ = new Subject<string | null>();
  readonly role$ = new Subject<string | null>();
  readonly statusFilter$ = new Subject<string | null>();
  readonly birthMonth$ = new Subject<number | null>();
  readonly onboardDates$ = new Subject<TuiDayRange | null>();
  readonly rolesList$ = this.rolesQuery.selectAll();
  readonly statusList$: Observable<BaseOption[]> = this.translocoService.selectTranslateObject('COMMON_STATUS').pipe(
    map((result) => [
      { value: CommonStatus.active, label: result.active },
      { value: CommonStatus.inactive, label: result.inactive },
    ])
  );
  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.adminEmployeesService.getEmployees(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false)),
    startWith(true)
  );

  constructor(
    readonly state: RxState<Pagination<EmployeeInfo>>,
    readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly adminEmployeesService: AdminEmployeesService,
    private readonly destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService,
    private readonly rolesQuery: RolesQuery,
    actions: Actions
  ) {
    super(state, activatedRoute);
    actions.dispatch(loadRoles());
    state.connect(this.request$.pipe(filter(isPresent)));
    state.hold(
      this.search$.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((searchQuery) => {
          this.resetPage();
          if (searchQuery) {
            this.queryParams = this.queryParams.set('search', searchQuery);
          } else {
            this.setQueryParams('search', null);
            this.queryParams = this.queryParams.delete('search');
          }
          this.fetch$.next();
        })
      )
    );
    state.hold(this.role$, (roleId) => {
      this.resetPage();
      this.onFilter('roleId', roleId);
    });
    state.hold(this.statusFilter$, (status) => {
      this.resetPage();
      this.onFilter('status', status);
    });
    state.hold(this.birthMonth$, (birthMonth) => {
      this.resetPage();
      this.onFilter('birthDate', birthMonth);
    });
    state.hold(this.onboardDates$, (onboardDates) => {
      this.resetPage();
      this.filterByOnboardDates(onboardDates);
    });
  }

  get employeeId(): string | null {
    return this.activatedRoute.snapshot.queryParamMap.get('id');
  }

  @tuiPure
  rolesStringify(items: ReadonlyArray<BaseObject>): TuiStringHandler<TuiContextWithImplicit<string>> {
    const map = new Map(items.map(({ id, name }) => [id, name]));

    return ({ $implicit }: TuiContextWithImplicit<string>) => map.get($implicit) || '';
  }

  @tuiPure
  statusStringify(items: ReadonlyArray<BaseOption<number>>): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(items.map(({ value, label }) => [value, label]));

    return ({ $implicit }: TuiContextWithImplicit<number>) => map.get($implicit) || '';
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.employeeId) {
      this.openEditEmployeeDialog(this.employeeId);
    }
  }

  parseParams(params: Params): void {
    const keys = ['search', 'roleId', 'birthDate', 'status'];

    super.parseParams(params);
    for (const key of keys) {
      this.queryParams =
        params[key] && params[key] !== 'null' ? this.queryParams.set(key, params[key]) : this.queryParams.delete(key);
    }
    if (params.dates) {
      this.onboardDates$.next(TuiDayRange.normalizeParse(params.dates));
    }
  }

  onFilter(key: string, value: string | number | null): void {
    this.queryParams = value !== null ? this.queryParams.set(key, value) : this.queryParams.delete(key);
    this.fetch$.next();
  }

  onAddEmployee(): void {
    this.dialogService
      .open(new PolymorpheusComponent(InitEmployeeDialogComponent, this.injector), {
        label: this.translocoService.translate('employees.addNewEmployee'),
        size: 'page',
        dismissible: false,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.fetch$.next());
  }

  onRemoveEmployee(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('employees.deleteEmployee'),
        showCancelButton: true,
      })
    )
      .pipe(
        filter((result) => result.isConfirmed),
        switchMap(() => this.adminEmployeesService.removeEmployee(id)),
        takeUntil(this.destroy$)
      )
      .subscribe(this.promptService.handleResponse('employees.removeEmployeeSuccessfully', () => this.fetch$.next()));
  }

  onEditEmployee(id: string): void {
    this.setQueryParams('id', id);
    this.openEditEmployeeDialog(id);
  }

  private openEditEmployeeDialog(id: string): void {
    this.translocoService
      .selectTranslate<string>('editEmployee')
      .pipe(
        switchMap((label) =>
          this.dialogService.open(new PolymorpheusComponent(EditEmployeeDialogComponent, this.injector), {
            label,
            data: id,
            size: 'page',
            dismissible: false,
            required: true,
          })
        )
      )
      .pipe(
        catchError(() => of(undefined)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.setQueryParams('id', null));
  }

  private resetPage(): void {
    this.queryParams = this.queryParams.delete('page');
    this.setQueryParams('page', null);
  }

  private filterByOnboardDates(dates: TuiDayRange | null): void {
    this.queryParams = dates
      ? this.queryParams
          .set('onBoardDateFrom', startOfDay(dates.from.toLocalNativeDate()).getTime())
          .set('onBoardDateTo', endOfDay(dates.to.toLocalNativeDate()).getTime())
      : this.queryParams.delete('onBoardDateFrom').delete('onBoardDateTo');
    this.fetch$.next();
  }
}
