import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractServerPaginationTableComponent, Pagination } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
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
import { EmployeeLeaveEntitlement } from '../../models/leave-entitlement';

@Component({
  selector: 'hcm-employee-leave-entitlement-management',
  templateUrl: './employee-leave-entitlement-management.component.html',
  styleUrls: ['./employee-leave-entitlement-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class EmployeeLeaveEntitlementManagementComponent
  extends AbstractServerPaginationTableComponent<EmployeeLeaveEntitlement>
  implements OnInit
{
  @ViewChild('table') table!: BaseComponent;

  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('EMPLOYEE_LEAVE_ENTITLEMENT_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'cif', title: result.cif },
        { key: 'fullName', title: result.fullName },
        { key: 'organization', title: result.department },
        { key: 'jobTitle', title: result.jobTitle },
        { key: 'leaveType', title: result.leaveType },
        {
          key: 'totalEntitlement',
          title: result.totalEntitlement,
          cssClass: { name: 'text-center', includeHeader: true },
        },
        {
          key: 'totalUsedEntitlement',
          title: result.totalUsedEntitlement,
          cssClass: { name: 'text-center', includeHeader: true },
        },
        {
          key: 'remainingEntitlement',
          title: result.remainingEntitlement,
          cssClass: { name: 'text-center', includeHeader: true },
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
    private readonly translocoService: TranslocoService,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly leaveConfigsService: AdminLeaveConfigsService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    super(state);
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
}
