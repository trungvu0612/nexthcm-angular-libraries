import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { Pagination } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { Observable } from 'rxjs';
import { filter, map, share, startWith, switchMap } from 'rxjs/operators';
import { WorkingAfterHoursRequest } from '../../../../models';
import { MyTimeService, RequestTypeAPIUrlPath } from '../../../../services';
import { AbstractRequestListComponent } from '../../../shared/abstract-components/abstract-request-list.component';

@Component({
  selector: 'hcm-list-ot-request',
  templateUrl: './list-ot-request.component.html',
  styleUrls: ['./list-ot-request.component.scss'],
  providers: [RxState, TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOtRequestComponent extends AbstractRequestListComponent<WorkingAfterHoursRequest> {
  @ViewChild('table') table!: BaseComponent;

  readonly userId = this.authService.get('userInfo', 'userId');
  readonly requestTypeUrlPath = RequestTypeAPIUrlPath.workingAfterHours;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('WORKING_OUTSIDE_MANAGEMENT')
    .pipe(
      map((result) => [
        { key: 'fromDate', title: result.fromDate },
        { key: 'toDate', title: result.toDate },
        { key: 'status', title: result.status },
        { key: 'type', title: result.type },
        { key: 'reason', title: result.reason },
        { key: 'functions', title: result.functions },
      ])
    );

  private readonly request$ = this.queryParams$.pipe(
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
