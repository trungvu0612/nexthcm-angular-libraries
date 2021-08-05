import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import {
  AbstractServerPaginationTableComponent,
  Pagination,
  PromptService,
  ServerPaginationTableComponent,
} from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState, setProp } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { format } from 'date-fns';
import { Columns } from 'ngx-easy-table';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { RequestStatus } from '../../../../enums';
import { LeaveRequest } from '../../../../models';
import { MyTimeService, RequestTypeUrlPath } from '../../../../services/my-time.service';

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
  readonly requestTypeUrlPath = RequestTypeUrlPath.leave;
  columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('REQUEST_MANAGEMENT_TABLE_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'cif', title: result.cif },
        { key: 'from', title: result.from },
        { key: 'dateRange', title: result.dateRange },
        { key: 'leaveType', title: result.leaveType },
        { key: 'days', title: result.days },
        { key: 'status', title: result.status },
        { key: 'comment', title: result.comment },
        { key: 'functions', title: result.functions },
      ])
    );
  readonly RequestStatus = RequestStatus;
  readonly queryParams$ = new BehaviorSubject(
    new HttpParams()
      .set('page', '0')
      .set('size', 10)
      .set('orgId', this.authService.get('userInfo', 'orgId') as string)
  );
  readonly loading$ = this.state.select().pipe(
    map((value) => !value),
    startWith(true)
  );
  readonly data$ = this.state.select('items');
  readonly total$ = this.state.select('totalElements');
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.myTimeService.getRequests<LeaveRequest>(this.requestTypeUrlPath, this.queryParams$.value))
  );

  constructor(
    private translocoService: TranslocoService,
    private myTimeService: MyTimeService,
    private state: RxState<Pagination<LeaveRequest>>,
    private promptService: PromptService,
    private destroy$: TuiDestroyService,
    private authService: AuthService
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
    this.myTimeService
      .approveRequest(this.requestTypeUrlPath, id, () => this.queryParams$.next(this.queryParams$.value))
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  onRejectLeaveRequest(id: string): void {
    this.myTimeService
      .rejectRequest(this.requestTypeUrlPath, id, () => this.queryParams$.next(this.queryParams$.value))
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
