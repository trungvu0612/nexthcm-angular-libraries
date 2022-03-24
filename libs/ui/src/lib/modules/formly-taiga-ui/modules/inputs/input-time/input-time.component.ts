import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'hcm-formly-input-time',
  templateUrl: './input-time.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTimeComponent extends FieldType {
  override defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      textfieldSize: 'l',
      mode: 'HH:MM',
      strict: false,
      itemSize: 'm',
      textfieldLabelOutside: true,
    },
  };
}
