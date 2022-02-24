import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { NewAbstractServerPaginationTableComponent, Pagination } from '@nexthcm/cdk';
import { HashMap, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, tuiDefaultProp, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { API, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, share, skip, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { TRANSLATION_SCOPE } from '../../../../internal/constants';
import { WorkingHours } from '../../../../models';
import { MyTimeService } from '../../../../services';
import { CreateUpdateTimesheetRequestDialogComponent } from '../create-update-timesheet-request-dialog/create-update-timesheet-request-dialog.component';

@Component({
  selector: 'hcm-group-working-hours-table',
  templateUrl: './group-working-hours-table.component.html',
  styleUrls: ['./group-working-hours-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class GroupWorkingHoursTableComponent
  extends NewAbstractServerPaginationTableComponent<WorkingHours>
  implements OnChanges
{
  @Input() @tuiDefaultProp() userId!: string;
  @Input() @tuiDefaultProp() fromDate!: number;
  @Input() @tuiDefaultProp() toDate!: number;

  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    detailsTemplate: true,
  };
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('WORKING_HOURS_TABLE_COLUMNS', {}, TRANSLATION_SCOPE)
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
        { key: 'countLeave', title: result.countLeave, width: '9%' },
        { key: '', title: result.functions, width: '9%' },
      ])
    );
  private readonly request$ = this.fetch$.pipe(
    skip(1),
    switchMap(() => this.myTimeService.getWorkingHoursOfOnlyMe(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly state: RxState<Pagination<WorkingHours>>,
    readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    private readonly myTimeService: MyTimeService,
    private readonly translocoService: TranslocoService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly destroy$: TuiDestroyService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.queryParams = changes.userId
      ? this.queryParams.set('userId', this.userId)
      : this.queryParams.set('fromDate', this.fromDate).set('toDate', this.toDate);
    this.fetch$.next();
  }

  onSize(size: number): void {
    this.table.apiEvent({ type: API.setPaginationDisplayLimit, value: size });
    this.queryParams = this.queryParams.set('size', size);
    this.fetch$.next();
  }

  onPage(page: number): void {
    this.queryParams = this.queryParams.set('page', page);
    this.fetch$.next();
  }

  requestUpdateTime(data: WorkingHours): void {
    this.dialogService
      .open(new PolymorpheusComponent(CreateUpdateTimesheetRequestDialogComponent, this.injector), {
        label: this.translocoService.translate('myTime.requestUpdateTimesheet'),
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
