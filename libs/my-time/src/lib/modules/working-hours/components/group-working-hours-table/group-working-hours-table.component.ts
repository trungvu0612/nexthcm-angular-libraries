import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AbstractServerPaginationTableComponent, Pagination } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
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
  @Input() userId!: string;
  @Input() fromDate!: number;
  @Input() toDate!: number;

  override configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
  };
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject(this.translocoScope.scope + '.WORKING_HOURS_TABLE_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'trackingDate', title: result['date'] },
        {
          key: 'inTime',
          title: result['inTime'],
          cssClass: { name: 'text-center', includeHeader: true },
        },
        {
          key: 'outTime',
          title: result['outTime'],
          cssClass: { name: 'text-center', includeHeader: true },
        },
        {
          key: 'totalWorkingTime',
          title: result['totalWorkingTimeH'],
          cssClass: { name: 'text-center', includeHeader: true },
        },
        {
          key: 'workingDay',
          title: result['workingDays'],
          cssClass: { name: 'text-center', includeHeader: true },
        },
        {
          key: 'ot',
          title: result['ot'],
          cssClass: { name: 'text-center', includeHeader: true },
        },
        {
          key: 'countLeave',
          title: result['countLeave'],
          cssClass: { name: 'text-center', includeHeader: true },
        },
        { key: '', title: result['functions'] },
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
