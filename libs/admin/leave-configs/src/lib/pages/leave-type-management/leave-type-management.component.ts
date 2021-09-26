import { ChangeDetectionStrategy, Component, Inject, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { UpsertLeaveTypeDialogComponent } from '../../components/upsert-leave-type-dialog/upsert-leave-type-dialog.component';
import { PaidLeaveStatus } from '../../enums/paid-leave-status';
import { LeaveConfigAPIUrlPath, LeaveConfigsService } from '../../leave-configs.service';
import { LeaveType } from '../../models/leave-type';

@Component({
  selector: 'hcm-leave-type-management',
  templateUrl: './leave-type-management.component.html',
  styleUrls: ['./leave-type-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class LeaveTypeManagementComponent extends AbstractServerSortPaginationTableComponent<LeaveType> {
  readonly leaveConfigAPIUrlPath = LeaveConfigAPIUrlPath.Type;
  @ViewChild('table') table!: BaseComponent;
  readonly PaidLeaveStatus = PaidLeaveStatus;
  columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_LEAVE_TYPES.LEAVE_TYPES_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: 'paidLeave', title: result.paidLeave },
        { key: 'operations', title: result.operations, orderEnabled: false },
      ])
    );
  activeItemIndex = 0;
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.leaveConfigsService
        .getConfig<LeaveType>(this.leaveConfigAPIUrlPath, this.queryParams$.value)
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
    readonly state: RxState<Pagination<LeaveType>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private leaveConfigsService: LeaveConfigsService,
    private leaveTypeService: LeaveConfigsService,
    private destroy$: TuiDestroyService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onAddLeaveLevel(): void {
    this.openDialog('addLeaveLevelApprove')
      .pipe(
        switchMap((data) => this.leaveConfigsService.create<LeaveType>(this.leaveConfigAPIUrlPath, data)),
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
          switchMap(() => this.leaveConfigsService.delete(this.leaveConfigAPIUrlPath, id)),
          takeUntil(this.destroy$)
        )
        .subscribe(
          this.promptService.handleResponse('removeEmployeeSuccessfully', () =>
            this.queryParams$.next(this.queryParams$.value)
          )
        );
    }
  }

  onEditLeaveLevelApprove(leaveType: LeaveType): void {
    this.openDialog('editLeaveLevelApprove', leaveType)
      .pipe(
        switchMap((data) => this.leaveConfigsService.edit<LeaveType>(this.leaveConfigAPIUrlPath, data)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('updateLeaveLevelApproveSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }

  private openDialog(label: string, data?: LeaveType): Observable<LeaveType> {
    return this.dialogService.open<LeaveType>(
      new PolymorpheusComponent(UpsertLeaveTypeDialogComponent, this.injector),
      {
        label: this.translocoService.translate(label),
        size: 'l',
        data,
      }
    );
  }
}
