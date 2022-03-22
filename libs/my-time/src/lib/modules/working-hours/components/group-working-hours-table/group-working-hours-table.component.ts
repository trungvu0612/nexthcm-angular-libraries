import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AbstractServerPaginationTableComponent, Pagination } from '@nexthcm/cdk';
import { HashMap, ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, tuiDefaultProp, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { API, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, share, skip, startWith, switchMap, takeUntil } from 'rxjs/operators';

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
  extends AbstractServerPaginationTableComponent<WorkingHours>
  implements OnChanges
{
  @Input() @tuiDefaultProp() userId!: string;
  @Input() @tuiDefaultProp() fromDate!: number;
  @Input() @tuiDefaultProp() toDate!: number;

  override configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
  };
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('WORKING_HOURS_TABLE_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: '', title: '', width: '3%' },
        { key: 'cif', title: result['cif'], width: '10%' },
        { key: 'fullName', title: result['fullName'], width: '11%' },
        { key: 'dateRange', title: result['dateRanges'], width: '12%' },
        { key: '', title: result['inTime'], width: '14%' },
        { key: '', title: result['outTime'], width: '14%' },
        { key: 'totalWorkingTime', title: result['totalWorkingTimeH'], width: '8%' },
        { key: 'workingDay', title: result['workingDay'], width: '8%' },
        { key: 'ot', title: result['ot'], width: '8%' },
        { key: 'countLeave', title: result['countLeave'], width: '10%' },
        { key: '', title: '', width: '2%' },
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
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    override readonly state: RxState<Pagination<WorkingHours>>,
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

  ngOnChanges(): void {
    this.queryParams = this.queryParams
      .set('userId', this.userId)
      .set('fromDate', this.fromDate)
      .set('toDate', this.toDate);
    this.fetch$.next();
  }

  override onSize(size: number): void {
    this.table.apiEvent({ type: API.setPaginationDisplayLimit, value: size });
    this.queryParams = this.queryParams.set('size', size);
    this.fetch$.next();
  }

  override onPage(page: number): void {
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
