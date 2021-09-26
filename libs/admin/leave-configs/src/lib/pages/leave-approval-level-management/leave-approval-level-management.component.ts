import { ChangeDetectionStrategy, Component, Inject, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState, setProp } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { UpsertLeaveApprovalLevelDialogComponent } from '../../components/upsert-leave-approval-level-dialog/upsert-leave-approval-level-dialog.component';
import { LeaveConfigAPIUrlPath, LeaveConfigsService } from '../../leave-configs.service';
import { LeaveApprovalLevel } from '../../models/leave-approval-level';

@Component({
  selector: 'hcm-leave-approval-level-management',
  templateUrl: './leave-approval-level-management.component.html',
  styleUrls: ['./leave-approval-level-management.component.scss'],
  providers: [TuiDestroyService, RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveApprovalLevelManagementComponent extends AbstractServerSortPaginationTableComponent<LeaveApprovalLevel> {
  readonly leaveConfigAPIUrlPath = LeaveConfigAPIUrlPath.ApprovalLevel;
  @ViewChild('table') table!: BaseComponent;

  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_LEAVE_LEVEL_APPROVE_MANAGEMENT_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'leaveType', title: result.leaveType },
        { key: 'jobTitle', title: result.jobTitle },
        { key: 'totalLeave', title: result.totalLeave },
        { key: 'functions', title: result.functions, orderEnabled: false },
      ])
    );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.leaveConfigsService
        .getConfig<LeaveApprovalLevel>(this.leaveConfigAPIUrlPath, this.queryParams$.value)
        .pipe(startWith(null))
    ),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly scope: TranslocoScope,
    readonly state: RxState<Pagination<LeaveApprovalLevel>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private destroy$: TuiDestroyService,
    private leaveConfigsService: LeaveConfigsService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)), (state, data) =>
      setProp(
        data,
        'items',
        data.items.map((item) => LeaveApprovalLevelManagementComponent.getJobTitleName(item))
      )
    );
  }

  private static getJobTitleName(levelApprove: LeaveApprovalLevel): LeaveApprovalLevel {
    if (!levelApprove.jobTitleDTOList) {
      return levelApprove;
    }
    levelApprove.jobTitlesName = levelApprove.jobTitleDTOList
      .map((jobTitle) => jobTitle.name)
      .filter(isPresent)
      .join(', ');
    return levelApprove;
  }

  onAddLeaveLevel(): void {
    this.openDialog('addLeaveLevelApprove')
      .pipe(
        switchMap((data) => this.leaveConfigsService.create<LeaveApprovalLevel>(this.leaveConfigAPIUrlPath, data)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('addLeaveLevelApproveSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }

  onRemoveLeaveLevel(id: string): void {
    if (id) {
      from(
        this.promptService.open({
          icon: 'question',
          html: this.translocoService.translate('deleteLeaveApprovalLevel'),
          showCancelButton: true,
        })
      )
        .pipe(
          filter((result) => result.isConfirmed),
          switchMap(() => this.leaveConfigsService.delete<LeaveApprovalLevel>(this.leaveConfigAPIUrlPath, id)),
          takeUntil(this.destroy$)
        )
        .subscribe(
          this.promptService.handleResponse('removeEmployeeSuccessfully', () =>
            this.queryParams$.next(this.queryParams$.value)
          )
        );
    }
  }

  onEditLeaveLevelApprove(levelApprove: LeaveApprovalLevel): void {
    this.openDialog('editLeaveLevelApprove', levelApprove)
      .pipe(
        switchMap((data) => this.leaveConfigsService.edit<LeaveApprovalLevel>(this.leaveConfigAPIUrlPath, data)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('updateLeaveLevelApproveSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }

  private openDialog(label: string, data?: LeaveApprovalLevel): Observable<LeaveApprovalLevel> {
    return this.dialogService.open<LeaveApprovalLevel>(
      new PolymorpheusComponent(UpsertLeaveApprovalLevelDialogComponent, this.injector),
      {
        label: this.translocoService.translate(label),
        size: 'l',
        data,
      }
    );
  }
}
