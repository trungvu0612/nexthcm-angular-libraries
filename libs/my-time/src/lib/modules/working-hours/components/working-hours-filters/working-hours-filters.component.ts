import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, UrlSerializer } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { tuiDefaultProp, tuiPure } from '@taiga-ui/cdk';
import {
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  getMonth,
  getYear,
  setMonth,
  setYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import omit from 'just-omit';
import { BehaviorSubject, combineLatest, merge, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

const generateWeekList = (year: number | null, month: number | null): number[] => {
  if (!year || month === null) return [];

  const thatMonth = setYear(setMonth(new Date(), month), year);

  return eachWeekOfInterval({ start: startOfMonth(thatMonth), end: endOfMonth(thatMonth) }).map((date) =>
    date.valueOf()
  );
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

  initYear = getYear(this.now);
  initMonth = getMonth(this.now);

  weekValues: number[] = [];

  readonly inputYear$ = new Subject<number | null>();
  readonly year$ = new BehaviorSubject<number | null>(null);
  readonly month$ = new BehaviorSubject<number | null>(null);
  readonly week$ = new BehaviorSubject<number | null>(null);
  readonly search$ = new Subject<string | null>();
  readonly weekList$ = combineLatest([this.year$, this.month$]).pipe(
    map(([year, month]) => {
      this.weekValues = generateWeekList(year, month);
      return this.weekValues.map((_, index) => index + 1);
    })
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

  @tuiPure
  get now(): Date {
    return new Date();
  }

  @tuiPure
  get initWeek(): number {
    const listWeek = generateWeekList(this.initYear, this.initMonth);
    const startWeek = startOfWeek(this.now).valueOf();
    return listWeek.indexOf(startWeek) + 1;
  }

  ngOnInit(): void {
    this.state.hold(this.inputYear$.pipe(debounceTime(1000), distinctUntilChanged()), (year) => this.year$.next(year));
    this.state.hold(merge(this.weekList$, this.week$).pipe(debounceTime(100)), () => this.generateDateRange());
    this.state.hold(this.search$.pipe(debounceTime(1000), distinctUntilChanged()), (search) =>
      this.onFilter('search', search ? search : null)
    );
    this.state.hold(this.filterType$, (value) => this.onFilter('filterType', value));
    this.parseParams(this.activatedRoute.snapshot.queryParams);
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

  private generateDateRange(): void {
    let fromDate: number | null = null;
    let toDate: number | null = null;

    if (this.year$.value !== null) {
      const year = setYear(this.now, this.year$.value);

      if (this.month$.value !== null) {
        const month = setMonth(year, this.month$.value);
        const startMonth = startOfMonth(month).valueOf();
        const endMonth = endOfMonth(month).valueOf();

        if (this.week$.value !== null && this.weekValues.length >= this.week$.value) {
          const week = this.weekValues[this.week$.value - 1];
          const startWeek = startOfWeek(week).valueOf();
          const endWeek = endOfWeek(week).valueOf();

          fromDate = startMonth > startWeek ? startMonth : startWeek;
          toDate = endMonth < endWeek ? endMonth : endWeek;
        } else {
          fromDate = startMonth;
          toDate = endMonth;
        }
      } else {
        fromDate = startOfYear(year).valueOf();
        toDate = endOfYear(year).valueOf();
      }
    }

    if (fromDate !== null && toDate !== null) {
      this.httpParams = this.httpParams.set(this.fromKey, fromDate).set(this.toKey, toDate);
    } else {
      this.httpParams = this.httpParams.delete(this.fromKey).delete(this.toKey);
    }

    this.resetPage();
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
