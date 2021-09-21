import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { API, Config, DefaultConfig, Event } from 'ngx-easy-table';
import { BehaviorSubject } from 'rxjs';
import { Pagination } from '../../models';
import { AbstractServerPaginationTableComponent } from './abstract-server-pagination-table.component';

@Directive()
export abstract class AbstractServerSortPaginationTableComponent<T>
  extends AbstractServerPaginationTableComponent<T>
  implements AfterViewInit
{
  orderBy: string = this.activatedRoute.snapshot.queryParams.sort;
  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
    threeWaySort: true,
    orderEventOnly: true,
  };
  readonly queryParams$ = new BehaviorSubject(
    new HttpParams().set('page', 0).set('size', 10).set('sort', this.orderBy)
  );

  constructor(
    readonly state: RxState<Pagination<T>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute
  ) {
    super(state);
  }

  ngAfterViewInit(): void {
    const sortByMetaData = this.orderBy.split(',');

    if (sortByMetaData.length === 2 && ['asc', 'desc'].includes(sortByMetaData[1])) {
      this.table.apiEvent({
        type: API.sortBy,
        value: { column: sortByMetaData[0], order: sortByMetaData[1] as 'asc' | 'desc' },
      });
    }
  }

  eventEmitted($event: { event: Event; value: any }): void {
    if ($event.event === Event.onOrder) {
      const orderBy = `${$event.value.key},${$event.value.order}`;

      this.queryParams$.next(this.queryParams$.value.set('sort', orderBy));
      this.router.navigate([], {
        queryParams: { sort: orderBy },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  }
}
