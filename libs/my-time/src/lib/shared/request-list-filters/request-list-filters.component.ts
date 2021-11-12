import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Params } from '@angular/router';
import {
  BasicFilterComponentModule,
  InputFilterComponentModule,
  InputNumberFilterComponentModule,
  SelectFilterComponentModule,
  SelectMonthFilterComponentModule,
  WorkflowStatusComboBoxFilterComponentModule,
} from '@nexthcm/ui';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { tuiDefaultProp } from '@taiga-ui/cdk';
import { TuiStringHandler } from '@taiga-ui/cdk/types';
import { TuiDataListModule } from '@taiga-ui/core';
import { TuiFilterModule, TuiTagModule } from '@taiga-ui/kit';
import { endOfMonth, endOfYear, setMonth, setYear, startOfMonth, startOfYear } from 'date-fns';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';

const getLabel: Record<string, string> = {
  MY_TEAM: 'myTeam',
};

@Component({
  selector: 'hcm-request-list-filters',
  templateUrl: './request-list-filters.component.html',
  styleUrls: ['./request-list-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class RequestListFiltersComponent implements OnInit {
  @Input() statusFilter = true;

  filterType: string[] = [];

  readonly year$ = new BehaviorSubject<number | null>(null);
  readonly month$ = new BehaviorSubject<number | null>(null);
  readonly search$ = new Subject<string | null>();
  readonly statusId$ = new Subject<string | null>();
  readonly filterType$ = new Subject<string | null>();
  private httpParams$ = new BehaviorSubject<HttpParams>(new HttpParams());

  constructor(
    private readonly state: RxState<Record<string, unknown>>,
    private readonly translocoService: TranslocoService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    state.hold(combineLatest([this.year$.pipe(skip(1), debounceTime(1000), distinctUntilChanged()), this.month$]), () =>
      this.httpParams$.next(this.filterByYearMonth())
    );
    state.hold(this.search$.pipe(debounceTime(1000), distinctUntilChanged()), (search) =>
      this.httpParams$.next(this.onFilter('search', search))
    );
    state.hold(this.statusId$, (statusId) => this.httpParams$.next(this.onFilter('wfStateId', statusId)));
    state.hold(this.filterType$, (filterType) => this.httpParams$.next(this.onFilter('filterType', filterType)));
  }

  @Input()
  @tuiDefaultProp()
  set httpParams(subject: BehaviorSubject<HttpParams>) {
    this.httpParams$ = subject;
  }

  private _includeSearch = false;

  get includeSearch(): boolean {
    return this._includeSearch;
  }

  @Input()
  set includeSearch(value: unknown) {
    this._includeSearch = coerceBooleanProperty(value);
  }

  private _managerFilters = false;

  get managerFilters(): boolean {
    return this._managerFilters;
  }

  @Input()
  set managerFilters(value: unknown) {
    this._managerFilters = coerceBooleanProperty(value);
  }

  ngOnInit(): void {
    if (convertToParamMap(this.activatedRoute.snapshot.queryParams).keys.length) {
      this.parseParams(this.activatedRoute.snapshot.queryParams);
    }
  }

  onFilter(key: string, value: string | number | null): HttpParams {
    let httpParams = this.httpParams$.value;
    if (value !== null) {
      httpParams = httpParams.set(key, value);
    } else {
      httpParams = httpParams.delete(key);
    }
    return httpParams;
  }

  onFilterByWorkflowStatuses(statuses: string): void {
    this.statusId$.next(statuses || null);
  }

  onFilterChange(filterType: string): void {
    this.filterType$.next(filterType || null);
  }

  readonly getFilterLabel: TuiStringHandler<string> = (filter: string): string => `${getLabel[filter]}`;

  private filterByYearMonth(): HttpParams {
    let httpParams = this.httpParams$.value;
    if (!this.year$.value) {
      httpParams = httpParams.delete('fromDate').delete('toDate');
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
      httpParams = httpParams.set('fromDate', fromDate).set('toDate', toDate);
    }
    return httpParams;
  }

  private parseParams(params: Params): void {
    if (params.year) {
      if (!isNaN(Number(params.year))) {
        this.year$.next(params.year);
        if (params.month && !isNaN(Number(params.month))) {
          this.month$.next(params.month);
        }
      }
    }
    if (params.search) {
      this.search$.next(params.search);
    }
  }
}

@NgModule({
  declarations: [RequestListFiltersComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    TuiDataListModule,
    TuiTagModule,
    SelectMonthFilterComponentModule,
    InputFilterComponentModule,
    SelectFilterComponentModule,
    WorkflowStatusComboBoxFilterComponentModule,
    TuiFilterModule,
    FormsModule,
    BasicFilterComponentModule,
    InputNumberFilterComponentModule,
  ],
  exports: [RequestListFiltersComponent],
})
export class RequestListFilterComponentModule {}
