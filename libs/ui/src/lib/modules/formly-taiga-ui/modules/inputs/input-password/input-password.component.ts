import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'hcm-formly-input-password',
  templateUrl: './input-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPasswordComponent extends FieldType {
  override defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      textfieldSize: 'l',
    },
  };
}
