import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { Pagination, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState, setProp } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { format } from 'date-fns';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LeaveRequest } from '../../../../models';
import { MyTimeService, RequestTypeUrlPath } from '../../../../services/my-time.service';
import { AbstractRequestListComponent } from '../../abstract-components/abstract-request-list.component';

@Component({
  selector: 'hcm-leave-request-list',
  templateUrl: './leave-request-list.component.html',
  styleUrls: ['./leave-request-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class LeaveRequestListComponent extends AbstractRequestListComponent<LeaveRequest> {
  @ViewChild('table') table!: BaseComponent;
  readonly requestTypeUrlPath = RequestTypeUrlPath.leave;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('REQUEST_MANAGEMENT_TABLE_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'cif', title: result.cif },
        { key: 'name', title: result.name },
        { key: 'dateRange', title: result.dateRange },
        { key: 'leaveType', title: result.leaveType },
        { key: 'days', title: result.days },
        { key: 'status', title: result.status },
        { key: 'comment', title: result.comment },
        { key: 'functions', title: result.functions },
      ])
    );
  readonly queryParams$ = new BehaviorSubject(
    new HttpParams()
      .set('page', '0')
      .set('size', 10)
      .set('orgId', this.authService.get('userInfo', 'orgId') as string)
  );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.myTimeService.getRequests<LeaveRequest>(this.requestTypeUrlPath, this.queryParams$.value))
  );

  constructor(
    public myTimeService: MyTimeService,
    public destroy$: TuiDestroyService,
    public state: RxState<Pagination<LeaveRequest>>,
    private translocoService: TranslocoService,
    private promptService: PromptService,
    private authService: AuthService
  ) {
    super(state);
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
}
