import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { Pagination } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap } from 'rxjs/operators';
import { WorkFromHomeRequest } from '../../../../models';
import { MyTimeService, RequestTypeAPIUrlPath } from '../../../../services';
import { AbstractRequestListComponent } from '../../../shared/abstract-components/abstract-request-list.component';

@Component({
  selector: 'hcm-my-work-from-home-requests',
  templateUrl: './my-work-from-home-requests.component.html',
  styleUrls: ['./my-work-from-home-requests.component.scss'],
  providers: [RxState, TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyWorkFromHomeRequestsComponent extends AbstractRequestListComponent<WorkFromHomeRequest> {
  @ViewChild('table') table!: BaseComponent;

  readonly userId = this.authService.get('userInfo', 'userId');
  readonly requestTypeUrlPath = RequestTypeAPIUrlPath.workFromHome;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('MY_TIME_REQUEST_LIST_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'fromDate', title: result.dateRange },
        { key: 'totalDay', title: result.days, cssClass: { name: 'text-center', includeHeader: true } },
        { key: 'status', title: result.status },
        { key: 'comment', title: result.Comment },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  readonly queryParams$ = new BehaviorSubject(
    new HttpParams().set('page', 0).set('size', 10).set('userId', this.userId)
  );
  private readonly request$ = combineLatest([
    this.queryParams$,
    this.myTimeService.refresh$.pipe(
      filter((type) => type === this.requestTypeUrlPath),
      startWith(null)
    ),
  ]).pipe(
    switchMap(() =>
      this.myTimeService
        .getRequests<WorkFromHomeRequest>(RequestTypeAPIUrlPath.MyWorkFromHome, this.queryParams$.value)
        .pipe(startWith(null))
    ),
    share()
  );

  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly myTimeService: MyTimeService,
    readonly destroy$: TuiDestroyService,
    readonly state: RxState<Pagination<WorkFromHomeRequest>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly translocoService: TranslocoService,
    private readonly authService: AuthService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }
}
