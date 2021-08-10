import { CommonModule, getLocaleMonthNames, Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Params, UrlSerializer } from '@angular/router';
import { BaseOption } from '@nexthcm/cdk';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { TuiContextWithImplicit, TuiLetModule, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { TuiDataListModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import {
  TuiDataListWrapperModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiSelectModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { endOfMonth, endOfYear, setMonth, setYear, startOfMonth, startOfYear } from 'date-fns';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestStatus } from '../../../enums';

@Component({
  selector: 'hcm-request-list-filter',
  templateUrl: './request-list-filter.component.html',
  styleUrls: ['./request-list-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestListFilterComponent implements OnInit {
  @Input() queryParams!: BehaviorSubject<HttpParams>;
  @Input() statusFilter = true;
  year: number | null = null;
  month: number | null = null;
  search: string | null = null;
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
    if (convertToParamMap(this.activatedRoute.snapshot.queryParams).keys.length) {
      this.parseParams(this.activatedRoute.snapshot.queryParams);
    }
  }

  onFilterByYear(): void {
    if (this.year === null) {
      this.month = null;
      this.setQueryParams('month', null);
    }
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

  onFilterByKeyword(): void {
    this.queryParams.next(this.onFilter('search', this.search));
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
    let httpParams = this.queryParams.value;
    if (params.year) {
      if (!isNaN(Number(params.year))) {
        this.year = +params.year;
        if (params.month && !isNaN(Number(params.month))) {
          this.month = +params.month;
        }
        httpParams = this.filterByYearMonth();
      } else {
        this.setQueryParams('month', null);
      }
    }
    if (params.search) {
      this.search = params.search;
      httpParams = this.onFilter('search', params.search);
    }
    if (params.status && !isNaN(Number(params.status))) {
      this.status = params.status;
      httpParams = this.onFilter('status', params.status);
    }
    this.queryParams.next(httpParams);
  }

  private setQueryParams<T>(key: string, value: T | null) {
    const tree = this.urlSerializer.parse(this.locationRef.path());
    tree.queryParams = { ...tree.queryParams, [key]: value };
    this.locationRef.go(String(tree));
  }
}

@NgModule({
  declarations: [RequestListFilterComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    TuiInputNumberModule,
    TuiSelectModule,
    TuiLetModule,
    TuiTextfieldControllerModule,
    FormsModule,
    TuiDataListModule,
    TuiInputModule,
    TuiDataListWrapperModule,
    TuiTagModule,
  ],
  exports: [RequestListFilterComponent],
})
export class RequestListFilterComponentModule {}
