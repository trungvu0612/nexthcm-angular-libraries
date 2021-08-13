import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { filter, map, share, startWith, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { RxState } from '@rx-angular/state';
import { Pagination } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { WorkingOutsideRequest } from '../../../models/interfaces/working-outside-request';
import { AbstractRequestListComponent } from '../../shared/abstract-components/abstract-request-list.component';
import { MyTimeService, RequestTypeAPIUrlPath } from '../../../services/my-time.service';
import { HttpParams } from '@angular/common/http';
import { AuthService } from '@nexthcm/auth';

@Component({
  selector: 'hcm-my-working-outside-requests',
  templateUrl: './my-working-outside-requests.component.html',
  styleUrls: ['./my-working-outside-requests.component.scss'],
  providers: [RxState, TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyWorkingOutsideRequestsComponent extends AbstractRequestListComponent<WorkingOutsideRequest> {
  @ViewChild('table') table!: BaseComponent;
  readonly userId = this.authService.get('userInfo', 'userId');
  readonly requestTypeUrlPath = RequestTypeAPIUrlPath.workingOutside;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('WORKING_OUTSIDE_MANAGEMENT')
    .pipe(
      map((result) => [
        { key: 'fromDate', title: result.fromDate },
        { key: 'toDate', title: result.toDate },
        { key: 'day', title: result.day },
        { key: 'state', title: result.state },
        { key: 'reason', title: result.reason },
        { key: 'functions', title: result.functions }
      ])
    );
  readonly queryParams$ = new BehaviorSubject(
    new HttpParams().set('page', 0).set('size', 10).set('userId', this.userId)
  );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.myTimeService
        .getRequests<WorkingOutsideRequest>(this.requestTypeUrlPath, this.queryParams$.value)
        .pipe(startWith(null))
    ),
    share()
  );
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    public myTimeService: MyTimeService,
    public destroy$: TuiDestroyService,
    public state: RxState<Pagination<WorkingOutsideRequest>>,
    private translocoService: TranslocoService,
    private authService: AuthService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onViewEmployeeRequestDetail(id: string): void {
    super.onViewEmployeeRequestDetail(id, this.userId);
  }
}
