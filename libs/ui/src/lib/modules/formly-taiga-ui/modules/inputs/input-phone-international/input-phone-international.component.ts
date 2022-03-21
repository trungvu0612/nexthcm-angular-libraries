import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { TuiCountryIsoCode } from '@taiga-ui/kit';

@Component({
  selector: 'hcm-formly-input-phone-international',
  templateUrl: './input-phone-international.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPhoneInternationalComponent extends FieldType {
  override defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      textfieldSize: 'l',
      countries: Object.values(TuiCountryIsoCode),
      countryIsoCode: TuiCountryIsoCode.VN,
    },
  };
}
