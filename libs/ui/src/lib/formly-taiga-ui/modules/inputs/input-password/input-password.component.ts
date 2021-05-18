import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-input-password',
  templateUrl: './input-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPasswordComponent extends FieldType {
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      textfieldSize: 'l',
    },
  };
}
