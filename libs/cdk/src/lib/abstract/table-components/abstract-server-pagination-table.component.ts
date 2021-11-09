import { HttpParams } from '@angular/common/http';
import { Directive, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, convertToParamMap, Params, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { API, BaseComponent, Config, DefaultConfig } from 'ngx-easy-table';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pagination } from '../../models';

@Directive()
export abstract class NewAbstractServerPaginationTableComponent<T> implements OnInit {
  @ViewChild('table') table!: BaseComponent;

  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
    orderEnabled: false,
  };
  queryParams = new HttpParams().set('page', 0).set('size', 10);
  readonly fetch$ = new Subject();
  readonly data$ = this.state.select('items');
  readonly total$ = this.state.select('totalElements');
  readonly page$ = this.state.select('page').pipe(map((page) => (page <= 0 ? page : page - 1)));
  readonly size$ = this.state.select('size');

  protected constructor(
    readonly state: RxState<Pagination<T>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute
  ) {}

  item = (item: T) => item;

  ngOnInit(): void {
    if (convertToParamMap(this.activatedRoute.snapshot.queryParams).keys.length) {
      this.parseParams(this.activatedRoute.snapshot.queryParams);
    }
    this.fetch$.next();
  }

  onSize(size: number): void {
    this.table.apiEvent({ type: API.setPaginationDisplayLimit, value: size });
    this.queryParams = this.queryParams.set('size', size.toString());
    this.router.navigate([], {
      queryParams: { size },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    this.fetch$.next();
  }

  onPage(page: number): void {
    this.queryParams = this.queryParams.set('page', page.toString());
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    this.fetch$.next();
  }

  protected parseParams(params: Params): void {
    this.queryParams = params.page ? this.queryParams.set('page', params.page) : this.queryParams.delete('page');
    this.queryParams = params.size ? this.queryParams.set('size', params.size) : this.queryParams.delete('size');
  }
}
