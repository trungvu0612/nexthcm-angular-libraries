import { ChangeDetectionStrategy, Component, Inject, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, iif, Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AdminLeaveConfigsService } from '../../admin-leave-configs.service';
import { UpsertLeaveEntitlementDialogComponent } from '../../components/upsert-leave-entitlement/upsert-leave-entitlement-dialog.component';
import { LeaveConfigUrlPaths } from '../../models/leave-config-url-paths';
import { LeaveEntitlement } from '../../models/leave-entitlement';

@Component({
  selector: 'hcm-leave-entitlement-management',
  templateUrl: './leave-entitlement-management.component.html',
  styleUrls: ['./leave-entitlement-management.component.scss'],
  providers: [TuiDestroyService, RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveEntitlementManagementComponent extends AbstractServerSortPaginationTableComponent<LeaveEntitlement> {
  @ViewChild('table') table!: BaseComponent;

  readonly leaveConfigAPIUrlPath: keyof LeaveConfigUrlPaths = 'leaveEntitlement';
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('LEAVE_ENTITLEMENT_MANAGEMENT_COLUMNS', {}, (this.scope as ProviderScope).scope)
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
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.leaveConfigsService
        .getConfig<LeaveEntitlement>(this.leaveConfigAPIUrlPath, this.queryParams$.value)
        .pipe(startWith(null))
    ),
    shareReplay(1)
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly state: RxState<Pagination<LeaveEntitlement>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly destroy$: TuiDestroyService,
    private readonly leaveConfigsService: AdminLeaveConfigsService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onUpsertLeaveType(data?: LeaveEntitlement): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertLeaveEntitlementDialogComponent, this.injector), {
        label: this.translocoService.translate(
          data ? 'leaveConfigs.editLeaveEntitlement' : 'leaveConfigs.createLeaveEntitlement'
        ),
        size: 'l',
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.queryParams$.next(this.queryParams$.value));
  }

  onRemoveLeaveEntitlement(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('leaveConfigs.removeLeaveEntitlement'),
        showCancelButton: true,
      })
    )
      .pipe(
        switchMap((result) =>
          iif(() => result.isConfirmed, this.leaveConfigsService.delete(this.leaveConfigAPIUrlPath, id))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('leaveConfigs.removeLeaveEntitlementSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
