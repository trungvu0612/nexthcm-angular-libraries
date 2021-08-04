import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import {
  AbstractServerPaginationTableComponent,
  Pagination,
  PromptService,
  ServerPaginationTableComponent,
} from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState, setProp } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { format } from 'date-fns';
import { Columns } from 'ngx-easy-table';
import { from, iif, Observable } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { RequestStatus } from '../../../../enums';
import { LeaveRequest, UpdateRequestPayload } from '../../../../models';
import { MyTimeService, RequestTypesUrlPath } from '../../../../services/my-time.service';
import { RejectRequestDialogComponent } from '../../components/reject-leave-request-dialog/reject-request-dialog.component';

@Component({
  selector: 'hcm-leave-request-list',
  templateUrl: './leave-request-list.component.html',
  styleUrls: ['./leave-request-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class LeaveRequestListComponent
  extends AbstractServerPaginationTableComponent<LeaveRequest>
  implements ServerPaginationTableComponent<LeaveRequest>
{
  columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('REQUEST_MANAGEMENT_LEAVE_REQUEST_TABLE_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'dateRange', title: result.dateRange },
        { key: 'from', title: result.from },
        { key: 'leaveType', title: result.leaveType },
        { key: 'days', title: result.days },
        { key: 'status', title: result.status },
        { key: 'comment', title: result.comment },
        { key: 'functions', title: result.functions },
      ])
    );
  readonly RequestStatus = RequestStatus;
  readonly loading$ = this.state.$.pipe(map((value) => !value));
  readonly data$ = this.state.select('items').pipe();
  readonly total$ = this.state.select('totalElements');
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.myTimeService.getRequests<LeaveRequest>(RequestTypesUrlPath.leave, this.queryParams$.value))
  );

  constructor(
    private translocoService: TranslocoService,
    private myTimeService: MyTimeService,
    private state: RxState<Pagination<LeaveRequest>>,
    private promptService: PromptService,
    private destroy$: TuiDestroyService,
    private dialogService: TuiDialogService,
    private injector: Injector
  ) {
    super();
    state.connect(this.request$, (state, data) =>
      setProp(
        data,
        'items',
        data.items.map((item) => LeaveRequestListComponent.parseLeaveDateRange(item))
      )
    );
  }

  private static parseLeaveDateRange(item: LeaveRequest): LeaveRequest {
    if (item.durationInDay === 1) {
      item.dateRange = `${format(item.fromDate, 'MM/dd/yyyy')}`;
    } else if (item.durationInDay < 1) {
      item.dateRange = `${format(item.fromDate, 'MM/dd/yyyy')} (${format(item.fromDate, 'HH:mm')} - ${format(
        item.toDate,
        'HH:mm'
      )})`;
    } else {
      item.dateRange = `${format(item.fromDate, 'MM/dd/yyyy')} - ${format(item.toDate, 'MM/dd/yyyy')}`;
    }
    return item;
  }

  onViewLeaveRequestDetail(id: string): void {
    //
  }

  onApproveLeaveRequest(id: string): void {
    from(
      this.promptService.open({
        icon: 'warning',
        showCancelButton: true,
        text: this.translocoService.translate('approveLeaveRequestWarning'),
      } as SweetAlertOptions)
    )
      .pipe(
        switchMap((result) => iif(() => result.isConfirmed, this.updateRequest(id, { status: 1 }))),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onRejectLeaveRequest(id: string): void {
    this.dialogService
      .open<UpdateRequestPayload>(new PolymorpheusComponent(RejectRequestDialogComponent, this.injector), {
        label: 'rejectLeaveRequest',
      })
      .pipe(
        switchMap((payload) => this.updateRequest(id, payload)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private updateRequest(id: string, payload: UpdateRequestPayload): Observable<unknown> {
    return this.myTimeService
      .updateRequest(RequestTypesUrlPath.leave, id, payload)
      .pipe(tap(this.promptService.handleResponse('', () => this.queryParams$.next(this.queryParams$.value))));
  }
}
