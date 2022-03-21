import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent } from '@taiga-ui/cdk';
import { Columns } from 'ngx-easy-table';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';

import { AbstractMyRequestListComponent } from '../../../../internal/abstract/my-request-list-component';
import { UpdateTimesheetRequest } from '../../../../internal/models';
import { MyRequestsService, RequestDetailDialogService } from '../../../../internal/services';

@Component({
  selector: 'hcm-my-update-timesheet-requests',
  templateUrl: './my-update-timesheet-requests.component.html',
  styleUrls: ['./my-update-timesheet-requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class MyUpdateTimesheetRequestsComponent extends AbstractMyRequestListComponent<UpdateTimesheetRequest> {
  readonly requestTypeUrlPath = 'updateTimesheet';
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('MY_TIME_REQUEST_LIST_COLUMNS', {}, this.translocoScope.scope)
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
  override queryParams = new HttpParams().set('page', 0).set('size', 10).set('userId', this.userId);
  private readonly request$ = combineLatest([
    this.fetch$,
    this.myRequestsService.refresh$.pipe(
      filter((type) => type === this.requestTypeUrlPath),
      startWith(null)
    ),
  ]).pipe(
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
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    readonly myRequestsService: MyRequestsService,
    override readonly state: RxState<Pagination<UpdateTimesheetRequest>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    readonly requestDetailDialogService: RequestDetailDialogService,
    readonly translocoService: TranslocoService,
    readonly promptService: PromptService,
    override readonly authService: AuthService
  ) {
    super(state, activatedRoute, authService);
    state.connect(this.request$.pipe(filter(isPresent)));
  }
}
