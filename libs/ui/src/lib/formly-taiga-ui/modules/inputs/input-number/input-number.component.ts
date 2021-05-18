import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDecimal } from '@taiga-ui/core';

@Component({
  selector: 'formly-input-number',
  templateUrl: './input-number.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberComponent extends FieldType {
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      textfieldSize: 'l',
      min: -Infinity,
      max: Infinity,
      postfix: '',
      precision: 2,
      decimal: TuiDecimal.NotZero,
    },
  };
}
