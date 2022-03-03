import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output, ViewChild } from '@angular/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { tuiDefaultProp } from '@taiga-ui/cdk';
import { TuiLoaderModule } from '@taiga-ui/core';
import { API, BaseComponent, Columns, Config, DefaultConfig, TableModule } from 'ngx-easy-table';

@Component({
  selector: 'hcm-pagination-table',
  templateUrl: './pagination-table.component.html',
  styleUrls: ['./pagination-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationTableComponent<T> {
  @ViewChild('table', { static: true }) table!: BaseComponent;
  @Input() configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
    orderEnabled: false,
  };
  @Input() @tuiDefaultProp() columns: Columns[] = [];
  @Input() @tuiDefaultProp() data: T[] | null = null;
  @Input() @tuiDefaultProp() loading = false;
  @Input() total: number | null = 0;
  @Input() page: number | null = 0;
  @Input() size: number | null = 0;
  @Output() pageChange = new EventEmitter<number>();
  @Output() sizeChange = new EventEmitter<number>();

  onSizeChange(size: number): void {
    this.table.apiEvent({ type: API.setPaginationDisplayLimit, value: size });
    this.sizeChange.emit(size);
  }
}

@NgModule({
  declarations: [PaginationTableComponent],
  imports: [CommonModule, TuiLoaderModule, TableModule, TuiTablePaginationModule],
  exports: [PaginationTableComponent],
})
export class PaginationTableComponentModule {}
