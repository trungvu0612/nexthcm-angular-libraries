import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule, Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { ActivatedRoute, convertToParamMap, Params, UrlSerializer } from '@angular/router';
import {
  BasicFilterComponentModule,
  InputFilterComponentModule,
  InputNumberFilterComponentModule,
  SelectMonthFilterComponentModule,
  WorkflowStatusComboBoxFilterComponentModule,
} from '@nexthcm/ui';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { tuiDefaultProp } from '@taiga-ui/cdk';
import { TuiStringHandler } from '@taiga-ui/cdk/types';
import { endOfMonth, endOfYear, setMonth, setYear, startOfMonth, startOfYear } from 'date-fns';
import omit from 'just-omit';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';

const getLabel: Record<string, string> = {
  MY_TEAM: 'myTeam',
};

@Component({
  selector: 'hcm-request-filters',
  templateUrl: './request-filters.component.html',
  styleUrls: ['./request-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class RequestFiltersComponent implements OnInit {
  @Input() statusFilter = true;
  @Input() @tuiDefaultProp() httpParams = new HttpParams();
  @Output() filter = new EventEmitter<HttpParams>();
  @Output() resetParam = new EventEmitter<string>();

  readonly year$ = new BehaviorSubject<number | null>(null);
  readonly month$ = new BehaviorSubject<number | null>(null);
  readonly search$ = new Subject<string | null>();
  readonly statusId$ = new Subject<string | null>();
  readonly filterType$ = new Subject<string | null>();

  constructor(
    private readonly state: RxState<Record<string, unknown>>,
    private readonly translocoService: TranslocoService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly locationRef: Location,
    private readonly urlSerializer: UrlSerializer
  ) {
    state.hold(combineLatest([this.year$.pipe(skip(1), debounceTime(1000), distinctUntilChanged()), this.month$]), () =>
      this.filterByYearMonth()
    );
    state.hold(this.search$.pipe(debounceTime(1000), distinctUntilChanged()), (search) =>
      this.onFilter('search', search ? search : null)
    );
    state.hold(this.statusId$, (statusId) => this.onFilter('wfStateId', statusId));
    state.hold(this.filterType$, (filterType) => this.onFilter('filterType', filterType));
  }

  private _includeSearch = false;

  get includeSearch(): boolean {
    return this._includeSearch;
  }

  @Input()
  set includeSearch(value: unknown) {
    this._includeSearch = coerceBooleanProperty(value);
  }

  private _includeMyTeam = false;

  get includeMyTeam(): boolean {
    return this._includeMyTeam;
  }

  @Input()
  set includeMyTeam(value: unknown) {
    this._includeMyTeam = coerceBooleanProperty(value);
  }

  ngOnInit(): void {
    if (convertToParamMap(this.activatedRoute.snapshot.queryParams).keys.length) {
      this.parseParams(this.activatedRoute.snapshot.queryParams);
    }
  }

  onFilter(key: string, value: string | number | null): void {
    this.resetPage();
    this.httpParams = value !== null ? this.httpParams.set(key, value) : this.httpParams.delete(key);
    this.filter.emit(this.httpParams);
  }

  onFilterByWorkflowStatuses(statuses: string): void {
    this.statusId$.next(statuses || null);
  }

  onFilterChange(filterType: string): void {
    this.filterType$.next(filterType || null);
  }

  readonly getFilterLabel: TuiStringHandler<string> = (filter: string): string => `${getLabel[filter]}`;

  private filterByYearMonth(): void {
    if (!this.year$.value) {
      this.httpParams = this.httpParams.delete('fromDate').delete('toDate');
    } else {
      let fromDate: number;
      let toDate: number;
      const NOW = new Date();

      if (this.month$.value !== null) {
        fromDate = startOfMonth(setMonth(setYear(NOW, Number(this.year$.value)), this.month$.value)).valueOf();
        toDate = endOfMonth(setMonth(setYear(NOW, Number(this.year$.value)), this.month$.value)).valueOf();
      } else {
        fromDate = startOfYear(setYear(NOW, Number(this.year$.value))).valueOf();
        toDate = endOfYear(setYear(NOW, Number(this.year$.value))).valueOf();
      }
      this.httpParams = this.httpParams.set('fromDate', fromDate).set('toDate', toDate);
    }
    this.filter.emit(this.httpParams);
  }

  private parseParams(params: Params): void {
    if (params.year) {
      if (!isNaN(Number(params.year))) {
        this.year$.next(+params.year);
        if (params.month && !isNaN(Number(params.month))) {
          this.month$.next(params.month);
        }
      }
    }
    if (params.search) {
      this.search$.next(params.search);
    }
    if (params.filterType) {
      this.filterType$.next(params.filterType);
    }
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
  ],
  exports: [RequestFiltersComponent],
})
export class RequestFiltersComponentModule {}
