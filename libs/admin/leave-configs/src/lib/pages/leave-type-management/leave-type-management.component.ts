import { ChangeDetectionStrategy, Component, Inject, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { LeaveType } from '@nexthcm/my-time';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, iif, Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AdminLeaveConfigsService } from '../../admin-leave-configs.service';
import { UpsertLeaveTypeDialogComponent } from '../../components/upsert-leave-type-dialog/upsert-leave-type-dialog.component';
import { PaidLeaveStatus } from '../../enums/paid-leave-status';
import { LeaveConfigUrlPaths } from '../../models/leave-config-url-paths';

@Component({
  selector: 'hcm-leave-type-management',
  templateUrl: './leave-type-management.component.html',
  styleUrls: ['./leave-type-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class LeaveTypeManagementComponent extends AbstractServerSortPaginationTableComponent<LeaveType> {
  @ViewChild('table') table!: BaseComponent;

  readonly leaveConfigAPIUrlPath: keyof LeaveConfigUrlPaths = 'leaveType';
  readonly PaidLeaveStatus = PaidLeaveStatus;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('LEAVE_TYPES_MANAGEMENT_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: 'paidLeave', title: result.paidLeave, cssClass: { name: 'text-center', includeHeader: true } },
        {
          key: 'paidLeaveTransfer',
          title: result.canTransferTo,
          cssClass: { name: 'text-center', includeHeader: true },
        },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.leaveConfigsService
        .getConfig<LeaveType>(this.leaveConfigAPIUrlPath, this.queryParams$.value)
        .pipe(startWith(null))
    ),
    shareReplay(1)
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly state: RxState<Pagination<LeaveType>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly leaveConfigsService: AdminLeaveConfigsService,
    private readonly leaveTypeService: AdminLeaveConfigsService,
    private readonly destroy$: TuiDestroyService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onUpsertLeaveType(data?: LeaveType): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertLeaveTypeDialogComponent, this.injector), {
        label: this.translocoService.translate(data ? 'leaveConfigs.editLeaveType' : 'leaveConfigs.createLeaveType'),
        size: 'l',
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.queryParams$.next(this.queryParams$.value));
  }

  onRemoveLeaveType(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('leaveConfigs.removeLeaveType'),
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
        this.promptService.handleResponse('leaveConfigs.removeLeaveTypeSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
