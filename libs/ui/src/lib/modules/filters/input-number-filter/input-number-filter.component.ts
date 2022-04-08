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
import { NUMBER_FORMAT, PropertyRouteConnectorDirective, PropertyRouteConnectorDirectiveModule } from '@nexthcm/cdk';
import { TUI_NUMBER_FORMAT, TuiDecimalT, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputNumberModule } from '@taiga-ui/kit';

@Component({
  selector: 'hcm-input-number-filter',
  templateUrl: './input-number-filter.component.html',
  styleUrls: ['./input-number-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: TUI_NUMBER_FORMAT, useValue: NUMBER_FORMAT }],
})
export class InputNumberFilterComponent implements AfterViewInit {
  @ViewChild('connector') connector!: PropertyRouteConnectorDirective<number>;
  @Input() label = '';
  @Input() propertyName = '';
  @Input() initValue?: number;
  @Input() min = -Infinity;
  @Input() max = Infinity;
  @Input() decimal: TuiDecimalT = 'never';
  @Input() precision = 0;
  @Output() valueChange = new EventEmitter<number | null>();

  ngAfterViewInit(): void {
    if (typeof this.initValue === 'number') this.onChangeValue(this.initValue);
  }

  onChangeValue(value: number | null): void {
    this.connector.onValueChange(value);
    this.valueChange.emit(value);
  }
}

@NgModule({
  declarations: [InputNumberFilterComponent],
  imports: [TuiTextfieldControllerModule, PropertyRouteConnectorDirectiveModule, FormsModule, TuiInputNumberModule],
  exports: [InputNumberFilterComponent],
})
export class InputNumberFilterComponentModule {}
