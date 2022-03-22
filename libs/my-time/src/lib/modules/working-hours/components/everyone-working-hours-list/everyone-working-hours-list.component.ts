import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { HashMap, ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { API, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, share, skip, startWith, switchMap, tap } from 'rxjs/operators';

import { WorkingHoursGroup } from '../../../../internal/models';
import { WorkingHoursService } from '../../../../internal/services';
import { ExportTimeLogDialogComponent } from '../export-time-log-dialog/export-time-log-dialog.component';
import { ImportTimeLogDialogComponent } from '../import-time-log-dialog/import-time-log-dialog.component';

@Component({
  selector: 'hcm-everyone-working-hours-list',
  templateUrl: './everyone-working-hours-list.component.html',
  styleUrls: ['./everyone-working-hours-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class EveryoneWorkingHoursListComponent
  extends AbstractServerSortPaginationTableComponent<WorkingHoursGroup>
  implements OnInit
{
  readonly dialog$ = new Subject<'import' | 'export'>();
  override configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    detailsTemplate: true,
  };
  readonly toggledRows = new Set<number>();
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('WORKING_HOURS_TABLE_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: '', title: '', width: '3%' },
        { key: 'cif', title: result['cif'], width: '10%' },
        { key: 'fullName', title: result['fullName'], width: '11%' },
        { key: 'dateRange', title: result['dateRange'], width: '12%' },
        {
          key: '',
          title: result['inTime'],
          width: '14%',
          cssClass: { name: 'text-center', includeHeader: true },
        },
        {
          key: '',
          title: result['outTime'],
          width: '14%',
          cssClass: { name: 'text-center', includeHeader: true },
        },
        {
          key: 'totalWorkingTime',
          title: result['totalWorkingTimeH'],
          width: '8%',
          cssClass: { name: 'text-center', includeHeader: true },
        },
        {
          key: 'workingDay',
          title: result['workingDays'],
          width: '8%',
          cssClass: { name: 'text-center', includeHeader: true },
        },
        {
          key: 'ot',
          title: result['ot'],
          width: '8%',
          cssClass: { name: 'text-center', includeHeader: true },
        },
        {
          key: 'countLeave',
          title: result['countLeave'],
          width: '10%',
          cssClass: { name: 'text-center', includeHeader: true },
        },
        { key: '', title: '', width: '2%' },
      ])
    );
  private readonly request$ = this.fetch$.pipe(
    skip(1),
    switchMap(() =>
      this.workingHoursService.getWorkingHoursOfEveryone(this.queryParams).pipe(
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
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    override readonly state: RxState<Pagination<WorkingHoursGroup>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    private readonly workingHoursService: WorkingHoursService,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector
  ) {
    super(state, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
    state.hold(
      this.dialog$.pipe(
        switchMap((dialog) =>
          dialog === 'import'
            ? this.dialogService.open(new PolymorpheusComponent(ImportTimeLogDialogComponent, this.injector), {
                label: this.translocoService.translate('importTimeLog'),
                size: 'page',
              })
            : this.dialogService.open(new PolymorpheusComponent(ExportTimeLogDialogComponent, this.injector), {
                label: this.translocoService.translate('exportTimeLog'),
              })
        )
      )
    );
  }

  get fromDateForGroupBy(): number {
    return +(this.queryParams.get('fromDateForGroupBy') || 0);
  }

  get toDateForGroupBy(): number {
    return +(this.queryParams.get('toDateForGroupBy') || 0);
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

  onFilter(httpParams: HttpParams): void {
    this.queryParams = httpParams;
    this.fetch$.next();
  }
}
