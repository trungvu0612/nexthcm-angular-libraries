import { ChangeDetectionStrategy, Component, Inject, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractServerSortPaginationTableComponent,
  EmployeeGeneralInformation,
  EmployeeInfo,
  Pagination,
  PromptService,
} from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
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
  extends AbstractServerSortPaginationTableComponent<EmployeeInfo>
  implements OnInit
{
  @ViewChild('table') table!: BaseComponent;

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
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminEmployeesService.getEmployees(this.queryParams$.value).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );
  readonly search$ = new Subject<string | null>();

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
    private readonly promptService: PromptService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
    state.hold(
      this.search$.pipe(
        filter(isPresent),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((searchQuery) => this.queryParams$.next(this.queryParams$.value.set('search', searchQuery)))
      )
    );
  }

  ngOnInit(): void {
    const searchParam = this.activatedRoute.snapshot.queryParams.search;

    if (searchParam) {
      this.search$.next(searchParam);
    }
  }

  onAddEmployee(): void {
    this.dialogService
      .open<EmployeeGeneralInformation>(new PolymorpheusComponent(InitEmployeeDialogComponent, this.injector), {
        label: this.translocoService.translate('employees.addNewEmployee'),
        size: 'l',
      })
      .pipe(
        switchMap((data) => this.adminEmployeesService.initEmployee(data)),
        tap((res) => this.router.navigate([res.data.id, 'edit'], { relativeTo: this.activatedRoute })),
        takeUntil(this.destroy$)
      )
      .subscribe(this.promptService.handleResponse(''));
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
      .subscribe(
        this.promptService.handleResponse('employees.removeEmployeeSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
