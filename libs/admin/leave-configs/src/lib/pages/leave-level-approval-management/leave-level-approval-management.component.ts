import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Columns } from 'ngx-easy-table';
import { EMPTY, from, iif, Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { AdminLeaveConfigsService } from '../../admin-leave-configs.service';
import { UpsertLeaveApprovalLevelDialogComponent } from '../../components/upsert-leave-approval-level-dialog/upsert-leave-approval-level-dialog.component';
import { LeaveConfigUrlPaths, LeaveLevelApproval } from '../../models';

@Component({
  selector: 'hcm-leave-level-approval-management',
  templateUrl: './leave-level-approval-management.component.html',
  styleUrls: ['./leave-level-approval-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class LeaveLevelApprovalManagementComponent extends AbstractServerSortPaginationTableComponent<LeaveLevelApproval> {
  readonly leaveConfigAPIUrlPath: keyof LeaveConfigUrlPaths = 'leaveLevelApproval';
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('LEAVE_LEVEL_APPROVAL_MANAGEMENT_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'leaveType', title: result.leaveType },
        { key: 'jobTitles', title: result.jobTitles, orderEnabled: false },
        { key: 'totalLeave', title: result.entitlement, cssClass: { name: 'text-center', includeHeader: true } },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  private readonly request$ = this.fetch$.pipe(
    switchMap(() =>
      this.leaveConfigsService
        .getConfig<LeaveLevelApproval>(this.leaveConfigAPIUrlPath, this.queryParams)
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
    override readonly state: RxState<Pagination<LeaveLevelApproval>>,
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

  onUpsertLeaveType(data?: LeaveLevelApproval): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertLeaveApprovalLevelDialogComponent, this.injector), {
        label: this.translocoService.translate(
          `${this.translocoScope.scope}.${data ? 'editLeaveLevelApproval' : 'createLeaveLevelApproval'}`
        ),
        size: 'l',
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.fetch$.next());
  }

  onRemoveLeaveLevelApproval(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate(`${this.translocoScope.scope}.removeLeaveLevelApproval`),
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
        this.promptService.handleResponse(`${this.translocoScope.scope}.removeLeaveLevelApprovalSuccessfully`, () =>
          this.fetch$.next()
        )
      );
  }
}
