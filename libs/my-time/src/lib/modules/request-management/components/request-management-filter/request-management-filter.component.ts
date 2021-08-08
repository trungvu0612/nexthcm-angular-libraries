import { getLocaleMonthNames, Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, convertToParamMap, Params, UrlSerializer } from '@angular/router';
import { BaseOption } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { TuiContextWithImplicit, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { endOfMonth, endOfYear, setMonth, setYear, startOfMonth, startOfYear } from 'date-fns';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestStatus } from '../../../../enums';

@Component({
  selector: 'hcm-request-management-filter[queryParams]',
  templateUrl: './request-management-filter.component.html',
  styleUrls: ['./request-management-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestManagementFilterComponent implements OnInit {
  @Input() queryParams!: BehaviorSubject<HttpParams>;
  year: number | null = null;
  month: number | null = null;
  keyword: string | null = null;
  status: RequestStatus | null = null;
  readonly monthList$: Observable<BaseOption<number>[]> = this.translocoService.langChanges$.pipe(
    map((lang) => getLocaleMonthNames(lang, 1, 2).map((month, index) => ({ label: month, value: index })))
  );
  readonly statusList = Object.values(RequestStatus).filter((value) => !isNaN(Number(value)));
  readonly RequestStatus = RequestStatus;

  constructor(
    private translocoService: TranslocoService,
    private activatedRoute: ActivatedRoute,
    private urlSerializer: UrlSerializer,
    private locationRef: Location
  ) {}

  @tuiPure
  monthStringify(items: ReadonlyArray<BaseOption<number>>): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(items.map(({ value, label }) => [value, label]));
    return ({ $implicit }: TuiContextWithImplicit<number>) => map.get($implicit) || '';
  }

  ngOnInit(): void {
    this.parseParams(this.activatedRoute.snapshot.queryParams);
  }

  onFilterByYear(): void {
    this.setQueryParams<number>('year', this.year);
    this.queryParams.next(this.filterByYearMonth());
  }

  onFilterByMonth(value: number | null): void {
    this.month = value;
    this.setQueryParams<number>('month', this.month);
    this.queryParams.next(this.filterByYearMonth());
  }

  onFilterByStatus(value: RequestStatus | null): void {
    this.status = value;
    this.queryParams.next(this.onFilter('status', value));
  }

  onFilter(key: string, value: string | number | RequestStatus | null): HttpParams {
    let httpParams = this.queryParams.value;
    this.setQueryParams<string | number>(key, value);
    if (value !== null) {
      httpParams = httpParams.set(key, value);
    } else {
      httpParams = httpParams.delete(key);
    }
    return httpParams;
  }

  private filterByYearMonth(): HttpParams {
    let httpParams = this.queryParams.value;
    if (this.year !== null) {
      let fromDate: number;
      let toDate: number;
      const NOW = new Date();
      if (this.month !== null) {
        fromDate = startOfMonth(setMonth(setYear(NOW, this.year), this.month)).valueOf();
        toDate = endOfMonth(setMonth(setYear(NOW, this.year), this.month)).valueOf();
      } else {
        fromDate = startOfYear(setYear(NOW, this.year)).valueOf();
        toDate = endOfYear(setYear(NOW, this.year)).valueOf();
      }
      httpParams = httpParams.set('fromDate', fromDate).set('toDate', toDate);
    } else {
      httpParams = httpParams.delete('fromDate').delete('toDate');
    }
    return httpParams;
  }

  private parseParams(params: Params): void {
    if (convertToParamMap(params).keys.length) {
      let httpParams = this.queryParams.value;
      if (params.year && !isNaN(Number(params.year))) {
        this.year = +params.year;
        if (params.month && !isNaN(Number(params.month))) {
          this.month = +params.month;
        }
        httpParams = this.filterByYearMonth();
      }
      if (params.keyword) {
        this.keyword = params.keyword;
        httpParams = this.onFilter('keyword', params.keyword);
      }
      if (params.status && !isNaN(Number(params.status))) {
        this.status = params.status;
        httpParams = this.onFilter('status', params.status);
      }
      this.queryParams.next(httpParams);
    }
  }

  private setQueryParams<T>(key: string, value: T | null) {
    const tree = this.urlSerializer.parse(this.locationRef.path());
    tree.queryParams = { ...tree.queryParams, [key]: value };
    this.locationRef.go(String(tree));
  }
}
