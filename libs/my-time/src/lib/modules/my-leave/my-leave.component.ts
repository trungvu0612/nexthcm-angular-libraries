import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { Pagination, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Columns } from 'ngx-easy-table';
import { combineLatest, from, Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, mapTo, share, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { AbstractMyRequestListComponent } from '../../internal/abstract/my-request-list-component';
import {
  CreateLeaveRequestDialogComponent,
  CreateTransferLeaveEntitlementRequestComponent,
} from '../../internal/components';
import { TRANSLATION_SCOPE } from '../../internal/constants';
import { LeaveRequest, RemainingLeaveEntitlement } from '../../internal/models';
import { MyLeaveService, MyRequestsService, RequestDetailDialogService } from '../../internal/services';

@Component({
  selector: 'hcm-my-leave',
  templateUrl: './my-leave.component.html',
  styleUrls: ['./my-leave.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class MyLeaveComponent extends AbstractMyRequestListComponent<LeaveRequest> {
  readonly requestTypeUrlPath = 'leave';
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('MY_LEAVE_TABLE_COLUMNS', {}, TRANSLATION_SCOPE)
    .pipe(
      map((result) => [
        { key: 'fromDate', title: result.dateRange },
        { key: 'leaveType', title: result.leaveType },
        {
          key: 'days',
          title: result.days,
          cssClass: { name: 'text-center', includeHeader: true },
          orderEnabled: false,
        },
        { key: 'status', title: result.status, orderEnabled: false },
        { key: 'comment', title: result.Comment },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  // EVENTS
  readonly createLeaveRequest$ = new Subject<void>();
  readonly createConvertLeaveEntitlementRequest$ = new Subject<void>();
  // HANDLERS
  readonly createLeaveRequestHandler$ = this.createLeaveRequest$.pipe(
    mapTo(this.authService.get('userInfo', 'userId'))
  );
  readonly createConvertLeaveEntitlementRequestHandler$ = this.createConvertLeaveEntitlementRequest$.pipe(
    switchMap(() =>
      this.myLeaveService
        .getEmployeeLeaveEntitlementsForTransferring(this.authService.get('userInfo', 'userId'))
        .pipe(startWith(null))
    ),
    share()
  );
  // LOADINGS
  readonly createConvertLeaveEntitlementRequestLoading$ = this.createConvertLeaveEntitlementRequestHandler$.pipe(
    map((value) => !value)
  );
  private readonly request$ = combineLatest([
    this.fetch$,
    this.myRequestsService.refresh$.pipe(
      filter((type) => type === this.requestTypeUrlPath),
      startWith(null)
    ),
  ]).pipe(
    switchMap(() =>
      this.myRequestsService.getRequests<LeaveRequest>('myLeave', this.queryParams).pipe(startWith(null))
    ),
    shareReplay(1)
  );
  readonly loading$ = combineLatest([this.request$, this.changeStatusHandler$.pipe(startWith({}))]).pipe(
    map((values) => values.includes(null)),
    catchError(() => of(false))
  );

  constructor(
    readonly myRequestsService: MyRequestsService,
    readonly state: RxState<Pagination<LeaveRequest>>,
    readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    readonly requestDetailDialogService: RequestDetailDialogService,
    readonly translocoService: TranslocoService,
    readonly promptService: PromptService,
    readonly authService: AuthService,
    private readonly injector: Injector,
    private readonly dialogService: TuiDialogService,
    private readonly myLeaveService: MyLeaveService
  ) {
    super(state, activatedRoute, authService);
    state.connect(this.request$.pipe(filter(isPresent)));
    state.hold(this.createLeaveRequestHandler$.pipe(switchMap((userId) => this.openCreateLeaveRequestDialog(userId))));
    state.hold(
      this.createConvertLeaveEntitlementRequestHandler$.pipe(
        filter(isPresent),
        switchMap((leaveTypes) =>
          leaveTypes.length > 0
            ? this.openCreateConvertLeaveEntitlementRequestDialog(leaveTypes)
            : this.handleEmptyLeaveEntitlements()
        )
      )
    );
  }

  private openCreateLeaveRequestDialog(data: string): Observable<unknown> {
    return this.dialogService
      .open(new PolymorpheusComponent(CreateLeaveRequestDialogComponent, this.injector), {
        label: this.translocoService.translate('myTime.submitLeaveRequest'),
        size: 'l',
        data,
      })
      .pipe(tap(() => this.fetch$.next()));
  }

  private openCreateConvertLeaveEntitlementRequestDialog(data: RemainingLeaveEntitlement[]): Observable<unknown> {
    return this.dialogService.open(
      new PolymorpheusComponent(CreateTransferLeaveEntitlementRequestComponent, this.injector),
      {
        label: this.translocoService.translate('transferLeaveEntitlements'),
        size: 'l',
        data,
      }
    );
  }

  private handleEmptyLeaveEntitlements(): Observable<unknown> {
    return from(
      this.promptService.open({
        icon: 'error',
        html: this.translocoService.translate('myTime.emptyLeaveEntitlements'),
      })
    );
  }
}
