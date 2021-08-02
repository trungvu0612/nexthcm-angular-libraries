import { BaseComponent } from 'ngx-easy-table';
import { AbstractServerPaginationTableComponent } from './abstract-server-pagination-table.component';

export class AbstractSelectableTableComponent<T, K = string> extends AbstractServerPaginationTableComponent<T> {
  table!: BaseComponent;
  allSelected: boolean | null = false;
  readonly selected = new Set<K>();

  tableEventEmitted(tableEvent: { event: string; value: any }): void {
    if (tableEvent.event === 'onSelectAll') {
      this.selected.clear();
      this.allSelected = !this.allSelected;
      if (this.allSelected) {
        this.table.data.forEach((row) => this.selected.add(row.id));
      }
    }
    if (tableEvent.event === 'onOrder') {
      this.queryParams$.next(this.queryParams$.value.set('sort', `${tableEvent.value.key},${tableEvent.value.order}`));
    }
  }

  rowSelected(rowId: K, value: boolean): void {
    if (rowId) {
      value ? this.selected.add(rowId) : this.selected.delete(rowId);
    }
    if (!this.selected.size) {
      this.allSelected = false;
    } else {
      this.allSelected = this.selected.size !== this.table.data.length ? null : true;
    }
  }
}
