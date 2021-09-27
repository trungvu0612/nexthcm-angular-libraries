import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { WorkingAfterHoursRequest } from '../../../../models';
import { MyTimeService, RequestTypeAPIUrlPath } from '../../../../services';
import { AbstractRequestListComponent } from '../../../shared/abstract-components/abstract-request-list.component';

@Component({
  selector: 'hcm-working-after-hours-request-list',
  templateUrl: './working-after-hours-request-list.component.html',
  styleUrls: ['./working-after-hours-request-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class WorkingAfterHoursRequestListComponent extends AbstractRequestListComponent<WorkingAfterHoursRequest> {
  @ViewChild('table') table!: BaseComponent;

  readonly requestTypeUrlPath = RequestTypeAPIUrlPath.workingAfterHours;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('MY_TIME_REQUEST_LIST_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'cif', title: result.cif },
        { key: 'name', title: result.name },
        { key: 'fromDate', title: result.dateRange },
        { key: 'type', title: result.type },
        { key: 'status', title: result.status },
        { key: 'comment', title: result.Comment },
        { key: 'functions', title: result.functions, orderEnabled: false },
      ])
    );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.myTimeService
        .getRequests<WorkingAfterHoursRequest>(this.requestTypeUrlPath, this.queryParams$.value)
        .pipe(startWith(null))
    ),
    shareReplay(1)
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly myTimeService: MyTimeService,
    readonly destroy$: TuiDestroyService,
    readonly state: RxState<Pagination<WorkingAfterHoursRequest>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly translocoService: TranslocoService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }
}
