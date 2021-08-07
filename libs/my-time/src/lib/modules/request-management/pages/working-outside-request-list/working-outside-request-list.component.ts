import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Pagination } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { Observable } from 'rxjs';
import { filter, map, share, startWith, switchMap } from 'rxjs/operators';
import { WorkingOutsideRequest } from '../../../../models/interfaces/working-outside-request';
import { MyTimeService, RequestTypeUrlPath } from '../../../../services/my-time.service';
import { AbstractRequestListComponent } from '../../abstract-components/abstract-request-list.component';

@Component({
  selector: 'hcm-working-outside-request-list',
  templateUrl: './working-outside-request-list.component.html',
  styleUrls: ['./working-outside-request-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class WorkingOutsideRequestListComponent extends AbstractRequestListComponent<WorkingOutsideRequest> {
  @ViewChild('table') table!: BaseComponent;
  readonly requestTypeUrlPath = RequestTypeUrlPath.workingOutside;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('REQUEST_MANAGEMENT_TABLE_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'cif', title: result.cif },
        { key: 'name', title: result.name },
        { key: 'dateRange', title: result.dateRange },
        { key: 'days', title: result.days },
        { key: 'status', title: result.status },
        { key: 'comment', title: result.Comment },
        { key: 'functions', title: result.functions },
      ])
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
    private translocoService: TranslocoService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }
}
