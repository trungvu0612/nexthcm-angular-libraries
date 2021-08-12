import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { AbstractServerPaginationTableComponent, Pagination } from '@nexthcm/cdk';
import { HashMap, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { Observable } from 'rxjs';
import { filter, map, share, startWith, switchMap } from 'rxjs/operators';
import { WorkingHoursGroup } from '../../../../models';
import { WorkingHoursService } from '../../../../services';

@Component({
  selector: 'hcm-everyone-working-hours-list',
  templateUrl: './everyone-working-hours-list.component.html',
  styleUrls: ['./everyone-working-hours-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class EveryoneWorkingHoursListComponent extends AbstractServerPaginationTableComponent<WorkingHoursGroup> {
  @ViewChild('table') table!: BaseComponent;

  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('WORKING_HOURS_TABLE_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'cif', title: result.cif },
        { key: 'fullName', title: result.fullName },
        { key: 'office', title: result.office },
        { key: 'dateRange', title: result.dateRange },
        { key: 'totalWorkingTime', title: result.totalWorkingTime },
        { key: 'workingDay', title: result.workingDay },
        { key: 'ot', title: result.ot },
        { key: 'onsiteDay', title: result.onsiteDay },
        { key: 'wfh', title: result.workFromHome },
        { key: 'countLeave', title: result.countLeave },
      ])
    );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.workingHoursService.getWorkingHoursOfEveryone(this.queryParams$.value).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    public workingHoursService: WorkingHoursService,
    public destroy$: TuiDestroyService,
    public state: RxState<Pagination<WorkingHoursGroup>>,
    private translocoService: TranslocoService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }
}
