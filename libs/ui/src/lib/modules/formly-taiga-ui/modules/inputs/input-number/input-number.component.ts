import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NUMBER_FORMAT } from '@nexthcm/cdk';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { TUI_NUMBER_FORMAT } from '@taiga-ui/core';

@Component({
  selector: 'formly-input-number',
  templateUrl: './input-number.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: TUI_NUMBER_FORMAT, useValue: NUMBER_FORMAT }],
})
export class InputNumberComponent extends FieldType {
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      textfieldSize: 'l',
      min: -Infinity,
      max: Infinity,
      postfix: '',
      precision: 2,
      decimal: 'not-zero',
    },
  };
}
