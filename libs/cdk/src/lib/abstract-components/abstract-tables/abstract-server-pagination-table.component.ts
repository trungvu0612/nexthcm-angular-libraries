import { HttpParams } from '@angular/common/http';
import { Config, DefaultConfig } from 'ngx-easy-table';
import { BehaviorSubject } from 'rxjs';

export class AbstractServerPaginationTableComponent<T> {
  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
  };
  readonly queryParams$ = new BehaviorSubject(new HttpParams().set('page', '0').set('size', 10));
  item = (item: T) => item;

  onSize(size: number): void {
    this.queryParams$.next(this.queryParams$.value.set('size', size.toString()));
  }

  onPage(page: number): void {
    this.queryParams$.next(this.queryParams$.value.set('page', page.toString()));
  }
}
