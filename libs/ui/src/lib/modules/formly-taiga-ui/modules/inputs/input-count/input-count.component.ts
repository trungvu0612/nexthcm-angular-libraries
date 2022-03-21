import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'hcm-formly-input-count',
  templateUrl: './input-count.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputCountComponent extends FieldType {
  override defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      textfieldSize: 'l',
      min: 0,
      max: Infinity,
      postfix: '',
      step: 1,
      hideButtons: false,
    },
  };
}
