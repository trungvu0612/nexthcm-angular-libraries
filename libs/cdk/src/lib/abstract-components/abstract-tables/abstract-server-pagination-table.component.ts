import { HttpParams } from '@angular/common/http';
import { RxState } from '@rx-angular/state';
import { API, BaseComponent, Config, DefaultConfig } from 'ngx-easy-table';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pagination } from '../../models';

export abstract class AbstractServerPaginationTableComponent<T> {
  table!: BaseComponent;
  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
  };
  data$: Observable<T[]>;
  total$: Observable<number>;
  readonly queryParams$ = new BehaviorSubject(new HttpParams().set('page', '0').set('size', 10));

  protected constructor(public state: RxState<Pagination<T>>) {
    this.data$ = this.state.select('items');
    this.total$ = this.state.select('totalElements');
  }

  item = (item: T) => item;

  onSize(size: number): void {
    this.table.apiEvent({
      type: API.setPaginationDisplayLimit,
      value: size,
    });
    this.queryParams$.next(this.queryParams$.value.set('size', size.toString()));
  }

  onPage(page: number): void {
    this.queryParams$.next(this.queryParams$.value.set('page', page.toString()));
  }
}
