import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { Pagination } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { TRANSLATION_SCOPE } from '../../../../internal/constants';
import { UpdateTimesheetRequest } from '../../../../internal/models';
import { MyRequestsService } from '../../../../internal/services';
import { AbstractRequestListComponent } from '../../../../shared/abstract-components/abstract-request-list.component';

@Component({
  selector: 'hcm-my-update-timesheet-requests',
  templateUrl: './my-update-timesheet-requests.component.html',
  styleUrls: ['./my-update-timesheet-requests.component.scss'],
  providers: [RxState, TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyUpdateTimesheetRequestsComponent extends AbstractRequestListComponent<UpdateTimesheetRequest> {
  @ViewChild('table') table!: BaseComponent;

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
  readonly queryParams$ = new BehaviorSubject(
    new HttpParams().set('page', 0).set('size', 10).set('userId', this.userId)
  );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.myRequestsService
        .getRequests<UpdateTimesheetRequest>('myUpdateTimesheet', this.queryParams$.value)
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
    private readonly translocoService: TranslocoService,
    private readonly authService: AuthService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }
}
