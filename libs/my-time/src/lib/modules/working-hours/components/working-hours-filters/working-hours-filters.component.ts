import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, UrlSerializer } from '@angular/router';
import { BaseOption, PropertyRouteConnectorDirective } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { TuiContextWithImplicit, tuiDefaultProp, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import {
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  getMonth,
  getYear,
  isAfter,
  setMonth,
  setYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import omit from 'just-omit';
import { BehaviorSubject, combineLatest, merge, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, skip } from 'rxjs/operators';

const generateWeekList = (year: number | null, month: number | null): BaseOption<number>[] => {
  if (!year || month === null) return [];

  const thatMonth = setYear(setMonth(new Date(), month), year);
  const startOfThatMonth = startOfMonth(thatMonth);
  const endOfThatMonth = endOfMonth(thatMonth);

  return eachWeekOfInterval({ start: startOfThatMonth, end: endOfThatMonth }).map((startWeek, index) => ({
    label: index + 1 + '',
    value: startWeek.valueOf(),
  }));
};

@Component({
  selector: 'hcm-working-hours-filters',
  templateUrl: './working-hours-filters.component.html',
  styleUrls: ['./working-hours-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class WorkingHoursFiltersComponent implements OnInit {
  @Input() fromKey = 'fromDate';
  @Input() toKey = 'toDate';
  @Input() @tuiDefaultProp() httpParams = new HttpParams();
  @Output() filter = new EventEmitter<HttpParams>();

  initYear = getYear(new Date());
  initMonth = getMonth(new Date());
  initWeek = startOfWeek(new Date()).valueOf();

  readonly inputYear$ = new Subject<number | null>();
  readonly year$ = new BehaviorSubject<number | null>(null);
  readonly month$ = new BehaviorSubject<number | null>(null);
  readonly week$ = new Subject<number | null>();
  readonly search$ = new Subject<string | null>();
  readonly weekList$ = combineLatest([this.year$, this.month$]).pipe(
    map(([year, month]) => generateWeekList(year, month))
  );
  readonly filterType$ = new Subject<string | null>();

  constructor(
    private readonly state: RxState<Record<string, unknown>>,
    private readonly translocoService: TranslocoService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly locationRef: Location,
    private readonly urlSerializer: UrlSerializer
  ) {}

  private _includeSearch = false;

  get includeSearch(): boolean {
    return this._includeSearch;
  }

  @Input()
  set includeSearch(value: unknown) {
    this._includeSearch = coerceBooleanProperty(value);
  }

  ngOnInit(): void {
    this.state.hold(this.inputYear$.pipe(debounceTime(1000), distinctUntilChanged()), (year) => this.year$.next(year));
    this.state.hold(merge(this.year$, this.month$).pipe(skip(1)), () => this.generateDateRange());
    this.state.hold(this.week$, (week) => this.generateDateRange(week));
    this.state.hold(this.search$.pipe(debounceTime(1000), distinctUntilChanged()), (search) =>
      this.onFilter('search', search ? search : null)
    );
    this.state.hold(this.filterType$, (value) => this.onFilter('filterType', value));
    this.parseParams(this.activatedRoute.snapshot.queryParams);
  }

  @tuiPure
  weeksStringify(items: ReadonlyArray<BaseOption<number>>): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(items.map(({ value, label }) => [value, label]));

    return ({ $implicit }: TuiContextWithImplicit<number>) => map.get($implicit) || '';
  }

  onChangeYear(yearConnector: PropertyRouteConnectorDirective<number>): void {
    if (isNaN(Number(yearConnector.propertyValue))) {
      yearConnector.onValueChange(null);
    } else {
      yearConnector.setQueryParam(yearConnector.propertyValue);
    }
    this.year$.next(yearConnector.propertyValue);
  }

  onFilter(key: string, value: string | number | null): void {
    this.resetPage();
    this.httpParams = value !== null ? this.httpParams.set(key, value) : this.httpParams.delete(key);
    this.filter.emit(this.httpParams);
  }

  private parseParams(params: Params): void {
    const year = +params['year'];
    if (year) {
      if (!isNaN(year)) {
        this.year$.next(year);
        this.initYear = year;
        if (params['month'] && !isNaN(Number(params['month']))) {
          this.month$.next(params['month']);
          if (params['week'] && !isNaN(Number(params['week']))) {
            this.week$.next(Number(params['week']));
          }
        }
      }
    } else if (this.initYear) {
      this.year$.next(this.initYear);
    }
    if (this.includeSearch) {
      if (params['search']) {
        this.search$.next(params['search']);
      }
      if (params['filterType']) {
        this.filterType$.next(params['filterType']);
      }
    }
  }

  private generateDateRange(week?: number | null): void {
    if (!this.year$.value) {
      this.resetPage();
      this.httpParams = this.httpParams.delete(this.fromKey).delete(this.toKey);
      this.filter.emit(this.httpParams);
      return;
    }
    if (week) {
      this.resetPage();
      this.httpParams = this.httpParams
        .set(this.fromKey, startOfWeek(week).valueOf())
        .set(
          this.toKey,
          isAfter(endOfWeek(week, { weekStartsOn: 1 }), endOfMonth(week))
            ? endOfMonth(week).valueOf()
            : endOfWeek(week).valueOf()
        );
      this.filter.emit(this.httpParams);
      return;
    }

    const NOW = new Date();

    if (this.month$.value !== null) {
      this.httpParams = this.httpParams
        .set(this.fromKey, startOfMonth(setMonth(setYear(NOW, Number(this.year$.value)), this.month$.value)).valueOf())
        .set(this.toKey, endOfMonth(setMonth(setYear(NOW, Number(this.year$.value)), this.month$.value)).valueOf());
    } else {
      this.httpParams = this.httpParams
        .set(this.fromKey, startOfYear(setYear(NOW, Number(this.year$.value))).valueOf())
        .set(this.toKey, endOfYear(setYear(NOW, Number(this.year$.value))).valueOf());
    }
    this.resetPage();
    this.filter.emit(this.httpParams);
    return;
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
