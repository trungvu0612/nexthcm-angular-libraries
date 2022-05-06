import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BaseOption,
  CommonService,
  PropertyRouteConnectorDirective,
  PropertyRouteConnectorDirectiveModule,
} from '@nexthcm/cdk';
import { TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@rx-angular/template';
import { TuiContextWithImplicit, TuiLetModule, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { TuiDataListModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiSelectModule } from '@taiga-ui/kit';

@Component({
  selector: 'hcm-select-month-filter',
  templateUrl: './select-month-filter.component.html',
  styleUrls: ['./select-month-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMonthFilterComponent implements AfterViewInit {
  @ViewChild('connector', { static: true }) connector!: PropertyRouteConnectorDirective<number>;
  @Input() label = 'month';
  @Input() propertyName = 'month';
  @Input() initMonth?: number;
  @Output() monthChange = new EventEmitter<number | null>();

  readonly monthList$ = this.commonService.localeMonths$;

  constructor(private readonly commonService: CommonService) {}

  ngAfterViewInit(): void {
    if (typeof this.initMonth === 'number') this.onValueChange(this.initMonth);
  }

  @tuiPure
  monthStringify(items: ReadonlyArray<BaseOption<number>>): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(items.map(({ value, label }) => [value, label]));

    return ({ $implicit }: TuiContextWithImplicit<number>) => map.get($implicit) || '';
  }

  onValueChange(value: number | null): void {
    this.connector.onValueChange(value);
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
    PushModule,
  ],
  exports: [SelectMonthFilterComponent],
})
export class SelectMonthFilterComponentModule {}
