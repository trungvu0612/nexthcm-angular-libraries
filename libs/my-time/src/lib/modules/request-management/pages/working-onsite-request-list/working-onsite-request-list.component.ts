import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { Columns } from 'ngx-easy-table';
import { FileSaverService } from 'ngx-filesaver';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap } from 'rxjs/operators';

import { AbstractRequestListComponent } from '../../../../internal/abstract';
import { WorkingOnsiteRequest } from '../../../../internal/models';
import { MyRequestsService, RequestDetailDialogService } from '../../../../internal/services';

@Component({
  selector: 'hcm-working-onsite-request-list',
  templateUrl: './working-onsite-request-list.component.html',
  styleUrls: ['./working-onsite-request-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class WorkingOnsiteRequestListComponent extends AbstractRequestListComponent<WorkingOnsiteRequest> {
  readonly requestTypeUrlPath = 'workingOnsite';
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('MY_TIME_REQUEST_LIST_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'user.code', title: result.cif },
        { key: 'user.fullName', title: result.name },
        { key: 'fromDate', title: result.dateRange },
        { key: 'totalDay', title: result.days },
        { key: 'status', title: result.status, orderEnabled: false },
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
        .getRequests<WorkingOnsiteRequest>(this.requestTypeUrlPath, this.queryParams)
        .pipe(startWith(null))
    ),
    share()
  );
  readonly loading$ = combineLatest([this.request$, this.changeStatusHandler$.pipe(startWith({}))]).pipe(
    map((values) => values.includes(null)),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    readonly myRequestsService: MyRequestsService,
    override readonly state: RxState<Pagination<WorkingOnsiteRequest>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    readonly requestDetailDialogService: RequestDetailDialogService,
    readonly translocoService: TranslocoService,
    readonly promptService: PromptService,
    override readonly fileSaverService: FileSaverService,
    override readonly dialogService: TuiDialogService,
    override readonly injector: Injector,
    override readonly fb: UntypedFormBuilder
  ) {
    super(state, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }
}
