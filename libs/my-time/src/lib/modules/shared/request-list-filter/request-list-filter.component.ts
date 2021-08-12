import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, convertToParamMap, Params } from '@angular/router';
import { InputFilterComponentModule, SelectFilterComponentModule, SelectMonthFilterComponentModule } from '@nexthcm/ui';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { tuiDefaultProp } from '@taiga-ui/cdk';
import { TuiDataListModule } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { endOfMonth, endOfYear, setMonth, setYear, startOfMonth, startOfYear } from 'date-fns';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { RequestStatus } from '../../../enums';

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
  readonly status$ = new Subject<RequestStatus | null>();
  readonly statusList = Object.values(RequestStatus).filter((value) => !isNaN(Number(value)));
  readonly RequestStatus = RequestStatus;
  private httpParams$ = new BehaviorSubject<HttpParams>(new HttpParams());

  constructor(
    private state: RxState<Record<string, unknown>>,
    private translocoService: TranslocoService,
    private activatedRoute: ActivatedRoute
  ) {
    state.hold(combineLatest([this.year$, this.month$]), () => this.httpParams$.next(this.filterByYearMonth()));
    state.hold(this.search$, (search) => this.httpParams$.next(this.onFilter('search', search)));
    state.hold(this.status$, (status) => this.httpParams$.next(this.onFilter('status', status)));
  }

  @Input()
  @tuiDefaultProp()
  set httpParams(subject: BehaviorSubject<HttpParams>) {
    this.httpParams$ = subject;
  }

  ngOnInit(): void {
    if (convertToParamMap(this.activatedRoute.snapshot.queryParams).keys.length) {
      this.parseParams(this.activatedRoute.snapshot.queryParams);
    }
  }

  onFilter(key: string, value: string | number | RequestStatus | null): HttpParams {
    let httpParams = this.httpParams$.value;
    if (value !== null) {
      httpParams = httpParams.set(key, value);
    } else {
      httpParams = httpParams.delete(key);
    }
    return httpParams;
  }

  private filterByYearMonth(): HttpParams {
    let httpParams = this.httpParams$.value;
    if (this.year$.value === null) {
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
    if (params.status && !isNaN(Number(params.status))) {
      this.status$.next(params.status);
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
  ],
  exports: [RequestListFilterComponent],
})
export class RequestListFilterComponentModule {}