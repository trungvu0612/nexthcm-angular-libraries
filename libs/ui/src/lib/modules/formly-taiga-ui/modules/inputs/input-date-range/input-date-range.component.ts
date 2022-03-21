import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { TUI_FIRST_DAY, TUI_LAST_DAY } from '@taiga-ui/cdk';

@Component({
  selector: 'hcm-formly-input-date-range',
  templateUrl: './input-date-range.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateRangeComponent extends FieldType {
  override defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      textfieldSize: 'l',
      minDate: TUI_FIRST_DAY,
      maxDate: TUI_LAST_DAY,
    },
  };
}
