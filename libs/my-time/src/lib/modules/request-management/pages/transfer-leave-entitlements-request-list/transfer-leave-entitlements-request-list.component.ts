import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent } from '@taiga-ui/cdk';
import { Columns } from 'ngx-easy-table';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';

import { AbstractRequestListComponent } from '../../../../internal/abstract';
import { TransferLeaveEntitlementsRequest } from '../../../../internal/models';
import { MyRequestsService, RequestDetailDialogService } from '../../../../internal/services';

@Component({
  selector: 'hcm-transfer-leave-entitlements-request-list',
  templateUrl: './transfer-leave-entitlements-request-list.component.html',
  styleUrls: ['./transfer-leave-entitlements-request-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class TransferLeaveEntitlementsRequestListComponent extends AbstractRequestListComponent<TransferLeaveEntitlementsRequest> {
  readonly requestTypeUrlPath = 'transferLeaveEntitlements';
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('MY_TIME_REQUEST_LIST_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'leaveType', title: result.leaveType },
        { key: 'fromDate', title: result.dateRange },
        { key: 'type', title: result.type },
        { key: 'durationInDayTransfer', title: result.days, cssClass: { name: 'text-center', includeHeader: true } },
        { key: 'status', title: result.status, orderEnabled: false },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  private readonly request$ = this.fetch$.pipe(
    switchMap(() =>
      this.myRequestsService
        .getRequests<TransferLeaveEntitlementsRequest>(this.requestTypeUrlPath, this.queryParams)
        .pipe(startWith(null))
    ),
    shareReplay(1)
  );
  readonly loading$ = combineLatest([this.request$, this.changeStatusHandler$.pipe(startWith({}))]).pipe(
    map((values) => values.includes(null)),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    readonly myRequestsService: MyRequestsService,
    override readonly state: RxState<Pagination<TransferLeaveEntitlementsRequest>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    readonly requestDetailDialogService: RequestDetailDialogService,
    readonly translocoService: TranslocoService,
    readonly promptService: PromptService
  ) {
    super(state, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }
}
