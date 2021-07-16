import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-input-tag',
  templateUrl: './input-tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTagComponent extends FieldType {
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      textfieldSize: 'l',
    },
  };
}
