import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { TUI_DEFAULT_STRINGIFY, tuiDefaultProp } from '@taiga-ui/cdk';
import { TuiStringHandler } from '@taiga-ui/cdk/types';
import { TuiFilterModule } from '@taiga-ui/kit';

@Component({
  selector: 'hcm-basic-filter',
  templateUrl: './basic-filter.component.html',
  styleUrls: ['./basic-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicFilterComponent<T> {
  @Input() @tuiDefaultProp() stringify: TuiStringHandler<T> = TUI_DEFAULT_STRINGIFY;
  @Input() @tuiDefaultProp() getValue: TuiStringHandler<T> = TUI_DEFAULT_STRINGIFY;
  @Input() @tuiDefaultProp() items: T[] = [];
  @Output() filtersChange = new EventEmitter<string>();
  filters: T[] = [];

  constructor(private readonly router: Router, private readonly activatedRoute: ActivatedRoute) {}

  private _key = '';

  @Input() set key(value: string) {
    const filtersString = this.activatedRoute.snapshot.queryParams[value];

    this._key = value;
    if (filtersString) {
      this.filters = filtersString.split(',');
    }
  }

  onChangeValue(filters: T[]): void {
    const filtersString = filters.map((filter) => this.getValue(filter)).join(',');

    this.filters = filters;
    this.filtersChange.emit(filtersString);
    this.router.navigate([], {
      queryParams: { [this._key]: filtersString || null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}

@NgModule({
  declarations: [BasicFilterComponent],
  imports: [TuiFilterModule, FormsModule, TranslocoModule],
  exports: [BasicFilterComponent],
})
export class BasicFilterComponentModule {}
