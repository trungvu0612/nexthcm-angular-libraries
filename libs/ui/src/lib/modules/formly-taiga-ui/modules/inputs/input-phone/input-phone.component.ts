import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-input-phone',
  templateUrl: './input-phone.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPhoneComponent extends FieldType {
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      textfieldSize: 'l',
      countryCode: '+84',
      phoneMaskAfterCountryCode: '(###) ###-##-##',
    },
  };
}
