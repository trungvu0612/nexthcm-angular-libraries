import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'hcm-formly-checkbox',
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent extends FieldType {
  override defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      size: 'l',
      readonly: false,
    },
  };
}
