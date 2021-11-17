import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { Pagination } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { Columns } from 'ngx-easy-table';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { AbstractRequestListComponent } from '../../../../internal/abstract';
import { TRANSLATION_SCOPE } from '../../../../internal/constants';
import { UpdateTimesheetRequest } from '../../../../internal/models';
import { MyRequestsService, RequestDetailDialogService } from '../../../../internal/services';

@Component({
  selector: 'hcm-my-update-timesheet-requests',
  templateUrl: './my-update-timesheet-requests.component.html',
  styleUrls: ['./my-update-timesheet-requests.component.scss'],
  providers: [RxState, TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyUpdateTimesheetRequestsComponent extends AbstractRequestListComponent<UpdateTimesheetRequest> {
  readonly userId = this.authService.get('userInfo', 'userId');
  readonly requestTypeUrlPath = 'updateTimesheet';
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('MY_TIME_REQUEST_LIST_COLUMNS', {}, TRANSLATION_SCOPE)
    .pipe(
      map((result) => [
        { key: 'date', title: result.date },
        { key: 'newInTime', title: result.newInTime, cssClass: { name: 'text-center', includeHeader: true } },
        { key: 'newOutTime', title: result.newOutTime, cssClass: { name: 'text-center', includeHeader: true } },
        {
          key: 'updateTotalTime',
          title: result.updateTotalTime,
          cssClass: { name: 'text-center', includeHeader: true },
        },
        {
          key: 'updateWorkingDay',
          title: result.updateWorkingDay,
          cssClass: { name: 'text-center', includeHeader: true },
        },
        { key: 'currentState', title: result.status },
        { key: 'comment', title: result.Comment },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  queryParams = new HttpParams().set('page', 0).set('size', 10).set('userId', this.userId);
  private readonly request$ = this.fetch$.pipe(
    switchMap(() =>
      this.myRequestsService
        .getRequests<UpdateTimesheetRequest>('myUpdateTimesheet', this.queryParams)
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
    readonly state: RxState<Pagination<UpdateTimesheetRequest>>,
    readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    readonly requestDetailDialogService: RequestDetailDialogService,
    private readonly destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService,
    private readonly authService: AuthService
  ) {
    super(state, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }
}
