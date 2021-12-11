import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { Pagination, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent } from '@taiga-ui/cdk';
import { Columns } from 'ngx-easy-table';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap } from 'rxjs/operators';
import { AbstractRequestListComponent } from '../../../../internal/abstract';
import { TRANSLATION_SCOPE } from '../../../../internal/constants';
import { WorkFromHomeRequest } from '../../../../internal/models';
import { MyRequestsService, RequestDetailDialogService } from '../../../../internal/services';

@Component({
  selector: 'hcm-work-form-home-request-list',
  templateUrl: './work-form-home-request-list.component.html',
  styleUrls: ['./work-form-home-request-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class WorkFormHomeRequestListComponent extends AbstractRequestListComponent<WorkFromHomeRequest> {
  readonly requestTypeUrlPath = 'workFromHome';
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('MY_TIME_REQUEST_LIST_COLUMNS', {}, TRANSLATION_SCOPE)
    .pipe(
      map((result) => [
        { key: 'user.code', title: result.cif },
        { key: 'user.fullName', title: result.name },
        { key: 'fromDate', title: result.dateRange },
        { key: 'days', title: result.days },
        { key: 'currentStatus', title: result.status },
        { key: 'comment', title: result.Comment },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  private readonly request$ = combineLatest([
    this.fetch$,
    this.myRequestsService.refresh$.pipe(
      filter((type) => type === this.requestTypeUrlPath),
      startWith(null)
    ),
  ]).pipe(
    switchMap(() =>
      this.myRequestsService
        .getRequests<WorkFromHomeRequest>(this.requestTypeUrlPath, this.queryParams)
        .pipe(startWith(null))
    ),
    share()
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
    readonly translocoService: TranslocoService,
    readonly promptService: PromptService
  ) {
    super(state, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }
}
