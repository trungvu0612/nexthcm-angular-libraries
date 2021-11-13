import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent } from '@taiga-ui/cdk';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { AdminLeaveConfigsService } from '../../admin-leave-configs.service';
import { EmployeeLeaveEntitlement, LeaveEntitlementFilters } from '../../models';
import { TRANSLATION_SCOPE } from '../../translation-scope';

@Component({
  selector: 'hcm-employee-leave-entitlement-management',
  templateUrl: './employee-leave-entitlement-management.component.html',
  styleUrls: ['./employee-leave-entitlement-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class EmployeeLeaveEntitlementManagementComponent
  extends AbstractServerSortPaginationTableComponent<EmployeeLeaveEntitlement>
  implements OnInit
{
  @ViewChild('table') table!: BaseComponent;

  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('EMPLOYEE_LEAVE_ENTITLEMENT_COLUMNS', {}, TRANSLATION_SCOPE)
    .pipe(
      map((result) => [
        { key: 'cif', title: result.cif, orderEnabled: false },
        { key: 'fullName', title: result.fullName, orderEnabled: false },
        { key: 'organization', title: result.department, orderEnabled: false },
        { key: 'jobTitle', title: result.jobTitle, orderEnabled: false },
        { key: 'leaveType', title: result.leaveType, orderEnabled: false },
        {
          key: 'leaveEntitlement',
          title: result.leaveEntitlement,
          cssClass: { name: 'text-center', includeHeader: true },
          orderEnabled: false,
        },
        {
          key: 'leavePending',
          title: result.leavePending,
          cssClass: { name: 'text-center', includeHeader: true },
          orderEnabled: false,
        },
        {
          key: 'leaveScheduled',
          title: result.leaveScheduled,
          cssClass: { name: 'text-center', includeHeader: true },
          orderEnabled: false,
        },
        {
          key: 'leaveTaken',
          title: result.leaveTaken,
          cssClass: { name: 'text-center', includeHeader: true },
          orderEnabled: false,
        },
        {
          key: 'leaveBalance',
          title: result.leaveBalance,
          cssClass: { name: 'text-center', includeHeader: true },
          orderEnabled: false,
        },
      ])
    );
  readonly search$ = new Subject<string | null>();
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.leaveConfigsService.getEmployeeLeaveEntitlements(this.queryParams$.value).pipe(startWith(null))
    ),
    shareReplay(1)
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly state: RxState<Pagination<EmployeeLeaveEntitlement>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private readonly translocoService: TranslocoService,
    private readonly leaveConfigsService: AdminLeaveConfigsService
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

  onView(filters: LeaveEntitlementFilters): void {
    let params = this.queryParams$.value;

    for (const key of Object.keys(filters) as Array<keyof LeaveEntitlementFilters>) {
      const value = filters[key];

      params = value ? params.set(key, value) : params.delete(key);
    }
    this.queryParams$.next(params);
  }
}
