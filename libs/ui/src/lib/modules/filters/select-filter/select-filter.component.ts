import { CommonModule } from '@angular/common';
import {
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
import { ALWAYS_FALSE_HANDLER, TuiBooleanHandler, tuiDefaultProp } from '@taiga-ui/cdk';
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
export class SelectFilterComponent<T, G> implements TuiDataListHost<T> {
  @ViewChild(TuiSelectComponent) selectComponent!: TuiSelectComponent<T>;

  @Input()
  @tuiDefaultProp()
  disabledItemHandler: TuiBooleanHandler<T> = ALWAYS_FALSE_HANDLER;

  @Input()
  @tuiDefaultProp()
  valueContent: PolymorpheusContent<TuiValueContentContext<T>> = '';

  @Input() propertyName = '';
  @Input() label = '';

  @Output() valueChange = new EventEmitter<G | null>();

  @ContentChild(TemplateRef, { static: true }) readonly content: PolymorpheusContent = '';

  onValueChange(connector: PropertyRouteConnectorDirective<G>, value: G | null): void {
    connector.onValueChange(value);
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
