import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { TUI_FIRST_DAY, TUI_LAST_DAY } from '@taiga-ui/cdk';

@Component({
  selector: 'formly-input-month',
  templateUrl: './input-month.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputMonthComponent extends FieldType {
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      textfieldSize: 'l',
      minDate: TUI_FIRST_DAY,
      maxDate: TUI_LAST_DAY,
    },
  };
}
