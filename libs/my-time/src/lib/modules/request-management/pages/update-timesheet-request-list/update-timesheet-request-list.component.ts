import { Location } from '@angular/common';
import { Component, Inject, Injector } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { Columns } from 'ngx-easy-table';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap } from 'rxjs/operators';

import { AbstractRequestListComponent } from '../../../../internal/abstract';
import { UpdateTimesheetRequest } from '../../../../internal/models';
import { MyRequestsService, RequestDetailDialogService } from '../../../../internal/services';

@Component({
  selector: 'hcm-update-timesheet-request-list',
  templateUrl: './update-timesheet-request-list.component.html',
  styleUrls: ['./update-timesheet-request-list.component.scss'],
  providers: [RxState],
})
export class UpdateTimesheetRequestListComponent extends AbstractRequestListComponent<UpdateTimesheetRequest> {
  readonly requestTypeUrlPath = 'updateTimesheet';
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('MY_TIME_REQUEST_LIST_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'user.code', title: result.cif },
        { key: 'user.fullName', title: result.name },
        { key: 'createdDate', title: result.date },
        { key: 'newInTime', title: result.newInTime },
        { key: 'newOutTime', title: result.newOutTime },
        { key: 'updateTotalTime', title: result.updateTotalTime },
        {
          key: 'updateWorkingDay',
          title: result.updateWorkingDay,
          cssClass: { name: 'text-center', includeHeader: true },
        },
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
        .getRequests<UpdateTimesheetRequest>(this.requestTypeUrlPath, this.queryParams)
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
    override readonly state: RxState<Pagination<UpdateTimesheetRequest>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    readonly requestDetailDialogService: RequestDetailDialogService,
    readonly translocoService: TranslocoService,
    readonly promptService: PromptService,
    override readonly dialogService: TuiDialogService,
    override readonly injector: Injector,
    override readonly fb: FormBuilder
  ) {
    super(state, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }
}
