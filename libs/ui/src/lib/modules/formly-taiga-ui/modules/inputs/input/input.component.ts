import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { TuiTextMaskOptions } from '@taiga-ui/core';

@Component({
  selector: 'hcm-formly-input',
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent extends FieldType {
  override defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      textfieldSize: 'l',
      textMask: { mask: () => false, guide: false } as TuiTextMaskOptions,
    },
  };
}
