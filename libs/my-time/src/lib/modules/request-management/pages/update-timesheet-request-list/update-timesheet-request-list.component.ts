import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { TRANSLATION_SCOPE } from '../../../../internal/constants';
import { UpdateTimesheetRequest } from '../../../../internal/models';
import { MyRequestsService } from '../../../../internal/services';
import { AbstractRequestListComponent } from '../../../../shared/abstract-components/abstract-request-list.component';

@Component({
  selector: 'hcm-update-timesheet-request-list',
  templateUrl: './update-timesheet-request-list.component.html',
  styleUrls: ['./update-timesheet-request-list.component.scss'],
  providers: [TuiDestroyService, RxState],
})
export class UpdateTimesheetRequestListComponent extends AbstractRequestListComponent<UpdateTimesheetRequest> {
  @ViewChild('table') table!: BaseComponent;

  readonly requestTypeUrlPath = 'updateTimesheet';
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('MY_TIME_REQUEST_LIST_COLUMNS', {}, TRANSLATION_SCOPE)
    .pipe(
      map((result) => [
        { key: 'cif', title: result.cif },
        { key: 'name', title: result.name },
        { key: 'date', title: result.date },
        { key: 'newTimeIn', title: result.newInTime },
        { key: 'newTimeOut', title: result.newOutTime },
        { key: 'updateTotalTime', title: result.updateTotalTime },
        {
          key: 'updateWorkingDay',
          title: result.updateWorkingDay,
          cssClass: { name: 'text-center', includeHeader: true },
        },
        { key: 'currentStatus', title: result.status },
        { key: 'comment', title: result.Comment },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.myRequestsService
        .getRequests<UpdateTimesheetRequest>(this.requestTypeUrlPath, this.queryParams$.value)
        .pipe(startWith(null))
    ),
    shareReplay(1)
  );
  readonly loading$ = combineLatest([this.request$, this.changeStatusHandler$.pipe(startWith({}))]).pipe(
    map((values) => values.includes(null)),
    catchError(() => of(false))
  );

  constructor(
    readonly myRequestsService: MyRequestsService,
    readonly destroy$: TuiDestroyService,
    readonly state: RxState<Pagination<UpdateTimesheetRequest>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private readonly translocoService: TranslocoService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }
}
