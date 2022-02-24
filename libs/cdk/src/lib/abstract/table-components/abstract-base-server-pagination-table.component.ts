import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Directive, ViewChild } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { API, BaseComponent, Config, DefaultConfig } from 'ngx-easy-table';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Pagination } from '../../models';

@Directive()
export abstract class AbstractBaseServerPaginationTableComponent<T> implements AfterViewInit {
  @ViewChild('table') table!: BaseComponent;

  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
    orderEnabled: false,
  };
  queryParams = new HttpParams().set('page', 0).set('size', 10);
  readonly fetch$ = new Subject<void>();
  readonly data$ = this.state.select('items');
  readonly total$ = this.state.select('totalElements');
  readonly page$ = this.state.select('page').pipe(map((page) => (page <= 0 ? 0 : page - 1)));
  readonly size$ = this.state.select('size');

  protected constructor(readonly state: RxState<Pagination<T>>) {}

  item = (item: T) => item;

  ngAfterViewInit(): void {
    this.fetch$.next();
  }

  onSize(size: number): void {
    this.table.apiEvent({ type: API.setPaginationDisplayLimit, value: size });
    this.queryParams = this.queryParams.set('size', size);
    this.fetch$.next();
  }

  onPage(page: number): void {
    this.queryParams = this.queryParams.set('page', page);
    this.fetch$.next();
  }
}
