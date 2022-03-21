import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Params, Router } from '@angular/router';
import { AbstractBaseServerPaginationTableComponent, DateRange, Pagination } from '@nexthcm/cdk';
import { TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { ProviderScope } from '@ngneat/transloco/lib/types';
import { RxState } from '@rx-angular/state';
import { isPresent } from '@taiga-ui/cdk';
import { Columns } from 'ngx-easy-table';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap } from 'rxjs/operators';

import { AdminLeaveConfigsService } from '../../admin-leave-configs.service';
import { LeaveOperations } from '../../enums';
import { EmployeeLeaveEntitlement, LeaveEntitlementFilters } from '../../models';

@Component({
  selector: 'hcm-employee-leave-entitlement-management',
  templateUrl: './employee-leave-entitlement-management.component.html',
  styleUrls: ['./employee-leave-entitlement-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class EmployeeLeaveEntitlementManagementComponent extends AbstractBaseServerPaginationTableComponent<EmployeeLeaveEntitlement> {
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('EMPLOYEE_LEAVE_ENTITLEMENT_COLUMNS', {}, this.translocoScope.scope)
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
  readonly LeaveOperations = LeaveOperations;
  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.leaveConfigsService.getEmployeeLeaveEntitlements(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    override readonly state: RxState<Pagination<EmployeeLeaveEntitlement>>,
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    readonly router: Router,
    private readonly translocoService: TranslocoService,
    private readonly leaveConfigsService: AdminLeaveConfigsService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onView(filters: LeaveEntitlementFilters): void {
    for (const key of Object.keys(filters) as Array<keyof LeaveEntitlementFilters>) {
      const value = filters[key];

      this.queryParams = value ? this.queryParams.set(key, value) : this.queryParams.delete(key);
    }
    this.queryParams = this.queryParams.delete('page');
    this.fetch$.next();
  }

  onViewLeaveHistory(item: EmployeeLeaveEntitlement, operation: LeaveOperations): void {
    const fromDate = this.queryParams.get('fromDate');
    const toDate = this.queryParams.get('toDate');

    const queryParams: Params = {
      employeeId: item.userInfo.id,
      leaveTypeId: item.leaveType.id,
      dates:
        fromDate && toDate
          ? DateRange.toTuiDayRange(new DateRange(Number(fromDate), Number(toDate))).getFormattedDayRange('DMY', '.')
          : null,
      operation,
      isHistory: true,
    };

    this.router.navigate(['/my-time/requests/leave'], { queryParams });
  }
}
