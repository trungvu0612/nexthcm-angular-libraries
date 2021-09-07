import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { AbstractServerPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, Observable } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { UpsertLeaveConfigComponent } from '../../components/upsert-leave-configs/upsert-leave-configs.component';
import { PaidLeaveStatus } from '../../enums/paid-leave-status';
import { LeaveConfigAPIUrlPath, LeaveConfigsService } from '../../leave-configs.service';
import { LeaveConfig } from '../../models/leave-config';

@Component({
  selector: 'hcm-list-leave-type',
  templateUrl: './list-leave-configs.component.html',
  styleUrls: ['./list-leave-configs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class ListLeaveConfigsComponent extends AbstractServerPaginationTableComponent<LeaveConfig> {
  readonly leaveConfigAPIUrlPath = LeaveConfigAPIUrlPath.leaveType;
  @ViewChild('table') table!: BaseComponent;
  readonly PaidLeaveStatus = PaidLeaveStatus;
  columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_LEAVE_TYPES.LEAVE_TYPES_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: 'createdDate', title: result.createdDate },
        { key: 'paidLeave', title: result.paidLeave },
        { key: 'operations', title: result.operations },
      ])
    );
  activeItemIndex = 0;
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.leaveConfigsService.getConfig<LeaveConfig>(this.leaveConfigAPIUrlPath, this.queryParams$.value)
    ),
    map((res) => res.data)
  );
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    public state: RxState<Pagination<LeaveConfig>>,
    private leaveConfigsService: LeaveConfigsService,
    private leaveTypeService: LeaveConfigsService,
    private destroy$: TuiDestroyService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onAddLeaveLevel(): void {
    this.openDialog('addLeaveLevelApprove')
      .pipe(
        switchMap((data) => this.leaveConfigsService.create<LeaveConfig>(this.leaveConfigAPIUrlPath, data)),
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
          html: this.translocoService.translate('deleteLeaveLevelApprove'),
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

  onEditLeaveLevelApprove(leaveType: LeaveConfig): void {
    this.openDialog('editLeaveLevelApprove', leaveType)
      .pipe(
        switchMap((data) => this.leaveConfigsService.edit<LeaveConfig>(this.leaveConfigAPIUrlPath, data)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('updateLeaveLevelApproveSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }

  private openDialog(label: string, data?: LeaveConfig): Observable<LeaveConfig> {
    return this.dialogService.open<LeaveConfig>(new PolymorpheusComponent(UpsertLeaveConfigComponent, this.injector), {
      label: this.translocoService.translate(label),
      size: 'l',
      data,
    });
  }
}
