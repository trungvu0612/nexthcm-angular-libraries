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
import { WorkFromHomeRequest } from '../../../../internal/models';
import { MyRequestsService, RequestDetailDialogService } from '../../../../internal/services';

@Component({
  selector: 'hcm-my-work-from-home-requests',
  templateUrl: './my-work-from-home-requests.component.html',
  styleUrls: ['./my-work-from-home-requests.component.scss'],
  providers: [RxState, TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyWorkFromHomeRequestsComponent extends AbstractRequestListComponent<WorkFromHomeRequest> {
  readonly userId = this.authService.get('userInfo', 'userId');
  readonly requestTypeUrlPath = 'workFromHome';
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('MY_TIME_REQUEST_LIST_COLUMNS', {}, TRANSLATION_SCOPE)
    .pipe(
      map((result) => [
        { key: 'fromDate', title: result.dateRange },
        { key: 'totalDay', title: result.days, cssClass: { name: 'text-center', includeHeader: true } },
        { key: 'status', title: result.status },
        { key: 'comment', title: result.Comment },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  queryParams = new HttpParams().set('page', 0).set('size', 10).set('userId', this.userId);
  private readonly request$ = combineLatest([
    this.fetch$,
    this.myRequestsService.refresh$.pipe(
      filter((type) => type === this.requestTypeUrlPath),
      startWith(null)
    ),
  ]).pipe(
    switchMap(() =>
      this.myRequestsService.getRequests<WorkFromHomeRequest>('myWorkFromHome', this.queryParams).pipe(startWith(null))
    ),
    shareReplay(1)
  );
  readonly loading$ = combineLatest([this.request$, this.changeStatusHandler$.pipe(startWith({}))]).pipe(
    map((values) => values.includes(null)),
    catchError(() => of(false))
  );

  constructor(
    readonly myRequestsService: MyRequestsService,
    readonly state: RxState<Pagination<WorkFromHomeRequest>>,
    readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    readonly requestDetailDialogService: RequestDetailDialogService,
    readonly destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService,
    private readonly authService: AuthService
  ) {
    super(state, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }
}
