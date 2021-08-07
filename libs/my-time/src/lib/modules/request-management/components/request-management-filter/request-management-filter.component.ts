import { getLocaleMonthNames } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
export class RequestManagementFilterComponent {
  @Input() queryParams!: BehaviorSubject<HttpParams>;
  year: number | null = null;
  month: number | null = null;
  monthSearch: string | null = null;
  keyword: string | null = null;
  status: RequestStatus | null = null;
  readonly monthList$: Observable<BaseOption<number>[]> = this.translocoService.langChanges$.pipe(
    map((lang) => getLocaleMonthNames(lang, 1, 2).map((month, index) => ({ label: month, value: index })))
  );
  readonly statusList = Object.values(RequestStatus).filter((value) => !isNaN(Number(value)));
  readonly RequestStatus = RequestStatus;

  constructor(private translocoService: TranslocoService) {}

  @tuiPure
  monthStringify(items: ReadonlyArray<BaseOption<number>>): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(items.map(({ value, label }) => [value, label]));
    return ({ $implicit }: TuiContextWithImplicit<number>) => map.get($implicit) || '';
  }

  onFilterByYear(): void {
    this.filterByYearMonth();
  }

  onFilterByMonth(value: number | null): void {
    this.month = value;
    this.filterByYearMonth();
  }

  onFilterByStatus(value: RequestStatus | null): void {
    this.status = value;
    this.onFilter('status', value);
  }

  onFilter(key: string, value: string | number | RequestStatus | null): void {
    if (value !== null) {
      this.queryParams.next(this.queryParams.value.set(key, value));
    } else {
      this.queryParams.next(this.queryParams.value.delete(key));
    }
  }

  private filterByYearMonth(): void {
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
      this.queryParams.next(this.queryParams.value.set('fromDate', fromDate).set('toDate', toDate));
    } else {
      this.queryParams.next(this.queryParams.value.delete('fromDate').delete('toDate'));
    }
  }
}
