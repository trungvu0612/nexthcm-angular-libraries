import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Columns } from 'ngx-easy-table';
import { EMPTY, from, iif, Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

import { AdminLeaveConfigsService } from '../../admin-leave-configs.service';
import { UpsertLeaveEntitlementDialogComponent } from '../../components/upsert-leave-entitlement/upsert-leave-entitlement-dialog.component';
import { LeaveConfigUrlPaths, LeaveEntitlement } from '../../models';

@Component({
  selector: 'hcm-leave-entitlement-management',
  templateUrl: './leave-entitlement-management.component.html',
  styleUrls: ['./leave-entitlement-management.component.scss'],
  providers: [TuiDestroyService, RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveEntitlementManagementComponent
  extends AbstractServerSortPaginationTableComponent<LeaveEntitlement>
  implements AfterViewInit
{
  readonly leaveConfigAPIUrlPath: keyof LeaveConfigUrlPaths = 'leaveEntitlement';
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('LEAVE_ENTITLEMENT_MANAGEMENT_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'leaveType', title: result.leaveType },
        { key: 'fromDate', title: result.fromDate },
        { key: 'toDate', title: result.toDate },
        { key: 'jobTitle', title: result.jobTitle },
        { key: 'orgDTO', title: result.department, orderEnabled: false },
        { key: 'employeeDTO', title: result.employee, orderEnabled: false },
        { key: 'entitlement', title: result.entitlement, cssClass: { name: 'text-center', includeHeader: true } },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  private readonly request$ = this.fetch$.pipe(
    switchMap(() =>
      this.leaveConfigsService
        .getConfig<LeaveEntitlement>(this.leaveConfigAPIUrlPath, this.queryParams)
        .pipe(startWith(null))
    ),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    override readonly state: RxState<Pagination<LeaveEntitlement>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    private readonly destroy$: TuiDestroyService,
    private readonly leaveConfigsService: AdminLeaveConfigsService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService
  ) {
    super(state, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onUpsertLeaveType(data?: LeaveEntitlement): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertLeaveEntitlementDialogComponent, this.injector), {
        label: this.translocoService.translate(
          `${this.translocoScope.scope}.${data ? 'editLeaveEntitlement' : 'createLeaveEntitlement'}`
        ),
        size: 'l',
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.fetch$.next());
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.activatedRoute.queryParamMap
      .pipe(
        map((queryParamMap) => queryParamMap.get('leaveEntitlementId')),
        filter(isPresent),
        switchMap((leaveEntitlementId) => this.leaveConfigsService.getLeaveEntitlements(leaveEntitlementId)),
        filter(isPresent),
        tap((leaveEntitlements) => {
          this.onUpsertLeaveType(leaveEntitlements);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onRemoveLeaveEntitlement(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate(`${this.translocoScope.scope}.removeLeaveEntitlement`),
        showCancelButton: true,
      })
    )
      .pipe(
        switchMap((result) =>
          iif(() => result.isConfirmed, this.leaveConfigsService.delete(this.leaveConfigAPIUrlPath, id), EMPTY)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse(`${this.translocoScope.scope}.removeLeaveEntitlementSuccessfully`, () =>
          this.fetch$.next()
        )
      );
  }
}
