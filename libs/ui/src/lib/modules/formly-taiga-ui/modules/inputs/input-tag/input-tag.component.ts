import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'hcm-formly-input-tag',
  templateUrl: './input-tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTagComponent extends FieldType {
  override defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      textfieldSize: 'l',
    },
  };
}
