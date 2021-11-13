import { ChangeDetectionStrategy, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination } from '@nexthcm/cdk';
import { HashMap, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { API, BaseComponent, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { TRANSLATION_SCOPE } from '../../../../internal/constants';
import { WorkingHoursGroup } from '../../../../models';
import { WorkingHoursService } from '../../../../services';
import { ExportTimeLogDialogComponent } from '../export-time-log-dialog/export-time-log-dialog.component';

@Component({
  selector: 'hcm-everyone-working-hours-list',
  templateUrl: './everyone-working-hours-list.component.html',
  styleUrls: ['./everyone-working-hours-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class EveryoneWorkingHoursListComponent
  extends AbstractServerSortPaginationTableComponent<WorkingHoursGroup>
  implements OnInit
{
  @ViewChild('table') table!: BaseComponent;

  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    detailsTemplate: true,
  };
  readonly toggledRows = new Set<number>();
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('WORKING_HOURS_TABLE_COLUMNS', {}, TRANSLATION_SCOPE)
    .pipe(
      map((result) => [
        { key: '', title: '', width: '6%' },
        { key: 'cif', title: result.cif, width: '9%' },
        { key: 'fullName', title: result.fullName, width: '9%' },
        { key: 'office', title: result.office, width: '9%' },
        { key: 'dateRange', title: result.dateRange, width: '13%' },
        {
          key: 'totalWorkingTime',
          title: result.totalWorkingTimeH,
          width: '9%',
          cssClass: { name: 'text-center', includeHeader: true },
        },
        {
          key: 'workingDay',
          title: result.workingDay,
          width: '9%',
          cssClass: { name: 'text-center', includeHeader: true },
        },
        { key: 'ot', title: result.ot, width: '9%', cssClass: { name: 'text-center', includeHeader: true } },
        {
          key: 'onsiteDay',
          title: result.onsiteDay,
          width: '9%',
          cssClass: { name: 'text-center', includeHeader: true },
        },
        { key: 'wfh', title: result.workFromHome, width: '9%', cssClass: { name: 'text-center', includeHeader: true } },
        {
          key: 'countLeave',
          title: result.countLeave,
          width: '9%',
          cssClass: { name: 'text-center', includeHeader: true },
        },
      ])
    );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.workingHoursService.getWorkingHoursOfEveryone(this.queryParams$.value).pipe(
        tap(() => this.toggledRows.clear()),
        startWith(null)
      )
    ),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly state: RxState<Pagination<WorkingHoursGroup>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private readonly workingHoursService: WorkingHoursService,
    private readonly destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  get fromDateForGroupBy(): number {
    const fromDate = this.queryParams$.value.get('fromDateForGroupBy');
    return fromDate ? +fromDate : 0;
  }

  get toDateForGroupBy(): number {
    const toDate = this.queryParams$.value.get('toDateForGroupBy');
    return toDate ? +toDate : 0;
  }

  ngOnInit(): void {
    this.configuration.tableLayout.hover = true;
  }

  onRowClickEvent($event: MouseEvent, index: number): void {
    $event.preventDefault();
    this.table.apiEvent({ type: API.toggleRowIndex, value: index });
    if (this.toggledRows.has(index)) {
      this.toggledRows.delete(index);
    } else {
      this.toggledRows.add(index);
    }
  }

  onExportTimeLog(): void {
    this.dialogService
      .open(new PolymorpheusComponent(ExportTimeLogDialogComponent, this.injector), {
        label: this.translocoService.translate('exportTimeLog'),
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
