import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { TUI_FIRST_DAY, TUI_LAST_DAY } from '@taiga-ui/cdk';

@Component({
  selector: 'hcm-formly-input-date-time',
  templateUrl: './input-date-time.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateTimeComponent extends FieldType {
  readonly tuiFirstDay = TUI_FIRST_DAY;
  readonly tuiLastDay = TUI_LAST_DAY;

  override defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      textfieldSize: 'l',
      timeMode: 'HH:MM',
    },
  };
}
