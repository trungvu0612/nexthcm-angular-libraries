import { AfterViewInit, Directive } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { API, Config, DefaultConfig, Event } from 'ngx-easy-table';

import { Pagination } from '../../models';
import { AbstractServerPaginationTableComponent } from './abstract-server-pagination-table.component';

@Directive()
export abstract class AbstractServerSortPaginationTableComponent<T>
  extends AbstractServerPaginationTableComponent<T>
  implements AfterViewInit
{
  orderBy: string = this.activatedRoute.snapshot.queryParams['sort'] || '';
  override configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
    threeWaySort: true,
    orderEnabled: true,
    orderEventOnly: true,
  };

  protected constructor(override readonly state: RxState<Pagination<T>>, readonly activatedRoute: ActivatedRoute) {
    super(state);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    const [key, order] = this.orderBy.split(',');

    if (key && ['asc', 'desc'].includes(order)) {
      if (order === 'asc') {
        /**
         * @see https://github.com/ssuperczynski/ngx-easy-table/blob/3ee88fdbe0df7fa2035e96227cf5399b88652173/projects/ngx-easy-table/src/lib/components/base/base.component.ts#L523
         */
        this.table.sortState.set(key, 'desc'); // pre-sortBy
      }
      this.table.apiEvent({
        type: API.sortBy,
        value: { column: key, order: order as 'asc' | 'desc' },
      });
    }
  }

  eventEmitted($event: { event: string; value: any }): void {
    if ($event.event === Event.onOrder) {
      const orderBy = $event.value.order ? `${$event.value.key},${$event.value.order}` : null;

      this.queryParams = orderBy ? this.queryParams.set('sort', orderBy) : this.queryParams.delete('sort');
      this.fetch$.next();
      this.setQueryParams('sort', orderBy);
    }
  }
}
