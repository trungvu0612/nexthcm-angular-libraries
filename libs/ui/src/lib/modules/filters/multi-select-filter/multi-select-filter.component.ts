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
import { tuiDefaultProp, TuiStringHandler } from '@taiga-ui/cdk';
import { TUI_DATA_LIST_HOST, TuiDataListHost, TuiDataListModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiMultiSelectComponent, TuiMultiSelectModule } from '@taiga-ui/kit';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'hcm-multi-select-filter',
  templateUrl: './multi-select-filter.component.html',
  styleUrls: ['./multi-select-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_DATA_LIST_HOST,
      useExisting: forwardRef(() => MultiSelectFilterComponent),
    },
  ],
})
export class MultiSelectFilterComponent<T, G> implements TuiDataListHost<T> {
  @ViewChild(TuiMultiSelectComponent) selectComponent!: TuiMultiSelectComponent<T>;
  @ContentChild(TemplateRef, { static: true }) readonly content: PolymorpheusContent = '';

  @Input() label = '';
  @Input() placeholder = '';
  @Input() filterValue: G[] = [];
  @Output() filterChange = new EventEmitter<G[]>();

  @Input()
  @tuiDefaultProp()
  stringify: TuiStringHandler<T> = () => '';

  onValueChange(value: G[]): void {
    this.filterChange.emit(value);
  }

  handleOption(option: T): void {
    this.selectComponent.handleOption(option);
  }
}

@NgModule({
  declarations: [MultiSelectFilterComponent],
  imports: [CommonModule, TuiMultiSelectModule, TuiTextfieldControllerModule, FormsModule, TuiDataListModule],
  exports: [MultiSelectFilterComponent],
})
export class MultiSelectFilterComponentModule {}
