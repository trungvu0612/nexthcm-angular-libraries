import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule, Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import {
  BasicFilterComponentModule,
  InputDateRangeFilterComponentModule,
  InputFilterComponentModule,
  InputNumberFilterComponentModule,
  SelectMonthFilterComponentModule,
  WorkflowStatusComboBoxFilterComponentModule,
} from '@nexthcm/ui';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { TuiDayRange } from '@taiga-ui/cdk';
import { endOfDay, startOfDay } from 'date-fns';
import omit from 'just-omit';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'hcm-request-filters',
  templateUrl: './request-filters.component.html',
  styleUrls: ['./request-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class RequestFiltersComponent implements OnInit {
  @Input() httpParams!: HttpParams;
  @Output() filter = new EventEmitter<HttpParams>();

  readonly dates$ = new Subject<TuiDayRange | null>();
  readonly createDates$ = new Subject<TuiDayRange | null>();
  readonly changeDates$ = new Subject<TuiDayRange | null>();
  readonly search$ = new Subject<string | null>();
  readonly statusIds$ = new Subject<string | null>();
  readonly filterType$ = new Subject<string | null>();

  constructor(
    private readonly state: RxState<Record<string, unknown>>,
    private readonly translocoService: TranslocoService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly locationRef: Location,
    private readonly urlSerializer: UrlSerializer
  ) {
    state.hold(this.dates$, (dates) => this.filterByDates(dates, 'fromDate', 'toDate'));
    state.hold(this.createDates$, (dates) => this.filterByDates(dates, 'createFrom', 'createTo'));
    state.hold(this.changeDates$, (dates) => this.filterByDates(dates, 'changeFrom', 'changeTo'));
    state.hold(this.dates$, (dates) => this.filterByDates(dates, 'fromDate', 'toDate'));
    state.hold(this.search$.pipe(debounceTime(1000), distinctUntilChanged()), (search) =>
      this.onFilter('search', search ? search : null)
    );
    state.hold(this.statusIds$, (statusIds) => this.onFilter('wfStateId', statusIds));
    state.hold(this.filterType$, (filterType) => this.onFilter('filterType', filterType));
  }

  private _everyone = false;

  get everyone(): boolean {
    return this._everyone;
  }

  @Input()
  set everyone(value: unknown) {
    this._everyone = coerceBooleanProperty(value);
  }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.queryParams;
    if (params['dates']) this.dates$.next(TuiDayRange.normalizeParse(params['dates']));
    if (params['createDates']) this.createDates$.next(TuiDayRange.normalizeParse(params['createDates']));
    if (params['changeDates']) this.changeDates$.next(TuiDayRange.normalizeParse(params['changeDates']));
    if (params['search']) this.search$.next(params['search']);
    if (params['filterType']) this.filterType$.next(params['filterType']);
  }

  private onFilter(key: string, value: string | number | null): void {
    this.resetPage();
    this.httpParams = value !== null ? this.httpParams.set(key, value) : this.httpParams.delete(key);
    this.filter.emit(this.httpParams);
  }

  private filterByDates(dates: TuiDayRange | null, fromDate: string, toDate: string): void {
    this.httpParams = dates
      ? this.httpParams
          .set(fromDate, startOfDay(dates.from.toLocalNativeDate()).getTime())
          .set(toDate, endOfDay(dates.to.toLocalNativeDate()).getTime())
      : this.httpParams.delete(fromDate).delete(toDate);
    this.filter.emit(this.httpParams);
  }

  private resetPage(): void {
    this.httpParams = this.httpParams.delete('page');
    this.setQueryParams('page', null);
  }

  private setQueryParams(key: string, value: string | number | null): void {
    const tree = this.urlSerializer.parse(this.locationRef.path());

    tree.queryParams = value === null ? omit(tree.queryParams, key) : { ...tree.queryParams, [key]: value };
    this.locationRef.go(String(tree));
  }
}

@NgModule({
  declarations: [RequestFiltersComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    InputFilterComponentModule,
    SelectMonthFilterComponentModule,
    WorkflowStatusComboBoxFilterComponentModule,
    BasicFilterComponentModule,
    InputNumberFilterComponentModule,
    InputDateRangeFilterComponentModule,
  ],
  exports: [RequestFiltersComponent],
})
export class RequestFiltersComponentModule {}
