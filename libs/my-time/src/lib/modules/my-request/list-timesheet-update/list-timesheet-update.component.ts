import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, share, startWith, switchMap } from 'rxjs/operators';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { MyTimeService, RequestTypeAPIUrlPath } from '../../../services/my-time.service';
import { HttpParams } from '@angular/common/http';
import { RxState } from '@rx-angular/state';
import { Pagination } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { AuthService } from '@nexthcm/auth';
import { AbstractRequestListComponent } from '../../shared/abstract-components/abstract-request-list.component';
import { UpdateTimesheetRequest } from '../../../models';

@Component({
  selector: 'hcm-list-timesheet-update',
  templateUrl: './list-timesheet-update.component.html',
  styleUrls: ['./list-timesheet-update.component.scss'],
  providers: [RxState, TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListTimesheetUpdateComponent extends AbstractRequestListComponent<UpdateTimesheetRequest> {
  @ViewChild('table') table!: BaseComponent;
  readonly userId = this.authService.get('userInfo', 'userId');
  readonly requestTypeUrlPath = RequestTypeAPIUrlPath.updateTimesheet;
  readonly columns$: Observable<Columns[]> = this.translocoService.selectTranslateObject('TIMESHEET_MANAGEMENT').pipe(
    map((result) => [
      { key: 'trackingDate', title: result.trackingDate },
      { key: 'newInTime', title: result.newInTime },
      { key: 'newOutTime', title: result.newOutTime },
      { key: 'updateTotalTime', title: result.updateTotalTime },
      { key: 'status', title: result.status },
      { key: 'functions', title: result.functions }
    ])
  );
  readonly queryParams$ = new BehaviorSubject(
    new HttpParams().set('page', 0).set('size', 10).set('userId', this.userId)
  );

  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.myTimeService
        .getRequests<UpdateTimesheetRequest>(this.requestTypeUrlPath, this.queryParams$.value)
        .pipe(startWith(null))
    ),
    share()
  );
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    public myTimeService: MyTimeService,
    public destroy$: TuiDestroyService,
    public state: RxState<Pagination<UpdateTimesheetRequest>>,
    private translocoService: TranslocoService,
    private authService: AuthService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onViewEmployeeRequestDetail(id: string): void {
    super.onViewEmployeeRequestDetail(id, this.userId);
  }
}
