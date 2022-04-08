import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  forwardRef,
  Input,
  NgModule,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PropertyRouteConnectorDirective, PropertyRouteConnectorDirectiveModule } from '@nexthcm/cdk';
import { tuiDefaultProp } from '@taiga-ui/cdk';
import {
  TUI_DATA_LIST_HOST,
  TuiDataListHost,
  TuiDataListModule,
  TuiTextfieldControllerModule,
  TuiValueContentContext,
} from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiSelectComponent, TuiSelectModule } from '@taiga-ui/kit';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'hcm-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_DATA_LIST_HOST,
      useExisting: forwardRef(() => SelectFilterComponent),
    },
  ],
})
export class SelectFilterComponent<T, G> implements TuiDataListHost<T>, AfterViewInit {
  @ViewChild('connector', { static: true }) connector!: PropertyRouteConnectorDirective<G>;
  @ViewChild(TuiSelectComponent) selectComponent!: TuiSelectComponent<T>;
  @ContentChild(TemplateRef, { static: true }) readonly content: PolymorpheusContent = '';

  @Input()
  @tuiDefaultProp()
  valueContent: PolymorpheusContent<TuiValueContentContext<T>> = '';

  @Input() propertyName = '';
  @Input() label = '';
  @Input() initValue!: G;

  @Output() valueChange = new EventEmitter<G | null>();

  ngAfterViewInit(): void {
    if (this.initValue) this.onValueChange(this.initValue);
  }

  onValueChange(value: G | null): void {
    this.connector.onValueChange(value);
    this.valueChange.emit(value);
  }

  handleOption(option: T): void {
    this.selectComponent.handleOption(option);
  }
}

@NgModule({
  declarations: [SelectFilterComponent],
  imports: [
    CommonModule,
    TuiSelectModule,
    FormsModule,
    TuiTextfieldControllerModule,
    PropertyRouteConnectorDirectiveModule,
    TuiDataListWrapperModule,
    TuiDataListModule,
  ],
  exports: [SelectFilterComponent],
})
export class SelectFilterComponentModule {}
