import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, convertToParamMap, Params } from '@angular/router';
import {
  InputFilterComponentModule,
  SelectFilterComponentModule,
  SelectMonthFilterComponentModule,
  WorkflowStatusComboBoxFilterComponentModule,
} from '@nexthcm/ui';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { tuiDefaultProp } from '@taiga-ui/cdk';
import { TuiDataListModule } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { endOfMonth, endOfYear, setMonth, setYear, startOfMonth, startOfYear } from 'date-fns';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';

@Component({
  selector: 'hcm-request-list-filter',
  templateUrl: './request-list-filter.component.html',
  styleUrls: ['./request-list-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class RequestListFilterComponent implements OnInit {
  @Input() statusFilter = true;

  readonly year$ = new BehaviorSubject<string | null>(null);
  readonly month$ = new BehaviorSubject<number | null>(null);
  readonly search$ = new Subject<string | null>();
  readonly statusId$ = new Subject<string | null>();
  private httpParams$ = new BehaviorSubject<HttpParams>(new HttpParams());

  constructor(
    private state: RxState<Record<string, unknown>>,
    private translocoService: TranslocoService,
    private activatedRoute: ActivatedRoute
  ) {
    state.hold(combineLatest([this.year$.pipe(skip(1), debounceTime(1000), distinctUntilChanged()), this.month$]), () =>
      this.httpParams$.next(this.filterByYearMonth())
    );
    state.hold(this.search$.pipe(debounceTime(1000), distinctUntilChanged()), (search) =>
      this.httpParams$.next(this.onFilter('search', search))
    );
    state.hold(this.statusId$, (statusId) => this.httpParams$.next(this.onFilter('wfStateId', statusId)));
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
    this.statusId$.next(statuses ? statuses : null);
  }

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
  declarations: [RequestListFilterComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    TuiDataListModule,
    TuiTagModule,
    SelectMonthFilterComponentModule,
    InputFilterComponentModule,
    SelectFilterComponentModule,
    WorkflowStatusComboBoxFilterComponentModule,
  ],
  exports: [RequestListFilterComponent],
})
export class RequestListFilterComponentModule {}
