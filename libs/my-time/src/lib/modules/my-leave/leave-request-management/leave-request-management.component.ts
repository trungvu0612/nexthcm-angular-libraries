import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { AbstractServerPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { RxState, setProp } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, share, startWith, switchMap } from 'rxjs/operators';
import { RequestStatus } from '../../../enums';
import { LeaveRequest } from '../../../models';
import { MyLeaveService } from '../../../services/my-leave.service';
import { MyTimeService, RequestTypeAPIUrlPath } from '../../../services/my-time.service';
import { parseLeaveDateRange } from '../../shared/utils/parse-leave-date-range';
import { SubmitLeaveRequestDialogComponent } from '../submit-leave-request-dialog/submit-leave-request-dialog.component';

@Component({
  selector: 'hcm-leave-request-management',
  templateUrl: './leave-request-management.component.html',
  styleUrls: ['./leave-request-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class LeaveRequestManagementComponent extends AbstractServerPaginationTableComponent<LeaveRequest> {
  @ViewChild('table') table!: BaseComponent;
  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
  };
  readonly requestTypeUrlPath = RequestTypeAPIUrlPath.leave;
  readonly columns$: Observable<Columns[]> = this.translocoService.selectTranslateObject('MY_LEAVE_TABLE_COLUMNS').pipe(
    map((result) => [
      { key: 'fromDate', title: result.fromDate },
      { key: 'toDate', title: result.toDate },
      { key: 'leaveType', title: result.leaveType },
      { key: 'days', title: result.days },
      { key: 'status', title: result.status },
      { key: 'comment', title: result.comment },
      { key: 'sendTo', title: result.sendTo },
      { key: 'functions', title: result.functions },
    ])
  );
  readonly queryParams$ = new BehaviorSubject(
    new HttpParams()
      .set('page', 0)
      .set('size', 10)
      .set('orgId', this.authService.get('userInfo', 'orgId') as string)
  );

  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.myTimeService
        .getRequests<LeaveRequest>(this.requestTypeUrlPath, this.queryParams$.value)
        .pipe(startWith(null))
    ),
    share()
  );

  readonly loading$ = this.request$.pipe(map((value) => !value));
  readonly RequestStatus = RequestStatus;

  constructor(
    public destroy$: TuiDestroyService,
    public state: RxState<Pagination<LeaveRequest>>,
    private fb: FormBuilder,
    private injector: Injector,
    private translocoService: TranslocoService,
    private promptService: PromptService,
    private authService: AuthService,
    private router: Router,
    private dialogService: TuiDialogService,
    private myLeaveService: MyLeaveService,
    private myTimeService: MyTimeService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)), (state, data) =>
      setProp(
        data,
        'items',
        data.items.map((item) => parseLeaveDateRange(item))
      )
    );
  }

  showLeaveDetail(leaveId: string): void {
    this.router.navigateByUrl(`/my-time/my-leave/${leaveId}/detail`);
  }

  showDialogSubmit() {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(SubmitLeaveRequestDialogComponent, this.injector), {
        closeable: false,
      })
      .subscribe((data) => {
        this.myLeaveService.createLeave(data).subscribe((data) => {
        });
      });
  }
}
