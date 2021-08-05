import { Component, Injector } from '@angular/core';
import {
  AbstractServerPaginationTableComponent,
  Pagination,
  PromptService,
  ServerPaginationTableComponent,
} from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Columns } from 'ngx-easy-table';
import { from, iif, Observable } from 'rxjs';
import { map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { RequestStatus } from '../../../../enums';
import { UpdateRequestPayload, UpdateTimesheetRequest } from '../../../../models';
import { MyTimeService, RequestTypeUrlPath } from '../../../../services/my-time.service';
import { RejectRequestDialogComponent } from '../../components/reject-leave-request-dialog/reject-request-dialog.component';

@Component({
  selector: 'hcm-update-timesheet-request-list',
  templateUrl: './update-timesheet-request-list.component.html',
  styleUrls: ['./update-timesheet-request-list.component.scss'],
  providers: [TuiDestroyService, RxState],
})
export class UpdateTimesheetRequestListComponent
  extends AbstractServerPaginationTableComponent<UpdateTimesheetRequest>
  implements ServerPaginationTableComponent<UpdateTimesheetRequest>
{
  columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('REQUEST_MANAGEMENT_TABLE_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'cif', title: result.cif },
        { key: 'from', title: result.from },
        { key: 'date', title: result.date },
        { key: 'newTimeIn', title: result.newTimeIn },
        { key: 'newTimeOut', title: result.newTimeOut },
        { key: 'status', title: result.status },
        { key: 'comment', title: result.comment },
        { key: 'functions', title: result.functions },
      ])
    );
  readonly RequestStatus = RequestStatus;
  readonly loading$ = this.state.select().pipe(
    map((value) => !value),
    startWith(true)
  );
  readonly data$ = this.state.select('items');
  readonly total$ = this.state.select('totalElements');
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.myTimeService.getRequests<UpdateTimesheetRequest>(
        RequestTypeUrlPath.updateTimeSheet,
        this.queryParams$.value
      )
    )
  );

  constructor(
    private translocoService: TranslocoService,
    private myTimeService: MyTimeService,
    private state: RxState<Pagination<UpdateTimesheetRequest>>,
    private promptService: PromptService,
    private destroy$: TuiDestroyService,
    private dialogService: TuiDialogService,
    private injector: Injector
  ) {
    super();
    state.connect(this.request$);
  }

  onViewRequestDetail(id: string): void {
    //
  }

  onApproveRequest(id: string): void {
    from(
      this.promptService.open({
        icon: 'warning',
        showCancelButton: true,
        html: this.translocoService.translate('approveLeaveRequestWarning'),
      } as SweetAlertOptions)
    )
      .pipe(
        switchMap((result) => iif(() => result.isConfirmed, this.updateRequest(id, { status: 1 }))),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onRejectRequest(id: string): void {
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
      .updateRequest(RequestTypeUrlPath.updateTimeSheet, id, payload)
      .pipe(tap(this.promptService.handleResponse('', () => this.queryParams$.next(this.queryParams$.value))));
  }
}
