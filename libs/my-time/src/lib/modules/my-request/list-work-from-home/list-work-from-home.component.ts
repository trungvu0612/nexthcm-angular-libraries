import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BehaviorSubject, Observable } from 'rxjs';
import {  filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { MyTimeService, RequestTypeAPIUrlPath } from '../../../services';
import { HttpParams } from '@angular/common/http';
import { RxState } from '@rx-angular/state';
import { Pagination } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { AbstractRequestListComponent } from '../../shared/abstract-components/abstract-request-list.component';
import { WorkFromHomeRequest } from '../../../models/interfaces/work-from-home-request';

@Component({
  selector: 'hcm-list-work-from-home',
  templateUrl: './list-work-from-home.component.html',
  styleUrls: ['./list-work-from-home.component.scss'],
  providers: [RxState, TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListWorkFromHomeComponent extends AbstractRequestListComponent<WorkFromHomeRequest> {
  @ViewChild('table') table!: BaseComponent;
  readonly userId = this.authService.get('userInfo', 'userId');
  readonly requestTypeUrlPath = RequestTypeAPIUrlPath.workFromHome;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('WORKING_OUTSIDE_MANAGEMENT')
    .pipe(
      map((result) => [
        { key: 'fromDate', title: result.fromDate },
        { key: 'toDate', title: result.toDate },
        { key: 'day', title: result.totalDay },
        { key: 'status', title: result.status },
        { key: 'comment', title: result.comment },
        { key: 'functions', title: result.functions }
      ])
    );
  readonly queryParams$ = new BehaviorSubject(
    new HttpParams().set('page', 0).set('size', 10).set('userId', this.userId)
  );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.myTimeService
        .getRequests<WorkFromHomeRequest>(this.requestTypeUrlPath, this.queryParams$.value)
        .pipe(startWith(null))
    ),
    share()
  );
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    public myTimeService: MyTimeService,
    public destroy$: TuiDestroyService,
    public state: RxState<Pagination<WorkFromHomeRequest>>,
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
