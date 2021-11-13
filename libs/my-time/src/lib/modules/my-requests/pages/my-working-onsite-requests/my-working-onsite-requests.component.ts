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
import { WorkingOnsiteRequest } from '../../../../internal/models';
import { MyRequestsService } from '../../../../internal/services';
import { AbstractRequestListComponent } from '../../../../shared/abstract-components/abstract-request-list.component';

@Component({
  selector: 'hcm-my-working-onsite-requests',
  templateUrl: './my-working-onsite-requests.component.html',
  styleUrls: ['./my-working-onsite-requests.component.scss'],
  providers: [RxState, TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyWorkingOnsiteRequestsComponent extends AbstractRequestListComponent<WorkingOnsiteRequest> {
  @ViewChild('table') table!: BaseComponent;

  readonly userId = this.authService.get('userInfo', 'userId');
  readonly requestTypeUrlPath = 'workingOnsite';
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('MY_TIME_REQUEST_LIST_COLUMNS', {}, TRANSLATION_SCOPE)
    .pipe(
      map((result) => [
        { key: 'fromDate', title: result.dateRange },
        { key: 'days', title: result.days, cssClass: { name: 'text-center', includeHeader: true } },
        { key: 'officeDTO', title: result.office },
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
    this.myRequestsService.refresh$.pipe(
      filter((type) => type === this.requestTypeUrlPath),
      startWith(null)
    ),
  ]).pipe(
    switchMap(() =>
      this.myRequestsService
        .getRequests<WorkingOnsiteRequest>('myWorkingOnsite', this.queryParams$.value)
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
    readonly state: RxState<Pagination<WorkingOnsiteRequest>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private readonly translocoService: TranslocoService,
    private readonly authService: AuthService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }
}
