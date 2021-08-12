import { CommonModule, getLocaleMonthNames } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseOption, PropertyRouteConnectorDirective, PropertyRouteConnectorDirectiveModule } from '@nexthcm/cdk';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { TuiContextWithImplicit, TuiLetModule, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { TuiDataListModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiSelectModule } from '@taiga-ui/kit';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'hcm-select-month-filter',
  templateUrl: './select-month-filter.component.html',
  styleUrls: ['./select-month-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMonthFilterComponent {
  @Output() monthChange = new EventEmitter<number | null>();

  readonly monthList$: Observable<BaseOption<number>[]> = this.translocoService.langChanges$.pipe(
    map((lang) => getLocaleMonthNames(lang, 1, 2).map((month, index) => ({ label: month, value: index })))
  );

  constructor(private translocoService: TranslocoService) {}

  @tuiPure
  monthStringify(items: ReadonlyArray<BaseOption<number>>): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(items.map(({ value, label }) => [value, label]));
    return ({ $implicit }: TuiContextWithImplicit<number>) => map.get($implicit) || '';
  }

  onValueChange(connector: PropertyRouteConnectorDirective<number>, value: number | null): void {
    connector.onValueChange(value);
    this.monthChange.emit(value);
  }
}

@NgModule({
  declarations: [SelectMonthFilterComponent],
  imports: [
    CommonModule,
    PropertyRouteConnectorDirectiveModule,
    TuiTextfieldControllerModule,
    TuiSelectModule,
    TuiLetModule,
    FormsModule,
    TuiDataListModule,
    TranslocoModule,
  ],
  exports: [SelectMonthFilterComponent],
})
export class SelectMonthFilterComponentModule {}
