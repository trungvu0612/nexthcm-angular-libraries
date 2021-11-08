import { ChangeDetectionStrategy, Component, Inject, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Actions } from '@datorama/akita-ng-effects';
import {
  BaseObject,
  EmployeeGeneralInformation,
  EmployeeInfo,
  loadRoles,
  NewAbstractServerSortPaginationTableComponent,
  Pagination,
  PromptService,
  RolesQuery,
} from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiContextWithImplicit, TuiDestroyService, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Columns } from 'ngx-easy-table';
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

@Component({
  selector: 'hcm-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class EmployeeManagementComponent
  extends NewAbstractServerSortPaginationTableComponent<EmployeeInfo>
  implements OnInit
{
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_EMPLOYEE_MANAGEMENT_COLUMNS', {}, (this.scope as ProviderScope).scope)
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
  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.adminEmployeesService.getEmployees(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false)),
    startWith(true)
  );
  readonly search$ = new Subject<string | null>();
  readonly role$ = new Subject<string | null>();
  readonly rolesList$ = this.rolesQuery.selectAll();

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly scope: TranslocoScope,
    readonly state: RxState<Pagination<EmployeeInfo>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly adminEmployeesService: AdminEmployeesService,
    private readonly destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService,
    private readonly rolesQuery: RolesQuery,
    actions: Actions
  ) {
    super(state, router, activatedRoute);
    actions.dispatch(loadRoles());
    state.connect(this.request$.pipe(filter(isPresent)));
    state.hold(
      this.search$.pipe(
        filter(isPresent),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((searchQuery) => {
          this.queryParams = this.queryParams.set('search', searchQuery);
          this.fetch$.next();
        })
      )
    );
    state.hold(this.role$, (roleId) => this.onFilter('roleId', roleId));
  }

  @tuiPure
  rolesStringify(items: ReadonlyArray<BaseObject>): TuiStringHandler<TuiContextWithImplicit<string>> {
    const map = new Map(items.map(({ id, name }) => [id, name]));

    return ({ $implicit }: TuiContextWithImplicit<string>) => map.get($implicit) || '';
  }

  parseParams(params: Params): void {
    const keys = ['page', 'size', 'search', 'roleId'];

    for (const key of keys) {
      this.queryParams =
        params[key] && params[key] !== 'null' ? this.queryParams.set(key, params[key]) : this.queryParams.delete(key);
    }
  }

  onFilter(key: string, value: string | number | null): void {
    if (value !== null) {
      this.queryParams = this.queryParams.set(key, value);
    } else {
      this.queryParams = this.queryParams.delete(key);
    }
    this.fetch$.next();
  }

  onAddEmployee(): void {
    this.dialogService
      .open<EmployeeGeneralInformation>(new PolymorpheusComponent(InitEmployeeDialogComponent, this.injector), {
        label: this.translocoService.translate('employees.addNewEmployee'),
        size: 'l',
      })
      .pipe(
        switchMap((data) => this.adminEmployeesService.initEmployee(data)),
        takeUntil(this.destroy$)
      )
      .subscribe(this.promptService.handleResponse('', () => this.fetch$.next()));
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
    this.dialogService
      .open(new PolymorpheusComponent(EditEmployeeDialogComponent, this.injector), {
        label: this.translocoService.translate('employees.editEmployee'),
        data: id,
        size: 'page',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
