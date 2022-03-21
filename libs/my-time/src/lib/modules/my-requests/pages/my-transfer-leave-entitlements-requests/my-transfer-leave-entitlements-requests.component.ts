import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { Pagination, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent } from '@taiga-ui/cdk';
import { Columns } from 'ngx-easy-table';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';

import { AbstractMyRequestListComponent } from '../../../../internal/abstract/my-request-list-component';
import { TRANSLATION_SCOPE } from '../../../../internal/constants';
import { TransferLeaveEntitlementsRequest } from '../../../../internal/models';
import { MyRequestsService, RequestDetailDialogService } from '../../../../internal/services';

@Component({
  selector: 'hcm-my-transfer-leave-entitlements-requests',
  templateUrl: './my-transfer-leave-entitlements-requests.component.html',
  styleUrls: ['./my-transfer-leave-entitlements-requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class MyTransferLeaveEntitlementsRequestsComponent extends AbstractMyRequestListComponent<TransferLeaveEntitlementsRequest> {
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
  override queryParams = new HttpParams()
    .set('page', 0)
    .set('size', 10)
    .set('userId', this.authService.get('userInfo', 'userId'));
  private readonly request$ = this.fetch$.pipe(
    switchMap(() =>
      this.myRequestsService
        .getRequests<TransferLeaveEntitlementsRequest>('myTransferLeaveEntitlements', this.queryParams)
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
    override readonly state: RxState<Pagination<TransferLeaveEntitlementsRequest>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    readonly requestDetailDialogService: RequestDetailDialogService,
    readonly translocoService: TranslocoService,
    readonly promptService: PromptService,
    override readonly authService: AuthService
  ) {
    super(state, activatedRoute, authService);
    state.connect(this.request$.pipe(filter(isPresent)));
  }
}
