import { coerceBooleanProperty } from '@angular/cdk/coercion';
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
import { PropertyRouteConnectorDirective, PropertyRouteConnectorDirectiveModule } from '@nexthcm/cdk';
import { TuiHorizontalDirection, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';

@Component({
  selector: 'hcm-input-filter',
  templateUrl: './input-filter.component.html',
  styleUrls: ['./input-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFilterComponent implements AfterViewInit {
  @ViewChild('connector') connector!: PropertyRouteConnectorDirective<string>;

  @Input() label = '';
  @Input() icon: string | null = null;
  @Input() iconAlign: TuiHorizontalDirection = 'left';
  @Input() propertyName = '';
  @Input() initValue?: string;
  @Output() valueChange = new EventEmitter<string | null>();

  private _numberValue = false;

  get numberValue(): boolean {
    return this._numberValue;
  }

  @Input()
  set numberValue(value: unknown) {
    this._numberValue = coerceBooleanProperty(value);
  }

  ngAfterViewInit(): void {
    if (typeof this.initValue === 'string') {
      this.connector.onValueChange(this.initValue);
    }
  }

  onChangeValue(connector: PropertyRouteConnectorDirective<string>): void {
    if (this.numberValue && isNaN(Number(connector.propertyValue))) {
      connector.propertyValue = null;
    }
    connector.setQueryParam(connector.propertyValue);
    this.valueChange.emit(connector.propertyValue);
  }
}

@NgModule({
  declarations: [InputFilterComponent],
  imports: [
    CommonModule,
    PropertyRouteConnectorDirectiveModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    FormsModule,
  ],
  exports: [InputFilterComponent],
})
export class InputFilterComponentModule {}
