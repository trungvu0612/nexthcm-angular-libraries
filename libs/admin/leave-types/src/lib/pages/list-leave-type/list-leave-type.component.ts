import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Pagination, PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { BaseComponent, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PaidLeaveStatus } from '../../enums/paid-leave-status';
import { LeaveTypesService } from '../../leave-types.service';
import { LeaveType } from '../../models/leave-type';

@Component({
  selector: 'hcm-list-leave-type',
  templateUrl: './list-leave-type.component.html',
  styleUrls: ['./list-leave-type.component.scss'],
  providers: [RxState, TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListLeaveTypeComponent {
  @ViewChild('table') table!: BaseComponent;
  readonly PaidLeaveStatus = PaidLeaveStatus;
  readonly loading$ = this.state.$.pipe(map((value) => !value));
  readonly data$ = this.state.select('items');
  readonly total$ = this.state.select('totalElements');
  configuration: Config = {
    ...DefaultConfig,
    checkboxes: false,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
  };
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
  leaveTypes!: LeaveType[];

  private readonly queryParams$ = new BehaviorSubject(new HttpParams().set('page', 0).set('size', 10));
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.leaveTypeService.getLeaveTypes(this.queryParams$.value)),
    map((res) => res.data)
  );

  constructor(
    private leaveTypeService: LeaveTypesService,
    private formBuilder: FormBuilder,
    private state: RxState<Pagination<LeaveType>>,
    private destroy$: TuiDestroyService,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    state.connect(this.request$);
  }

  readonly item = (item: LeaveType) => item;

  tableEventEmitted(tableEvent: { event: string; value: any }): void {
    if (tableEvent.event === 'onOrder') {
      this.queryParams$.next(this.queryParams$.value.set('sort', `${tableEvent.value.key},${tableEvent.value.order}`));
    }
  }

  onSize(size: number): void {
    this.queryParams$.next(this.queryParams$.value.set('size', size.toString()));
  }

  onPage(page: number): void {
    this.queryParams$.next(this.queryParams$.value.set('page', page.toString()));
  }

  delete(id: string): void {
    if (!id) {
      console.error(`Id = ${id}, cannot delete`);
    }
    // if (id) {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('ADMIN_LEAVE_TYPES.MESSAGES.deleteLeaveType'),
        showCancelButton: true,
      })
    )
      .pipe(
        filter((result) => result.isConfirmed),
        switchMap(() =>
          this.leaveTypeService.delete(id).pipe(tap(() => this.queryParams$.next(this.queryParams$.value)))
        ),
        catchError((err) =>
          this.promptService.open({
            icon: 'error',
            html: this.translocoService.translate(`ERRORS.${err.error.message}`),
          })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
