import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-toggle',
  templateUrl: './toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleComponent extends FieldType {
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      size: 'l',
      showIcons: true,
      singleColor: false,
    },
  };
}
