import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { AbstractServerPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, Observable } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { UpsertLeaveLevelApproveDialogComponent } from '../../../../../leave-level-approve/src/lib/components/upsert-leave-level-approve/upsert-leave-level-approve-dialog.component';
import { LevelApprove } from '../../../../../leave-level-approve/src/lib/models/level-approve';
import { PaidLeaveStatus } from '../../enums/paid-leave-status';
import { LeaveTypesService } from '../../leave-types.service';
import { LeaveType } from '../../models/leave-type';
import { UpsertLeaveTypeComponent } from '../upsert-leave-type/upsert-leave-type.component';

@Component({
  selector: 'hcm-list-leave-type',
  templateUrl: './list-leave-type.component.html',
  styleUrls: ['./list-leave-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class ListLeaveTypeComponent extends AbstractServerPaginationTableComponent<LeaveType> {
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

  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.leaveTypeService.getLeaveTypes(this.queryParams$.value)),
    map((res) => res.data)
  );
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    public state: RxState<Pagination<LeaveType>>,
    private leaveTypeService: LeaveTypesService,
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
        switchMap((data) => this.leaveTypeService.createLeaveType(data)),
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
          switchMap(() => this.leaveTypeService.delete(id)),
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
        switchMap((data) => this.leaveTypeService.editLeaveType(data)),
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
      new PolymorpheusComponent(UpsertLeaveTypeComponent, this.injector),
      {
        label: this.translocoService.translate(label),
        size: 'l',
        data,
      }
    );
  }
}
