import { ChangeDetectionStrategy, Component, Inject, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { EMPTY, from, iif, Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AdminLeaveConfigsService } from '../../admin-leave-configs.service';
import { UpsertLeaveApprovalLevelDialogComponent } from '../../components/upsert-leave-approval-level-dialog/upsert-leave-approval-level-dialog.component';
import { LeaveConfigUrlPaths } from '../../models/leave-config-url-paths';
import { LeaveLevelApproval } from '../../models/leave-level-approval';

@Component({
  selector: 'hcm-leave-level-approval-management',
  templateUrl: './leave-level-approval-management.component.html',
  styleUrls: ['./leave-level-approval-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class LeaveLevelApprovalManagementComponent extends AbstractServerSortPaginationTableComponent<LeaveLevelApproval> {
  @ViewChild('table') table!: BaseComponent;

  readonly leaveConfigAPIUrlPath: keyof LeaveConfigUrlPaths = 'leaveLevelApproval';
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('LEAVE_LEVEL_APPROVAL_MANAGEMENT_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'leaveType', title: result.leaveType },
        { key: 'jobTitles', title: result.jobTitles, orderEnabled: false },
        { key: 'totalLeave', title: result.entitlement, cssClass: { name: 'text-center', includeHeader: true } },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.leaveConfigsService
        .getConfig<LeaveLevelApproval>(this.leaveConfigAPIUrlPath, this.queryParams$.value)
        .pipe(startWith(null))
    ),
    shareReplay(1)
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly state: RxState<Pagination<LeaveLevelApproval>>,
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

  onUpsertLeaveType(data?: LeaveLevelApproval): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertLeaveApprovalLevelDialogComponent, this.injector), {
        label: this.translocoService.translate(
          data ? 'leaveConfigs.editLeaveLevelApproval' : 'leaveConfigs.createLeaveLevelApproval'
        ),
        size: 'l',
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.queryParams$.next(this.queryParams$.value));
  }

  onRemoveLeaveLevelApproval(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('leaveConfigs.removeLeaveLevelApproval'),
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
        this.promptService.handleResponse('leaveConfigs.removeLeaveLevelApprovalSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
