import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractServerPaginationTableComponent, Pagination } from '@nexthcm/cdk';
import { HashMap, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, tuiDefaultProp } from '@taiga-ui/cdk';
import { BaseComponent, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Observable } from 'rxjs';
import { filter, map, share, skip, startWith, switchMap } from 'rxjs/operators';
import { WorkingHours } from '../../../../models';
import { WorkingHoursService } from '../../../../services';

@Component({
  selector: 'hcm-group-working-hours-table',
  templateUrl: './group-working-hours-table.component.html',
  styleUrls: ['./group-working-hours-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class GroupWorkingHoursTableComponent
  extends AbstractServerPaginationTableComponent<WorkingHours>
  implements OnChanges
{
  @Input() @tuiDefaultProp() userId!: string;
  @Input() @tuiDefaultProp() fromDate!: number;
  @Input() @tuiDefaultProp() toDate!: number;

  @ViewChild('table') table!: BaseComponent;

  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    detailsTemplate: true,
  };
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('WORKING_HOURS_TABLE_COLUMNS')
    .pipe(
      map((result) => [
        { key: '', title: '', width: '6%' },
        { key: 'cif', title: result.cif, width: '9%' },
        { key: 'fullName', title: result.fullName, width: '9%' },
        { key: 'office', title: result.office, width: '9%' },
        { key: 'dateRange', title: result.dateRange, width: '13%' },
        { key: 'totalWorkingTime', title: result.totalWorkingTimeH, width: '9%' },
        { key: 'workingDay', title: result.workingDay, width: '9%' },
        { key: 'ot', title: result.ot, width: '9%' },
        { key: 'onsiteDay', title: result.onsiteDay, width: '9%' },
        { key: 'wfh', title: result.workFromHome, width: '9%' },
        { key: 'countLeave', title: result.countLeave, width: '9%' },
      ])
    );
  private readonly request$ = this.queryParams$.pipe(
    skip(1),
    switchMap(() => this.workingHoursService.getWorkingHoursOfOnlyMe(this.queryParams$.value).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    public state: RxState<Pagination<WorkingHours>>,
    private workingHoursService: WorkingHoursService,
    private translocoService: TranslocoService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  ngOnChanges(changes: SimpleChanges): void {
    let httpParams = this.queryParams$.value;
    httpParams = changes.userId
      ? httpParams.set('userId', this.userId)
      : httpParams.set('fromDate', this.fromDate).set('toDate', this.toDate);
    this.queryParams$.next(httpParams);
  }
}
