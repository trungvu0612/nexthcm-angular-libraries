import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { Pagination } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, share, startWith, switchMap } from 'rxjs/operators';
import { WorkingAfterHoursRequest } from '../../../../models';
import { MyTimeService, RequestTypeAPIUrlPath } from '../../../../services';
import { AbstractRequestListComponent } from '../../../shared/abstract-components/abstract-request-list.component';

@Component({
  selector: 'hcm-my-working-after-hours-requests',
  templateUrl: './my-working-after-hours-requests.component.html',
  styleUrls: ['./my-working-after-hours-requests.component.scss'],
  providers: [RxState, TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyWorkingAfterHoursRequestsComponent extends AbstractRequestListComponent<WorkingAfterHoursRequest> {
  @ViewChild('table') table!: BaseComponent;

  readonly userId = this.authService.get('userInfo', 'userId');
  readonly requestTypeUrlPath = RequestTypeAPIUrlPath.workingAfterHours;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('MY_TIME_REQUEST_LIST_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'dateRange', title: result.dateRange },
        { key: 'spentTime', title: result.spentTime },
        { key: 'status', title: result.type },
        { key: 'type', title: result.status },
        { key: 'reason', title: result.Comment },
        { key: 'functions', title: result.functions },
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
        .getRequests<WorkingAfterHoursRequest>(this.requestTypeUrlPath, this.queryParams$.value)
        .pipe(startWith(null))
    ),
    share()
  );

  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    public myTimeService: MyTimeService,
    public destroy$: TuiDestroyService,
    public state: RxState<Pagination<WorkingAfterHoursRequest>>,
    private translocoService: TranslocoService,
    private authService: AuthService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }
}
