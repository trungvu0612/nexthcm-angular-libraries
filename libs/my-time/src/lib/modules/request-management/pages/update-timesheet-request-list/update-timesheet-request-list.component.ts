import { Component, ViewChild } from '@angular/core';
import { Pagination } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { Observable } from 'rxjs';
import { filter, map, share, startWith, switchMap } from 'rxjs/operators';
import { UpdateTimesheetRequest } from '../../../../models';
import { MyTimeService, RequestTypeUrlPath } from '../../../../services/my-time.service';
import { AbstractRequestListComponent } from '../../abstract-components/abstract-request-list.component';

@Component({
  selector: 'hcm-update-timesheet-request-list',
  templateUrl: './update-timesheet-request-list.component.html',
  styleUrls: ['./update-timesheet-request-list.component.scss'],
  providers: [TuiDestroyService, RxState],
})
export class UpdateTimesheetRequestListComponent extends AbstractRequestListComponent<UpdateTimesheetRequest> {
  @ViewChild('table') table!: BaseComponent;
  readonly requestTypeUrlPath = RequestTypeUrlPath.updateTimeSheet;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('REQUEST_MANAGEMENT_TABLE_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'cif', title: result.cif },
        { key: 'name', title: result.name },
        { key: 'date', title: result.date },
        { key: 'newTimeIn', title: result.newTimeIn },
        { key: 'newTimeOut', title: result.newTimeOut },
        { key: 'status', title: result.status },
        { key: 'comment', title: result.Comment },
        { key: 'functions', title: result.functions },
      ])
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
    private translocoService: TranslocoService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }
}
