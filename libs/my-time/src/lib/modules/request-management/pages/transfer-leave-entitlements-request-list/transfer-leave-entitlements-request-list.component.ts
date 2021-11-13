import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { Pagination } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { TRANSLATION_SCOPE } from '../../../../internal/constants';
import { TransferLeaveEntitlementsRequest } from '../../../../internal/models/requests/transfer-leave-entitlements-request';
import { MyRequestsService } from '../../../../internal/services';
import { AbstractRequestListComponent } from '../../../../shared/abstract-components/abstract-request-list.component';

@Component({
  selector: 'hcm-transfer-leave-entitlements-request-list',
  templateUrl: './transfer-leave-entitlements-request-list.component.html',
  styleUrls: ['./transfer-leave-entitlements-request-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class TransferLeaveEntitlementsRequestListComponent extends AbstractRequestListComponent<TransferLeaveEntitlementsRequest> {
  @ViewChild('table') table!: BaseComponent;

  readonly userId = this.authService.get('userInfo', 'userId');
  readonly requestTypeUrlPath = 'transferLeaveEntitlements';
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('MY_TIME_REQUEST_LIST_COLUMNS', {}, TRANSLATION_SCOPE)
    .pipe(
      map((result) => [
        { key: 'leaveType', title: result.leaveType },
        { key: 'fromDate', title: result.dateRange },
        { key: 'typeTransfer', title: result.type },
        { key: 'durationInDayTransfer', title: result.days, cssClass: { name: 'text-center', includeHeader: true } },
        { key: 'currentState', title: result.status },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.myRequestsService
        .getRequests<TransferLeaveEntitlementsRequest>(this.requestTypeUrlPath, this.queryParams$.value)
        .pipe(startWith(null))
    ),
    shareReplay(1)
  );
  readonly loading$ = combineLatest([this.request$, this.changeStatusHandler$.pipe(startWith({}))]).pipe(
    map((values) => values.includes(null)),
    catchError(() => of(false))
  );

  constructor(
    readonly myRequestsService: MyRequestsService,
    readonly destroy$: TuiDestroyService,
    readonly state: RxState<Pagination<TransferLeaveEntitlementsRequest>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private readonly translocoService: TranslocoService,
    private readonly authService: AuthService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }
}
