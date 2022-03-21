import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'hcm-formly-text-area',
  templateUrl: './text-area.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextAreaComponent extends FieldType {
  override defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      textfieldSize: 'l',
      expandable: false,
      rows: 4,
    },
  };
}
