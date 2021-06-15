import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-input-file',
  templateUrl: './input-file.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFileComponent extends FieldType {
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      accept: '',
      link: 'Choose a file',
    },
  };
}
