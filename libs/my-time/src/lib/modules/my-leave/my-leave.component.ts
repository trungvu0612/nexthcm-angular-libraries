import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { combineLatest, from, Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, share, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { NewAbstractRequestListComponent } from '../../internal/abstract';
import { LeaveRequest, RemainingLeaveEntitlement } from '../../internal/models';
import { MyRequestsService } from '../../internal/services';
import { MyLeaveService } from '../../services';
import { CreateLeaveRequestDialogComponent } from '../../shared/create-leave-request-dialog/create-leave-request-dialog.component';
import { CreateTransferLeaveEntitlementRequestComponent } from '../../shared/create-transfer-leave-entitlement-request/create-transfer-leave-entitlement-request.component';

@Component({
  selector: 'hcm-my-leave',
  templateUrl: './my-leave.component.html',
  styleUrls: ['./my-leave.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class MyLeaveComponent extends NewAbstractRequestListComponent<LeaveRequest> {
  @ViewChild('table') table!: BaseComponent;

  readonly requestTypeUrlPath = 'leave';
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('MY_LEAVE_TABLE_COLUMNS', {}, (this.scope as ProviderScope).scope)
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

  private readonly request$ = this.fetch$.pipe(
    switchMap(() =>
      this.myRequestsService.getRequests<LeaveRequest>('myLeave', this.queryParams).pipe(startWith(null))
    ),
    shareReplay(1)
  );
  readonly loading$ = combineLatest([this.request$, this.changeStatusHandler$.pipe(startWith({}))]).pipe(
    map((values) => values.includes(null)),
    catchError(() => of(false))
  );

  // EVENTS
  readonly createLeaveRequest$ = new Subject<void>();
  readonly createConvertLeaveEntitlementRequest$ = new Subject<void>();

  // HANDLERS
  readonly createLeaveRequestHandler$ = this.createLeaveRequest$.pipe(
    switchMap(() =>
      this.myLeaveService.getEmployeeLeaveEntitlements(this.authService.get('userInfo', 'userId')).pipe(startWith(null))
    ),
    share()
  );
  readonly createConvertLeaveEntitlementRequestHandler$ = this.createConvertLeaveEntitlementRequest$.pipe(
    switchMap(() =>
      this.myLeaveService
        .getEmployeeLeaveEntitlementsForTransfering(this.authService.get('userInfo', 'userId'))
        .pipe(startWith(null))
    ),
    share()
  );

  // LOADINGS
  readonly createLeaveRequestLoading$ = this.createLeaveRequestHandler$.pipe(map((value) => !value));
  readonly createConvertLeaveEntitlementRequestLoading$ = this.createConvertLeaveEntitlementRequestHandler$.pipe(
    map((value) => !value)
  );

  constructor(
    readonly myRequestsService: MyRequestsService,
    readonly state: RxState<Pagination<LeaveRequest>>,
    readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly injector: Injector,
    private readonly translocoService: TranslocoService,
    private readonly authService: AuthService,
    private readonly dialogService: TuiDialogService,
    private readonly myLeaveService: MyLeaveService,
    private readonly promptService: PromptService
  ) {
    super(state, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
    state.hold(
      this.createLeaveRequestHandler$.pipe(
        filter(isPresent),
        switchMap((leaveTypes) =>
          leaveTypes.length > 0 ? this.openCreateLeaveRequestDialog(leaveTypes) : this.handleEmptyLeaveEntitlements()
        )
      )
    );
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

  get userId(): string {
    return this.authService.get('userInfo', 'userId');
  }

  private openCreateLeaveRequestDialog(data: RemainingLeaveEntitlement[]): Observable<unknown> {
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
