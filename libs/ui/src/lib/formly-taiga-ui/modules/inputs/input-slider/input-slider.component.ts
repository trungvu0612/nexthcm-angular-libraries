import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-input-slider',
  templateUrl: './input-slider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSliderComponent extends FieldType {
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      label: '',
      maxLabel: '',
      minLabel: '',
      quantum: 1,
      secondary: '',
      size: 'l',
    },
  };
}
